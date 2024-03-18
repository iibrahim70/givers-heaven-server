import { Router } from 'express';
import { UsersRoute } from './user.route';
import { DonationsRoute } from './donation.route';
import { DonationTransactionsRoute } from './donationTransaction.route';

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
  {
    path: '/donation-transactions',
    route: DonationTransactionsRoute,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
