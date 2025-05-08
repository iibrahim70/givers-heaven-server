import { IDonationTransaction } from '../interfaces/donationTransaction.interface';
import { DonationTransaction } from '../models/donationTransaction.model';

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
  transactionData: IDonationTransaction,
) => {
  const result = DonationTransaction.create(transactionData);
  return result;
};

const getMonthlyTotalDonationsForYearFromDB = async (year: number) => {
  const monthlyTotals = [];

  for (let month = 1; month <= 12; month++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const total = await DonationTransaction.aggregate([
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

const getTopDonorsFromDB = async () => {
  const topDonors = await DonationTransaction.aggregate([
    {
      $group: {
        _id: '$donatedBy', // Group by the user who made the donation
        totalDonation: { $sum: '$amount' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'doner',
      },
    },
    {
      $project: {
        _id: 0,
        donorName: { $arrayElemAt: ['$doner.userName', 0] }, // Assuming 'userName' is the field for usernames
        totalDonation: 1,
      },
    },
    {
      $sort: { totalDonation: -1 }, // Sort in descending order
    },
    {
      $limit: 10, // Get the top 10 donors
    },
  ]);

  return topDonors.map((donor, index) => ({
    rank: index + 1,
    donorName: donor.donorName,
    totalDonation: donor.totalDonation,
  }));
};

export const DonationTransactionServices = {
  createDonationTransactionsFromDB,
  getMonthlyTotalDonationsForYearFromDB,
  getTopDonorsFromDB,
};
