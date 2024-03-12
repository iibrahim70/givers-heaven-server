import { IDonationTransactions } from '../interfaces/donationTransactions.interface';
import { DonationTransactions } from '../models/donationTransactions.model';

const createDonationTransactionsFromDB = async (
  transactionData: IDonationTransactions,
) => {
  const result = DonationTransactions.create(transactionData);
  return result;
};

export const DonationTransactionsServices = {
  createDonationTransactionsFromDB,
};
