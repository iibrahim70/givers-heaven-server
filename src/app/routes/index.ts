import { Router } from 'express';
import { CauseRoutes } from '../modules/Cause/cause.route';
import { VolunteerRoutes } from '../modules/Volunteer/volunteer.route';
import { TestimonialRoutes } from '../modules/Testimonial/testimonial.route';
import { UserRoutes } from '../modules/User/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

const router = Router();

const routes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/causes',
    route: CauseRoutes,
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
