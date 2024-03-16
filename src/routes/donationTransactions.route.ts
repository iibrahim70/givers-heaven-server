import { Router } from 'express';
import { DonationTransactionsControllers } from '../controllers/donationTransactions.controller';

const router = Router();

// get route
router.get('/leaderboard', DonationTransactionsControllers.getTopDonors);

// post route
router.post(
  '/donate',
  DonationTransactionsControllers.createDonationTransactions,
);

// post and get
router.post(
  '/monthly-total-donations-for-year',
  DonationTransactionsControllers.getMonthlyTotalDonationsForYear,
);

export const DonationTransactionsRoute = router;
