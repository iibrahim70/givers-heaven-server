import { Router } from 'express';
import { DonationTransactionsControllers } from '../controllers/donationTransactions.controller';

const router = Router();

router.post(
  '/donate',
  DonationTransactionsControllers.createDonationTransactions,
);

export const DonationTransactionsRoute = router;
