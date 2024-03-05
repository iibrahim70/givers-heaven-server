import { Schema, model } from 'mongoose';
import { IUsers } from '../interfaces/users.interface';

const usersSchema = new Schema<IUsers>(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userImg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Users = model<IUsers>('Users', usersSchema);
