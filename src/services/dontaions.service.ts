import { IDonations } from '../interfaces/donations.interface';
import { Donations } from '../models/donations.model';
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary';

const createDonationFromDB = async (
  donationImgPath: string,
  donationsData: Partial<IDonations>,
) => {
  const donationImgURL = await uploadOnCloudinary(donationImgPath);

  const donationObj = {
    ...donationsData,
    donationImage: donationImgURL?.secure_url || null,
  };

  const result = Donations.create(donationObj);
  return result;
};

const getAllDonationsFromDB = async () => {
  const result = Donations.find();
  return result;
};

const getSingleDonationFromDB = async (donationsId: string) => {
  const result = Donations.findById(donationsId);
  return result;
};

const updateDonationFromDB = async (
  donationsId: string,
  donationsData: IDonations,
) => {
  const result = Donations.findByIdAndUpdate(donationsId, donationsData, {
    new: true,
  });
  return result;
};

const deleteDonationsFromDB = async (donationsId: string) => {
  const result = Donations.findByIdAndDelete(donationsId);
  return result;
};

export const DonationServices = {
  createDonationFromDB,
  getAllDonationsFromDB,
  getSingleDonationFromDB,
  updateDonationFromDB,
  deleteDonationsFromDB,
};
