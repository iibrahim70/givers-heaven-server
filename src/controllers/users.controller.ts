import httpStatus from 'http-status';
import { UsersServices } from '../services/users.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  const result = await UsersServices.createUserFromDB(userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const UsersControllers = {
  createUser,
};
