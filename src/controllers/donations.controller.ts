import httpStatus from 'http-status';
import { DonationServices } from '../services/dontaions.service';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';

const createDonation = catchAsync(async (req, res) => {
  const donationImgPath = req.file?.path;
  const donationsData = req.body;

  const result = await DonationServices.createDonationFromDB(
    donationImgPath as string,
    donationsData,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donations are created successfully!',
    data: result,
  });
});

export const DonationControllers = {
  createDonation,
};
