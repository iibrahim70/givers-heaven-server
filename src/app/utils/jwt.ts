/* eslint-disable @typescript-eslint/no-unused-vars */

import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';
import { envConfig } from '../config';

export const createJwtToken = (
  payload: Record<string, unknown>,
  type: 'access' | 'refresh' | 'password-reset',
) => {
  const secret =
    type === 'access'
      ? envConfig.jwtAccessSecret
      : type === 'refresh'
        ? envConfig.jwtRefreshSecret
        : envConfig.jwtPassResetSecret;

  const expiresIn =
    type === 'access'
      ? envConfig.jwtAccessExpiresIn
      : type === 'refresh'
        ? envConfig.jwtRefreshExpiresIn
        : '10m';
  return jwt.sign(payload, secret as string, { expiresIn } as SignOptions);
};

// Function to verify JWT token
export const verifyJwtToken = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Access token is expired or invalid.',
    );
  }
};

// Function to generate a random hex token
export const generateHexToken = (length: number) => {
  return randomBytes(length).toString('hex');
};
