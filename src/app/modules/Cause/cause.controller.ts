import httpStatus from 'http-status';
import { CauseServices } from './cause.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const createCause = catchAsync(async (req, res) => {
  const CauseData = req.body;

  const result = await CauseServices.createCauseFromDB(CauseData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cause created successfully!',
    data: result,
  });
});

const getAllCauses = catchAsync(async (req, res) => {
  const result = await CauseServices.getAllCausesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Causes retrieved successfully!',
    data: result,
  });
});

const getSingleCause = catchAsync(async (req, res) => {
  const CauseId = req.params.id;

  const result = await CauseServices.getSingleCauseFromDB(CauseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cause retrieved successfully!',
    data: result,
  });
});

const updateCause = catchAsync(async (req, res) => {
  const CauseId = req.params.id;
  const updatedData = req.body;

  const result = await CauseServices.updateCauseFromDB(CauseId, updatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cause updated successfully!',
    data: result,
  });
});

const deleteCause = catchAsync(async (req, res) => {
  const CauseId = req.params.id;

  const result = await CauseServices.deleteCausesFromDB(CauseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cause deleted successfully!',
    data: result,
  });
});

export const CauseControllers = {
  createCause,
  getAllCauses,
  getSingleCause,
  updateCause,
  deleteCause,
};
