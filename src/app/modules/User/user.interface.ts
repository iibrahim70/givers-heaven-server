import { GENDER, USER_ROLE, USER_STATUS } from './user.constant';
import { ObjectId } from 'mongoose';

// Type definitions based on user constants
export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;
export type TGender = keyof typeof GENDER;

export interface IUser {
  _id: ObjectId;
  authId: ObjectId;
  name: string;
  avatar: string;
  phoneNumber: string;
  gender: TGender;
  dateOfBirth: Date;
  address: string;
}
