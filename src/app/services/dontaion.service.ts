import { IDonation } from '../interfaces/donation.interface';
import { Donation } from '../models/donation.model';

const createDonationFromDB = async (donationData: IDonation) => {
  const result = Donation.create(donationData);
  return result;
};

const getAllDonationsFromDB = async () => {
  const result = Donation.find();
  return result;
};

const getSingleDonationFromDB = async (donationId: string) => {
  const result = Donation.findById(donationId);
  return result;
};

const updateDonationFromDB = async (
  donationId: string,
  donationData: IDonation,
) => {
  const result = Donation.findByIdAndUpdate(donationId, donationData, {
    new: true,
  });
  return result;
};

const deleteDonationsFromDB = async (donationId: string) => {
  const result = Donation.findByIdAndDelete(donationId);
  return result;
};

export const DonationServices = {
  createDonationFromDB,
  getAllDonationsFromDB,
  getSingleDonationFromDB,
  updateDonationFromDB,
  deleteDonationsFromDB,
};
