import { Router } from 'express';
import { UsersControllers } from '../controllers/users.controller';

const router = Router();

router.post('/create-user', UsersControllers.createUser);

export const UsersRoute = router;
