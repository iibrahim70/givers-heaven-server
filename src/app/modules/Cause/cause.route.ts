import { Router } from 'express';
import { CauseControllers } from './cause.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { causeValidationSchema } from './cause.validation';

const router = Router();

// get route
router.get('/:id', CauseControllers.getSingleCause);
router.get('/', CauseControllers.getAllCauses);

// post route
router.post(
  '/create-cause',
  validateRequest(causeValidationSchema),
  CauseControllers.createCause,
);

// update route
router.patch(
  '/:id',
  validateRequest(causeValidationSchema),
  CauseControllers.updateCause,
);

// delete route
router.delete('/:id', CauseControllers.deleteCause);

export const CauseRoutes = router;
