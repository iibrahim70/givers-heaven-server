import { Router } from 'express';
import { UsersRoute } from './users.route';
import { DonationsRoute } from './donations.route';

const router = Router();

const routes = [
  {
    path: '/users',
    route: UsersRoute,
  },
  {
    path: '/donations',
    route: DonationsRoute,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
