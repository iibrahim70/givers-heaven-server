import { IUser } from '../interfaces/user.interface';
import { Users } from '../models/user.model';

const createUserFromDB = async (usersData: IUser) => {
  const result = Users.create(usersData);
  return result;
};

export const UsersServices = {
  createUserFromDB,
};
