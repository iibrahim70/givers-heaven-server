import { IVolunteer } from './volunteer.interface';
import { Volunteer } from './volunteer.model';

const createVolunteerFromDB = async (volunteerData: IVolunteer) => {
  const result = Volunteer.create(volunteerData);
  return result;
};

const getAllVolunteersFromDB = async () => {
  const result = Volunteer.find();
  return result;
};

export const VolunteerServices = {
  createVolunteerFromDB,
  getAllVolunteersFromDB,
};
