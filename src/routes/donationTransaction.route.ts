import { Router } from 'express';
import { DonationTransactionsControllers } from '../controllers/donationTransaction.controller';

const router = Router();

// get route
router.get('/leaderboard', DonationTransactionsControllers.getTopDonors);

// post route
router.post(
  '/donate',
  DonationTransactionsControllers.createDonationTransaction,
);

// post and get
router.post(
  '/monthly-total-donations-for-year',
  DonationTransactionsControllers.getMonthlyTotalDonationsForYear,
);

export const DonationTransactionsRoute = router;
