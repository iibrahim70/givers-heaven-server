import { Router } from 'express';
import { DonationControllers } from '../controllers/donations.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { DonationValidationsSchema } from '../validations/donations.validation';

const router = Router();

router.post(
  '/create-donation',
  validateRequest(DonationValidationsSchema.createSchema),
  DonationControllers.createDonation,
);

export const DonationsRoute = router;
