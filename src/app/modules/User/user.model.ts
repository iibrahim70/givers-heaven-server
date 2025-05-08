import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { GENDER } from './user.constant';

// Define the schema for the User model
const userSchema = new Schema<IUser>(
  {
    authId: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: 'https://i.ibb.co/z5YHLV9/profile.png',
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: Object.values(GENDER),
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true },
);

// Create the User model using this schema
export const User = model<IUser>('User', userSchema);
