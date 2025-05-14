/* eslint-disable @typescript-eslint/no-unused-vars */

import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { ApiError } from '../errors/ApiError';
import httpStatus from 'http-status';

// Function to create JWT token
export const createJwtToken = (
  payload: object,
  secret: Secret,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
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
