import { Router } from 'express';
import { UserControllers } from '../controllers/user.controller';

const router = Router();

router.post('/register', UserControllers.createUser);
router.post('/login', UserControllers.loginUser);

export const UserRoutes = router;
