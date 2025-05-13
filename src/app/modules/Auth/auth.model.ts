import { model, Schema } from 'mongoose';
import { AuthModel, IAuth } from './auth.interface';
import { USER_ROLE, USER_STATUS } from '../User/user.constant';
import bcrypt from 'bcrypt';
import { envConfig } from '../../config';

// Define the schema for the Auth model
const authSchema = new Schema<IAuth, AuthModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 16,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: 'USER',
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: 'active',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Hash password before saving
authSchema.pre('save', async function (next) {
  // Only hash if password is new or changed
  this.password = await bcrypt.hash(
    this.password,
    Number(envConfig.bcryptSaltRounds),
  );

  next();
});

// Check if a user exists by email
authSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await Auth.findOne({ email });
};

// Compare plain text password with hashed password
authSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

// Check if JWT was issued before password change
authSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedAt: Date,
  jwtIssuedTime: number,
) {
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTime;
};

// Create the Auth model using this schema
export const Auth = model<IAuth, AuthModel>('Auth', authSchema);
