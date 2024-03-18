import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { VolunteerControllers } from '../controllers/volunteer.controller';
import { volunteerValidationSchema } from '../validations/volunteer.validation';

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
