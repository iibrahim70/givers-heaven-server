import httpStatus from 'http-status';
import { ApiError } from '../errors/ApiError';
import { IAuth } from '../modules/Auth/auth.interface';
import { Auth } from '../modules/Auth/auth.model';

export const validateUserExists = (user: IAuth) => {
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }
};

export const validateUserIsVerified = (isVerified: IAuth['isVerified']) => {
  if (!isVerified) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Please verify your email before logging in.',
    );
  }
};

export const validateUserIsNotBlocked = (isBlocked: IAuth['isBlocked']) => {
  if (isBlocked) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is blocked. Please contact support.',
    );
  }
};

export const validateUser = (
  user: IAuth,
  options: { requireVerified?: boolean } = {},
) => {
  validateUserExists(user);
  validateUserIsNotBlocked(user?.isBlocked);

  if (options?.requireVerified) {
    validateUserIsVerified(user?.isVerified);
  }
};

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
