import httpStatus from 'http-status';
import { ApiError } from '../../errors/ApiError';
import bcrypt from 'bcrypt';
import { User } from '../User/user.model';
import { createJwtToken, verifyJwtToken } from '../../utils/jwt';
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
import {
  IChangePasswordPayload,
  ILoginUserPayload,
  ISendVerificationOtpPayload,
  IVerifyOtpToPayload,
} from './auth.interface';
import { JwtPayload } from 'jsonwebtoken';
import {
  validateSupportedVerificationType,
  validateTokenNotExpiredDueToPasswordChange,
  validateUser,
} from '../../validators';

const loginUserToDB = async ({ email, password }: ILoginUserPayload) => {
  // Step 2: Check if the user exists by email
  const existingUser = await Auth.isUserExistsByEmail(email);

  // Step 3: Validate user's status
  validateUser(existingUser, { requireVerified: true });

  // Step 4: Verify the provided password
  const isPasswordValid = await Auth.isPasswordMatched(
    password,
    existingUser?.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid password provided!');
  }

  // Step 5: Generate access & refresh JWT tokens
  const jwtPayload = {
    authId: existingUser?._id,
    email: existingUser?.email,
    role: existingUser?.role,
  };

  const accessToken = createJwtToken(jwtPayload, 'access');

  const refreshToken = createJwtToken(jwtPayload, 'refresh');

  // Step 6: Return tokens to the caller
  return {
    accessToken,
    refreshToken,
  };
};

const sendVerificationOtpToDB = async ({
  email,
  verificationType,
}: ISendVerificationOtpPayload) => {
  // Step 2: Check verification type
  validateSupportedVerificationType(verificationType);

  // Step 3: Check if the user exists by email
  const existingAuth = await Auth.isUserExistsByEmail(email);

  // Step 4: Validate user's
  validateUser(existingAuth);

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
  // Step 2: Check verification type
  validateSupportedVerificationType(verificationType);

  // Step 3: Fetch user by email
  const existingUser = await Auth.isUserExistsByEmail(email);

  // Step 4: Validate user's status
  validateUserExists(existingUser);
  validateUserIsNotBlocked(existingUser?.isBlocked);

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
    otp: null,
  });

  // Step 10: Generate JWT token based on verification type
  let accessToken;

  if (verificationType === VERIFICATION_TYPE['email-verify']) {
    accessToken = createJwtToken(
      {
        authId: existingUser?._id,
        email: existingUser?.email,
        role: existingUser?.role,
      },
      'access',
    );
  }

  if (verificationType === VERIFICATION_TYPE['password-reset']) {
    accessToken = createJwtToken(
      { email: existingUser?.email },
      'password-reset',
    );
  }

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
  // Step 2: Verify the token
  const decoded = verifyJwtToken(token, envConfig.jwtAccessSecret as string);

  // Step 3: Check if the user exists by email
  const existingUser = await Auth.isUserExistsByEmail(decoded?.email);

  // Step 4: Validate user's status
  validateUserExists(existingUser);
  validateUserIsVerified(existingUser.isVerified);
  validateUserIsNotBlocked(existingUser.isBlocked);

  // Step 5: Ensure token was not issued before the password was changed
  validateTokenNotExpiredDueToPasswordChange(
    existingUser.passwordChangedAt,
    decoded.iat as number,
  );

  // Step 6: Ensure the new password is not the same as the current password
  const isSamePassword = await Auth.isPasswordMatched(
    payload?.newPassword,
    existingUser?.password,
  );

  if (isSamePassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'New password must differ from the current one!',
    );
  }

  // Step 7: Hash the new password
  const hashPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(envConfig.bcryptSaltRounds),
  );

  // Step 8: Update the user's password
  await User.findByIdAndUpdate(existingUser?._id, {
    password: hashPassword,
    passwordChangedAt: new Date(),
  });
};

const changePasswordToDB = async (
  user: JwtPayload,
  payload: IChangePasswordPayload,
) => {
  // Step 1: Get user by email
  const existingUser = await Auth.isUserExistsByEmail(user?.email);

  // Step 2: Check current password validity
  const isPasswordValid = await Auth.isPasswordMatched(
    payload?.currentPassword,
    existingUser?.password,
  );

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid password provided!');
  }

  // Step 3: Ensure new password is different
  const isSamePassword = await Auth.isPasswordMatched(
    payload?.newPassword,
    existingUser?.password,
  );

  if (isSamePassword) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'New password must differ from the current one!',
    );
  }

  // Step 4: Hash the new password
  const hashPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(envConfig.bcryptSaltRounds),
  );

  // Step 5: Update password and timestamp
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

  validateUserExists(existingUser);
  validateUserIsNotBlocked(existingUser?.isBlocked);
  validateTokenNotExpiredDueToPasswordChange(
    existingUser.passwordChangedAt,
    decoded.iat as number,
  );

  const jwtPayload = {
    userId: existingUser?._id,
    email: existingUser?.email,
    role: existingUser?.role,
  };

  const accessToken = createJwtToken(jwtPayload, 'access');

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
