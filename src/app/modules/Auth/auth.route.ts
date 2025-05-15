import { Router } from 'express';
import { validateAuth } from '../../middlewares/validateAuth';
import { USER_ROLE } from '../User/user.constant';
import { AuthControllers } from './auth.controller';

const router = Router();

router.post('/login', AuthControllers.loginUser);

router.post('/verify-email', AuthControllers.verifyEmail);

router.post('/forgot-password', AuthControllers.forgotPassword);

router.post('/verify-otp', AuthControllers.verifyOtp);

router.post('/reset-password', AuthControllers.resetPassword);

router.post(
  '/change-password',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  AuthControllers.changePassword,
);

router.post('/refresh-token', AuthControllers.issueNewAccessToken);

export const AuthRoutes = router;
