import { Router } from 'express';
import { DonationTransactionControllers } from '../controllers/donationTransaction.controller';

const router = Router();

// get route
router.get('/leaderboard', DonationTransactionControllers.getTopDonors);

// post route
router.post(
  '/donate',
  DonationTransactionControllers.createDonationTransaction,
);

// post and get
router.post(
  '/monthly-total-donations-for-year',
  DonationTransactionControllers.getMonthlyTotalDonationsForYear,
);

export const DonationTransactionRoutes = router;
