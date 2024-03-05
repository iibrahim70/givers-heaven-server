import { Router } from 'express';
import { UsersRoute } from './users.route';

const router = Router();

const routes = [{ path: '/users', route: UsersRoute }];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
