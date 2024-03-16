import { Router } from 'express';
import { DonationControllers } from '../controllers/donations.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { donationValidationsSchema } from '../validations/donations.validation';

const router = Router();

// get route
router.get('/:id', DonationControllers.getSingleDonation);
router.get('/', DonationControllers.getAllDonations);

// post route
router.post(
  '/create-donation',
  validateRequest(donationValidationsSchema),
  DonationControllers.createDonation,
);

// update route
router.patch(
  '/:id',
  validateRequest(donationValidationsSchema),
  DonationControllers.updateDonation,
);

// delete route
router.delete('/:id', DonationControllers.deleteDonation);

export const DonationsRoute = router;
