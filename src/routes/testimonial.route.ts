import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { TestimonialControllers } from '../controllers/testimonial.controller';
import { testimonialValidationSchema } from '../validations/testimonial.validation';

const router = Router();

// get route
router.get('/', TestimonialControllers.getAllTestimonials);

// post route
router.post(
  '/create-testimonial',
  validateRequest(testimonialValidationSchema),
  TestimonialControllers.createTestimonial,
);

export const TestimonialRoutes = router;
