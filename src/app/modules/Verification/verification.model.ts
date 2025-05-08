import { model, Schema } from 'mongoose';
import { IVerification } from './verification.interface';
import {
  VERIFICATION_STATUS,
  VERIFICATION_TYPE,
} from './verification.constant';

// Define the schema for the Verification model
const verificationSchema = new Schema<IVerification>(
  {
    authId: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    verifiedAt: {
      type: Date,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(VERIFICATION_TYPE),
    },
    status: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: 'pending',
    },
  },
  { timestamps: true },
);

// Create the Verification model using this schema
export const Verification = model<IVerification>(
  'Verification',
  verificationSchema,
);
