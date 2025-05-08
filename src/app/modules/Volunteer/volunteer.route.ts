import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { VolunteerControllers } from './volunteer.controller';
import { volunteerValidationSchema } from './volunteer.validation';

const router = Router();

// get route
router.get('/', VolunteerControllers.getAllVolunteers);

// post route
router.post(
  '/create-volunteer',
  validateRequest(volunteerValidationSchema),
  VolunteerControllers.createVolunteer,
);

export const VolunteerRoutes = router;
