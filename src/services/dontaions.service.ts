import { IDonations } from '../interfaces/donations.interface';
import { Donations } from '../models/donations.model';

const createDonationsFromDB = async (donationsData: IDonations) => {
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

export const DonationsServices = {
  createDonationsFromDB,
  getAllDonationsFromDB,
  getSingleDonationFromDB,
  updateDonationFromDB,
  deleteDonationsFromDB,
};
