import httpStatus from 'http-status';
import { IUser } from './user.interface';
import { ApiError } from '../../errors/ApiError';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';

const getUserProfileFromDB = async (user: JwtPayload) => {
  const result = await User.findOne({ authId: user?.authId });
  return result;
};

const updateUserProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
) => {
  // Find user by userId
  const existingUser = await User.findOne({ authId: user?.authId });

  // Check if the user owns the profile
  if (!existingUser || existingUser?.authId?.toString() !== user?.authId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to update this profile!',
    );
  }

  // Remove userId from update payload
  delete payload?.authId;

  // Update and return the user profile
  const result = await User.findOneAndUpdate(
    { authId: user?.authId },
    payload,
    { new: true },
  );

  return result;
};

export const UserServices = {
  getUserProfileFromDB,
  updateUserProfileToDB,
};
