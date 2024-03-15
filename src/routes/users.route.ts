import { Router } from 'express';
import { UsersControllers } from '../controllers/users.controller';

const router = Router();

router.post('/register', UsersControllers.createUser);
router.post('/login', UsersControllers.loginUser);

export const UsersRoute = router;
