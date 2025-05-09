import { ICause } from './cause.interface';
import { Cause } from './cause.model';

const createCauseFromDB = async (CauseData: ICause) => {
  const result = Cause.create(CauseData);
  return result;
};

const getAllCausesFromDB = async () => {
  const result = Cause.find();
  return result;
};

const getSingleCauseFromDB = async (CauseId: string) => {
  const result = Cause.findById(CauseId);
  return result;
};

const updateCauseFromDB = async (CauseId: string, CauseData: ICause) => {
  const result = Cause.findByIdAndUpdate(CauseId, CauseData, {
    new: true,
  });
  return result;
};

const deleteCausesFromDB = async (CauseId: string) => {
  const result = Cause.findByIdAndDelete(CauseId);
  return result;
};

export const CauseServices = {
  createCauseFromDB,
  getAllCausesFromDB,
  getSingleCauseFromDB,
  updateCauseFromDB,
  deleteCausesFromDB,
};
