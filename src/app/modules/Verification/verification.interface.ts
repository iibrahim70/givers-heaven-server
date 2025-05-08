import { ObjectId } from 'mongoose';
import {
  VERIFICATION_STATUS,
  VERIFICATION_TYPE,
} from './verification.constant';

// Type definitions based on verification constants
export type TVerificationType = keyof typeof VERIFICATION_TYPE;
export type TVerificationStatus = keyof typeof VERIFICATION_STATUS;

export interface IVerification {
  _id: ObjectId;
  authId: ObjectId;
  otp: number;
  expireAt: Date;
  verifiedAt: Date;
  type: TVerificationType;
  status: TVerificationStatus;
}
