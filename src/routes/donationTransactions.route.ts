import { Router } from 'express';
import { DonationTransactionsControllers } from '../controllers/donationTransactions.controller';

const router = Router();

router.post(
  '/donate',
  DonationTransactionsControllers.createDonationTransactions,
);
router.post(
  '/yearly-total',
  DonationTransactionsControllers.getTotalDonationsForYear,
);
export const DonationTransactionsRoute = router;
