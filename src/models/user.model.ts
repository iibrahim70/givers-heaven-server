import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import config from '../config';
import bcrypt from 'bcrypt';

const usersSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// pre save middleware
usersSchema.pre('save', async function (next) {
  // hasing the password and save into db
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcryptSaltRounds),
  );
  next();
});

// deleting password field
usersSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  return userObject;
};

export const Users = model<IUser>('Users', usersSchema);
