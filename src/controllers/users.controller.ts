import httpStatus from 'http-status';
import { UsersServices } from '../services/users.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { Users } from '../models/users.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

const createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  // Check if the user already exists
  const existingUser = await Users.findOne({ email: req.body.email });

  if (existingUser) {
    // If user already exists, send a conflict response
    return sendResponse(res, {
      statusCode: httpStatus.CONFLICT,
      success: false,
      message: 'User already exists!',
      data: null,
    });
  }

  // Create the user if not already existing
  const result = await UsersServices.createUserFromDB(userData);

  // Send success response with the new user data
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await Users.findOne({ email });

  if (!user) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Invalid email or password',
      data: null,
    });
  }

  // Compare hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Invalid email or password',
      data: null,
    });
  }

  // Check if JWT_SECRET is defined
  if (!config.jwtSecret) {
    throw new Error('JWT secret is not defined');
  }

  // Create payload for JWT token (user data except password)
  const payload = {
    user: {
      _id: user?._id,
      email: user?.email,
      userName: user?.userName,
      phoneNumber: user?.phoneNumber,
    },
  };

  // Generate JWT token
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.expiresIn,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: payload.user,
    },
  });
});

export const UsersControllers = {
  createUser,
  loginUser,
};
