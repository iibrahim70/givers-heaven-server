import { Router } from 'express';
import { UserControllers } from './user.controller';
import { validateAuth } from '../../middlewares/validateAuth';
import { USER_ROLE } from './user.constant';

const router = Router();

router.get(
  '/profile',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  UserControllers.getUserProfile,
);

router.patch(
  '/update-profile',
  validateAuth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE['SUPER-ADMIN']),
  UserControllers.updateUserProfile,
);

export const UserRoutes = router;
