import httpStatus from 'http-status';
import { ApiError } from '../../errors/ApiError';
import bcrypt from 'bcrypt';
import { User } from '../User/user.model';
import { createJwtToken, verifyJwtToken } from '../../helpers/jwtService';
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
import { TVerificationType } from '../Verification/verification.interface';
import { envConfig } from '../../config';

const loginUserToDB = async (payload: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) => {
  const { email, password } = payload;

  // Check if the user exists with the given email
  const existingUser = await Auth.isUserExistsByEmail(email);

  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  if (!existingUser?.isVerified) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Please verify your email before logging in.',
    );
  }

  if (existingUser?.isBlocked) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is blocked. Please contact support.',
    );
  }

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

const sendVerificationOtpToDB = async (payload: {
  email: string;
  verificationType: TVerificationType;
}) => {
  const { email, verificationType } = payload;

  // Fetch user info
  const existingAuth = await Auth.isUserExistsByEmail(email);
  const existingUser = await User.findOne({ authId: existingAuth?._id });

  if (!existingAuth) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  // Validate verification type
  const validTypes = [
    VERIFICATION_TYPE['email-verify'],
    VERIFICATION_TYPE['password-reset'],
  ];

  if (!validTypes.includes(verificationType)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Unsupported verification type provided.',
    );
  }

  // Prevent re-verification if already verified
  if (
    verificationType === VERIFICATION_TYPE['email-verify'] &&
    existingAuth?.isVerified
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This email address has already been verified.',
    );
  }

  // Generate OTP and set expiration time (5 mins)
  const otp = generateOtp();
  const expireAt = new Date(Date.now() + 5 * 60 * 1000);

  // Choose appropriate template and subject
  const isEmailVerification =
    verificationType === VERIFICATION_TYPE['email-verify'];

  const templateFile = isEmailVerification
    ? 'verifyEmailTemplate.ejs'
    : 'forgotPasswordTemplate.ejs';

  const subject = isEmailVerification
    ? 'Verify Your Email Address - Portfolio'
    : 'Reset Your Password - Portfolio';

  const templatePath = path.join(
    process.cwd(),
    'src',
    'app',
    'templates',
    templateFile,
  );

  // Render HTML from template
  const html = await ejs.renderFile(templatePath, {
    name: existingUser?.name,
    otp,
  });

  // Send email
  await sendEmail({ to: existingAuth?.email, subject, html });

  // Save OTP to verification collection
  await Verification.create({
    authId: existingAuth?._id,
    otp,
    expireAt,
    type: verificationType,
  });
};

const resetPasswordToDB = async (
  token: string,
  payload: { newPassword: string },
) => {
  const { newPassword } = payload;

  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const decoded = verifyJwtToken(
    token,
    envConfig.jwtAccessSecret as string,
  ) as JwtPayload;

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

const verifyOtpToDB = async (payload: {
  email: string;
  otp: number;
  verificationType: TVerificationType;
}) => {
  const { email, otp, verificationType } = payload;

  // Fetch user info
  const existingUser = await Auth.isUserExistsByEmail(email);
  const verificationRecord = await Verification.findOne({
    authId: existingUser?._id,
    type: verificationType,
  }).sort({ createdAt: -1 });

  // Handle case where the user does not exist
  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  // Validate OTP input
  if (!otp) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'OTP is required. Please check your email for the code!',
    );
  }

  // Validate verification type
  const validTypes = [
    VERIFICATION_TYPE['email-verify'],
    VERIFICATION_TYPE['password-reset'],
  ];

  if (!validTypes.includes(verificationType)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Unsupported verification type provided.',
    );
  }

  if (!verificationRecord) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'OTP is invalid or has expired. Please request a new one!',
    );
  }

  // Match the OTP
  if (verificationRecord?.otp !== otp) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Incorrect OTP. Please check and try again!',
    );
  }

  // If email verification
  if (payload?.verificationType === VERIFICATION_TYPE['email-verify']) {
    if (existingUser?.isVerified) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already verified!');
    }

    // Mark user as verified
    await Auth.findByIdAndUpdate(existingUser?._id, { isVerified: true });

    // Update verification status
    await Verification.findByIdAndUpdate(verificationRecord?._id, {
      status: VERIFICATION_STATUS.verified,
      verifiedAt: new Date(),
    });

    return {
      message: 'Email verified successfully!',
    };
  }

  // If password reset
  if (payload?.verificationType === VERIFICATION_TYPE['password-reset']) {
    if (!existingUser?.isVerified) {
      throw new ApiError(httpStatus.FORBIDDEN, 'User account is not verified!');
    }

    // Allow password reset – no need to mark as verified again
    await Verification.findByIdAndUpdate(verificationRecord?._id, {
      status: VERIFICATION_STATUS.verified,
      verifiedAt: new Date(),
    });

    // Generate access token for resetting password
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

    return {
      message: 'OTP verified successfully for password reset.',
      accessToken,
    };
  }
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

  // Handle case where no User is found
  if (!existingUser) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }

  // If the user is blocked, throw a FORBIDDEN error.
  if (existingUser?.isBlocked) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User account is blocked!');
  }

  if (
    existingUser?.passwordChangedAt &&
    (await Auth.isJWTIssuedBeforePasswordChanged(
      existingUser?.passwordChangedAt,
      decoded?.iat as number,
    ))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

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
  resetPasswordToDB,
  verifyOtpToDB,
  changePasswordToDB,
  issueNewAccessToken,
};
