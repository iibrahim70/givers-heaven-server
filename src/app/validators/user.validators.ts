import httpStatus from 'http-status';
import { ApiError } from '../errors/ApiError';
import { IAuth } from '../modules/Auth/auth.interface';

const ensureUserExists = (user: IAuth) => {
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist!',
    );
  }
};

const ensureUserIsVerified = (isVerified: IAuth['isVerified']) => {
  if (!isVerified) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Please verify your email before logging in.',
    );
  }
};

const ensureUserIsNotBlocked = (isBlocked: IAuth['isBlocked']) => {
  if (isBlocked) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account is blocked. Please contact support.',
    );
  }
};

export const UserValidators = {
  ensureUserExists,
  ensureUserIsVerified,
  ensureUserIsNotBlocked,
};
