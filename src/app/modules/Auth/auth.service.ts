import httpStatus from 'http-status';
import { ApiError } from '../../errors/ApiError';
import bcrypt from 'bcrypt';
import { User } from '../User/user.model';
import { createJwtToken, verifyJwtToken } from '../../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';
import path from 'path';
import { sendEmail } from '../../helpers/emailService';
import ejs from 'ejs';
import { generateOtp } from '../../helpers/generateOtp';
import { Auth } from './auth.model';
import { Verification } from '../Verification/verification.model';
import {
  VERIFICATION_STATUS,
  VERIFICATION_TYPE,
} from '../Verification/verification.constant';
import { envConfig } from '../../config';
import { UserValidators } from '../../validators/user.validators';
import {
  ILoginUserPayload,
  ISendVerificationOtpPayload,
  IVerifyOtpToPayload,
} from './auth.interface';
import { VerificationValidators } from '../../validators/verification.validators';

const loginUserToDB = async ({ email, password }: ILoginUserPayload) => {
  // Check if the user exists with the given email
  const existingUser = await Auth.isUserExistsByEmail(email);

  UserValidators.ensureUserExists(existingUser);
  UserValidators.ensureUserIsVerified(existingUser.isVerified);
  UserValidators.ensureUserIsNotBlocked(existingUser.isBlocked);

  // Verify the provided password
  const isPasswordValid = await Auth.isPasswordMatched(
    password,
    existingUser?.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid password provided!');
  }

  // Generate JWT token for user authentication
  const jwtPayload = {
    authId: existingUser?._id,
    email: existingUser?.email,
    role: existingUser?.role,
  };

  const accessToken = createJwtToken(
    jwtPayload,
    envConfig.jwtAccessSecret as string,
    envConfig.jwtAccessExpiresIn as string,
  );

  const refreshToken = createJwtToken(
    jwtPayload,
    envConfig.jwtRefreshSecret as string,
    envConfig.jwtRefreshExpiresIn as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const sendVerificationOtpToDB = async ({
  email,
  verificationType,
}: ISendVerificationOtpPayload) => {
  // Step 1: Validate required inputs
  if (!email || !verificationType) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Email and verification type are required.',
    );
  }

  // Step 2: Check verification type
  VerificationValidators.ensureSupportedVerificationType(verificationType);

  // Step 3: Get auth by email
  const existingAuth = await Auth.isUserExistsByEmail(email);

  // Step 4: Check user validity
  UserValidators.ensureUserExists(existingAuth);
  UserValidators.ensureUserIsNotBlocked(existingAuth?.isBlocked);

  // Step 5: Get user details
  const existingUser = await User.findOne({ authId: existingAuth?._id });

  // Step 6: Check already verified
  const isAlreadyVerified =
    verificationType === VERIFICATION_TYPE['email-verify'] &&
    existingAuth.isVerified;

  if (isAlreadyVerified) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This email has already been verified.',
    );
  }

  // Step 7: Generate OTP and expiry
  const otp = generateOtp();
  const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Step 8: Choose email template
  const isEmailVerification =
    verificationType === VERIFICATION_TYPE['email-verify'];

  const templateFileName = isEmailVerification
    ? 'verifyEmailTemplate.ejs'
    : 'forgotPasswordTemplate.ejs';

  const emailSubject = isEmailVerification
    ? 'Verify Your Email Address - Givers Heaven'
    : 'Reset Your Password - Givers Heaven';

  // Step 9: Render template content
  const templatePath = path.join(
    process.cwd(),
    'src',
    'app',
    'templates',
    templateFileName,
  );

  const html = await ejs.renderFile(templatePath, {
    name: existingUser?.name ?? 'User',
    otp,
  });

  // Step 10: Send the email
  await sendEmail({ to: existingAuth?.email, subject: emailSubject, html });

  // Step 11: Save OTP to DB
  await Verification.create({
    authId: existingAuth?._id,
    otp,
    expireAt,
    type: verificationType,
  });
};

const verifyOtpToDB = async ({
  email,
  otp,
  verificationType,
}: IVerifyOtpToPayload) => {
  // Step 1: Validate inputs
  if (!email || !otp || !verificationType) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Email, OTP, and verification type are required.',
    );
  }

  // Step 2: Check verification type
  VerificationValidators.ensureSupportedVerificationType(verificationType);

  // Step 3: Fetch user by email
  const existingUser = await Auth.isUserExistsByEmail(email);

  // Step 4: Check user validity
  UserValidators.ensureUserExists(existingUser);
  UserValidators.ensureUserIsNotBlocked(existingUser?.isBlocked);

  // Step 5: Get latest OTP record
  const verificationRecord = await Verification.findOne({
    authId: existingUser?._id,
    type: verificationType,
  }).sort({ createdAt: -1 });

  if (!verificationRecord) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'OTP is invalid or has expired.',
    );
  }

  // Step 6: Match OTP values
  if (verificationRecord?.otp !== otp) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Incorrect OTP. Please check and try again!',
    );
  }

  // Step 7: Handle email verification
  if (verificationType === VERIFICATION_TYPE['email-verify']) {
    if (existingUser?.isVerified) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'This email has already been verified.',
      );
    }

    // Mark user as verified
    await Auth.findByIdAndUpdate(existingUser._id, { isVerified: true });
  }

  // Step 8: Handle password reset verification
  if (
    verificationType === VERIFICATION_TYPE['password-reset'] &&
    !existingUser?.isVerified
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User account is not verified!');
  }

  // Step 9: Update verification status
  await Verification.findByIdAndUpdate(verificationRecord._id, {
    status: VERIFICATION_STATUS.verified,
    verifiedAt: new Date(),
  });

  // Step 10: Generate JWT token
  const accessToken = createJwtToken(
    {
      authId: existingUser?._id,
      email: existingUser?.email,
      role: existingUser?.role,
    },
    envConfig.jwtAccessSecret as string,
    envConfig.jwtAccessExpiresIn as string,
  );

  // Step 11: Return result
  return {
    message:
      verificationType === VERIFICATION_TYPE['email-verify']
        ? 'Email verified successfully!'
        : 'OTP verified successfully for password reset.',
    accessToken,
  };
};

const resetPasswordToDB = async (
  token: string,
  payload: { newPassword: string },
) => {
  const { newPassword } = payload;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const decoded = verifyJwtToken(token, envConfig.jwtAccessSecret as string);

  // Fetch user info
  const existingUser = await Auth.isUserExistsByEmail(decoded?.email);

  // If no user is found with the given email, throw a NOT_FOUND error
  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  if (existingUser?.isBlocked) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User account is blocked!');
  }

  // Ensure the new password is different from the current password
  const isSamePassword = await Auth.isPasswordMatched(
    newPassword,
    existingUser?.password,
  );

  if (isSamePassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'New password must differ from the current one!',
    );
  }

  // Hash the new password using bcrypt with the envConfigured salt rounds
  const hashPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(envConfig.bcryptSaltRounds),
  );

  await User.findByIdAndUpdate(existingUser?._id, {
    password: hashPassword,
    passwordChangedAt: new Date(),
  });
};

const changePasswordToDB = async (
  user: JwtPayload,
  payload: { currentPassword: string; newPassword: string },
) => {
  const { currentPassword, newPassword } = payload;

  // Fetch user info
  const existingUser = await Auth.isUserExistsByEmail(user?.email);

  // Check current password
  const isPasswordValid = await Auth.isPasswordMatched(
    currentPassword,
    existingUser?.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid password provided!');
  }

  // Ensure the new password is different
  const isSamePassword = await Auth.isPasswordMatched(
    newPassword,
    existingUser?.password,
  );

  if (isSamePassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'New password must differ from the current one!',
    );
  }

  // Hash the new password before saving
  const hashPassword = await bcrypt.hash(
    newPassword,
    Number(envConfig.bcryptSaltRounds),
  );

  // Update user with new password
  await Auth.findByIdAndUpdate(existingUser?._id, {
    password: hashPassword,
    passwordChangedAt: new Date(),
  });
};

const issueNewAccessToken = async (token: string) => {
  // Check if the token is provided
  if (!token) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required!');
  }

  // checking if the given token is valid
  const decoded = verifyJwtToken(token, envConfig.jwtRefreshSecret as string);

  // Fetch user info
  const existingUser = await Auth.isUserExistsByEmail(decoded?.email);

  UserValidators.ensureUserExists(existingUser);
  UserValidators.ensureUserIsNotBlocked(existingUser?.isBlocked);
  UserValidators.ensureTokenNotExpiredDueToPasswordChange(
    existingUser.passwordChangedAt,
    decoded.iat as number,
  );

  const jwtPayload = {
    userId: existingUser?._id,
    email: existingUser?.email,
    role: existingUser?.role,
  };

  const accessToken = createJwtToken(
    jwtPayload,
    envConfig.jwtAccessSecret as string,
    envConfig.jwtAccessExpiresIn as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUserToDB,
  sendVerificationOtpToDB,
  verifyOtpToDB,
  resetPasswordToDB,
  changePasswordToDB,
  issueNewAccessToken,
};
