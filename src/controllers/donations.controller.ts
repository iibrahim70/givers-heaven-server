import httpStatus from 'http-status';
import { DonationServices } from '../services/dontaions.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

const createDonation = catchAsync(async (req, res) => {
  const donationsData = req.body;

  const result = await DonationServices.createDonationFromDB(donationsData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation created successfully!',
    data: result,
  });
});

const getAllDonations = catchAsync(async (req, res) => {
  const result = await DonationServices.getAllDonationsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All donations retrieved successfully!',
    data: result,
  });
});

const getSingleDonation = catchAsync(async (req, res) => {
  const donationId = req.params.id;

  const result = await DonationServices.getSingleDonationFromDB(donationId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation retrieved successfully!',
    data: result,
  });
});

const updateDonation = catchAsync(async (req, res) => {
  const donationId = req.params.id;
  const updatedData = req.body;

  const result = await DonationServices.updateDonationFromDB(
    donationId,
    updatedData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation updated successfully!',
    data: result,
  });
});

const deleteDonation = catchAsync(async (req, res) => {
  const donationId = req.params.id;

  const result = await DonationServices.deleteDonationsFromDB(donationId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donation deleted successfully!',
    data: result,
  });
});

export const DonationControllers = {
  createDonation,
  getAllDonations,
  getSingleDonation,
  updateDonation,
  deleteDonation,
};
