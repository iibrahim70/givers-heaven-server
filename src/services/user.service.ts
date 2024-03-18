import { IUser } from '../interfaces/user.interface';
import { User } from '../models/user.model';

const createUserFromDB = async (userData: IUser) => {
  const result = User.create(userData);
  return result;
};

export const UserServices = {
  createUserFromDB,
};
