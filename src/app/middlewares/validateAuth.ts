import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { TUserRole } from '../modules/User/user.interface';
import { verifyJwtToken } from '../utils/jwt';
import { Auth } from '../modules/Auth/auth.model';
import { catchAsync } from '../utils/catchAsync';
import { envConfig } from '../config';

export const validateAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req?.headers?.authorization;

    // checking if the token is missing
    if (!bearerToken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    if (bearerToken && bearerToken.startsWith('Bearer')) {
      const token = bearerToken.split(' ')[1];

      // checking if the given token is valid
      const decoded = verifyJwtToken(
        token,
        envConfig.jwtAccessSecret as string,
      );

      // Check if a user with the provided email exists in the database
      const existingUser = await Auth.findById(decoded?.authId);

      // Handle case where no User is found
      if (!existingUser) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          `User with ID: ${decoded?.userId} not found!`,
        );
      }

      if (!existingUser?.isVerified) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'User account is not verified!',
        );
      }

      // If the user is blocked, throw a FORBIDDEN error.
      if (existingUser?.isBlocked) {
        throw new ApiError(httpStatus.FORBIDDEN, 'User account is blocked!');
      }

      if (
        existingUser.passwordChangedAt &&
        (await Auth.isJWTIssuedBeforePasswordChanged(
          existingUser?.passwordChangedAt,
          decoded?.iat as number,
        ))
      ) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      req.user = decoded as JwtPayload;
      next();
    }
  });
};
