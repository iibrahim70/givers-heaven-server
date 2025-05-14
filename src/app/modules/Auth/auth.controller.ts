import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { envConfig } from '../../config';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserToDB(req?.body);

  // Determine maxAge based on 'rememberMe' value
  const rememberMe = req?.body?.rememberMe;
  const maxAge = rememberMe ? 1000 * 60 * 60 * 24 * 30 : 0; // 30 days or session-only

  // Set refresh token cookie with the appropriate maxAge
  res.cookie('refreshToken', result?.refreshToken, {
    secure: envConfig.nodeEnv === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful. Welcome back!',
    data: { accessToken: result?.accessToken },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const result = await AuthServices.sendVerificationOtpToDB(req?.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Email verification instructions sent successfully!',
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.sendVerificationOtpToDB(req?.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset instructions sent successfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPasswordToDB(
    req?.headers?.authorization as string,
    req?.body,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password has been reset successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePasswordToDB(req?.user, req?.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully!',
    data: result,
  });
});

const verifyOtp = catchAsync(async (req, res) => {
  const result = await AuthServices.verifyOtpToDB(req?.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result?.message,
    data: { accessToken: result?.accessToken },
  });
});

const issueNewAccessToken = catchAsync(async (req, res) => {
  const result = await AuthServices.issueNewAccessToken(
    req?.cookies?.refreshToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

export const AuthControllers = {
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyOtp,
  issueNewAccessToken,
};
