import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { DonationTransactionsServices } from '../services/donationTransactions.service';

const createDonationTransactions = catchAsync(async (req, res) => {
  const transactionData = req.body;

  const result =
    await DonationTransactionsServices.createDonationTransactionsFromDB(
      transactionData,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation successful',
    data: result,
  });
});

const getTotalDonationsForYear = catchAsync(async (req, res) => {
  const { year } = req.body;

  const monthlyTotals =
    await DonationTransactionsServices.getTotalDonationsForYearFromDB(year);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Donation totals for the year ${year}`,
    data: monthlyTotals,
  });
});

export const DonationTransactionsControllers = {
  createDonationTransactions,
  getTotalDonationsForYear,
};
