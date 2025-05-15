import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../errors/ApiError';
import { TUserRole } from '../modules/User/user.interface';
import { verifyJwtToken } from '../utils/jwt';
import { Auth } from '../modules/Auth/auth.model';
import { catchAsync } from '../utils/catchAsync';
import { envConfig } from '../config';
import { validateUser } from '../validators';
import { IAuth } from '../modules/Auth/auth.interface';

// Middleware to validate JWT and authorize user access
export const validateAuth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Step 1: Get authorization header
    const bearerToken = req?.headers?.authorization;

    // Step 2: Check if token is provided
    if (!bearerToken) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Access token missing from authorization header.',
      );
    }

    // Step 3: Verify token starts with "Bearer "
    if (!bearerToken.startsWith('Bearer ')) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Authorization header must start with "Bearer <token>".',
      );
    }

    // Step 4: Extract token from header
    const token = bearerToken.split(' ')[1];

    // Step 5: Verify JWT and decode payload
    const decoded = verifyJwtToken(token, envConfig.jwtAccessSecret as string);

    // Step 6: Find user by ID from decoded token
    const existingUser = (await Auth.findById(decoded?.authId)) as IAuth;

    // Step 7: Validate user existence, verification, and token expiry
    validateUser(existingUser, {
      requireVerified: true,
      requireTokenNotExpired: true,
      tokenIssuedAt: decoded?.iat as number,
    });

    // Step 8: Check if user has required role
    if (requiredRoles && !requiredRoles.includes(decoded?.role)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'You do not have access to this resource.',
      );
    }

    // Step 9: Attach decoded user info to request
    req.user = decoded as JwtPayload;
    next();
  });
};
