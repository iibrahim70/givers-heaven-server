import { IDonation } from '../interfaces/donation.interface';
import { Donations } from '../models/donation.model';

const createDonationFromDB = async (donationsData: IDonation) => {
  const result = Donations.create(donationsData);
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
  donationsData: IDonation,
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
