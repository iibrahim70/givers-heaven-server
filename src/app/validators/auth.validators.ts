import httpStatus from 'http-status';
import { ApiError } from '../errors/ApiError';
import { IAuth } from '../modules/Auth/auth.interface';
import { Auth } from '../modules/Auth/auth.model';

// Checks if user exists
export const validateUserExists = (user: IAuth) => {
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist.',
    );
  }
};

// Checks if user's email is verified
export const validateUserIsVerified = (isVerified: IAuth['isVerified']) => {
  if (!isVerified) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Please verify your email before logging in.',
    );
  }
};

// Checks if user's account is not blocked
export const validateUserIsNotBlocked = (isBlocked: IAuth['isBlocked']) => {
  if (isBlocked) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is blocked. Please contact support.',
    );
  }
};

// Checks if token is valid after password change
export const validateTokenNotExpiredDueToPasswordChange = async (
  passwordChangedAt: IAuth['passwordChangedAt'],
  tokenIssuedAt: number,
) => {
  if (
    passwordChangedAt &&
    (await Auth.isJWTIssuedBeforePasswordChanged(
      passwordChangedAt,
      tokenIssuedAt,
    ))
  ) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Session expired due to password change.',
    );
  }
};

// Validates user with existence, block status, optional verification, and optional token validity
export const validateUser = (
  user: IAuth,
  options:
    | { requireVerified?: boolean; requireTokenNotExpired?: false }
    | {
        requireVerified?: boolean;
        requireTokenNotExpired: true;
        tokenIssuedAt: number;
      } = {},
) => {
  // Validate user existence
  validateUserExists(user);

  // Validate user is not blocked
  validateUserIsNotBlocked(user?.isBlocked);

  // Validate email verification if required
  if (options?.requireVerified) {
    validateUserIsVerified(user?.isVerified);
  }

  // Validate token if required and tokenIssuedAt is provided
  if (options?.requireTokenNotExpired) {
    if (options.tokenIssuedAt === undefined) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Token issued time is required for token validation.',
      );
    }

    validateTokenNotExpiredDueToPasswordChange(
      user?.passwordChangedAt,
      options?.tokenIssuedAt,
    );
  }
};
