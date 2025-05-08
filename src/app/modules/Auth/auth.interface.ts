import { Model, ObjectId } from 'mongoose';
import { TUserRole, TUserStatus } from '../User/user.interface';

export interface IAuth {
  _id: ObjectId;
  email: string;
  password: string;
  passwordChangedAt: Date;
  role: TUserRole;
  status: TUserStatus;
  isActive: boolean;
  isBlocked: boolean;
  isVerified: boolean;
}

// Interface for the Auth model methods
export interface AuthModel extends Model<IAuth> {
  isUserExistsByEmail(email: string): Promise<IAuth>; // Check if a user exists by email

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>; // Compare a plaintext password with a hashed password

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTime: Date,
    jwtIssuedTime: number,
  ): Promise<boolean>; // Check if a JWT was issued before the last password change

  verifyOtp(email: string, otp: number): Promise<boolean>; // Verify OTP for user authentication
}
