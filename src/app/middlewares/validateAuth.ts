import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { TUserRole } from '../modules/User/user.interface';
import { verifyJwtToken } from '../utils/jwt';
import { Auth } from '../modules/Auth/auth.model';
import { catchAsync } from '../utils/catchAsync';
import { envConfig } from '../config';
import { UserValidators } from '../validators/user.validators';

export const validateAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Step 1: Check authorization header
    const bearerToken = req?.headers?.authorization;

    if (!bearerToken) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Access token missing from authorization header.',
      );
    }

    // Step 2: Validate token format
    if (!bearerToken.startsWith('Bearer ')) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authorization header must start with "Bearer <token>".',
      );
    }

    // Step 3: Extract and verify token
    const token = bearerToken.split(' ')[1];
    const decoded = verifyJwtToken(token, envConfig.jwtAccessSecret as string);

    // Step 4: Confirm user exists
    const existingUser = await Auth.findById(decoded?.authId);

    if (!existingUser) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'User with this email does not exist!',
      );
    }

    // Step 5: Check user is verified and active
    UserValidators.ensureUserIsVerified(existingUser.isVerified);
    UserValidators.ensureUserIsNotBlocked(existingUser.isBlocked);

    // Step 6: Check if password was changed after token was issued
    if (
      existingUser.passwordChangedAt &&
      (await Auth.isJWTIssuedBeforePasswordChanged(
        existingUser?.passwordChangedAt,
        decoded?.iat as number,
      ))
    ) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Session expired due to password change.',
      );
    }

    // Step 7: Verify role access
    if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You do not have access to this resource.',
      );
    }

    // Step 8: Attach user info and proceed
    req.user = decoded as JwtPayload;
    next();
  });
};
