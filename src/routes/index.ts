import { Router } from 'express';
import { UserRoutes } from './user.route';
import { DonationRoutes } from './donation.route';
import { DonationTransactionRoutes } from './donationTransaction.route';
import { VolunteerRoutes } from './volunteer.route';
import { TestimonialRoutes } from './testimonial.route';

const router = Router();

const routes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/donations',
    route: DonationRoutes,
  },
  {
    path: '/donation-transactions',
    route: DonationTransactionRoutes,
  },
  {
    path: '/volunteers',
    route: VolunteerRoutes,
  },
  {
    path: '/testimonials',
    route: TestimonialRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

export default router;
