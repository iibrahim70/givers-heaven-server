import { Router } from 'express';
import { DonationControllers } from '../controllers/donations.controller';
import { upload } from '../middlewares/multer';
// import { UsersControllers } from '../controllers/users.controller';

const router = Router();

router.post(
  '/create-donation',
  upload.single('donationImage'),
  DonationControllers.createDonation,
);

export const DonationsRoute = router;
