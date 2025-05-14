import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { randomBytes } from 'crypto';

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
  return jwt.verify(token, secret) as JwtPayload;
};

// Function to generate a random hex token
export const generateHexToken = (length: number) => {
  return randomBytes(length).toString('hex');
};
