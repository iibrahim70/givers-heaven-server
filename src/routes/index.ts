import { Router } from 'express';
import { UsersRoute } from './users.route';
import { DonationsRoute } from './donations.route';
import { DonationTransactionsRoute } from './donationTransactions.route';

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
