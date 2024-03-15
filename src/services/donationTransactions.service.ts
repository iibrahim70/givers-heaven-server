import { IDonationTransactions } from '../interfaces/donationTransactions.interface';
import { DonationTransactions } from '../models/donationTransactions.model';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const createDonationTransactionsFromDB = async (
  transactionData: IDonationTransactions,
) => {
  const result = DonationTransactions.create(transactionData);
  return result;
};

const getTotalDonationsForYearFromDB = async (year: number) => {
  const monthlyTotals = [];

  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const total = await DonationTransactions.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    monthlyTotals.push({
      month: MONTHS[month - 1],
      totalAmount: total.length > 0 ? total[0].totalAmount : 0,
    });
  }

  return monthlyTotals;
};

export const DonationTransactionsServices = {
  createDonationTransactionsFromDB,
  getTotalDonationsForYearFromDB,
};
