import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { VolunteerServices } from '../services/volunteer.service';

const createVolunteer = catchAsync(async (req, res) => {
  const volunteerData = req.body;

  const result = await VolunteerServices.createVolunteerFromDB(volunteerData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Volunteer created successfully!',
    data: result,
  });
});

const getAllVolunteers = catchAsync(async (req, res) => {
  const result = await VolunteerServices.getAllVolunteersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All volunteers retrieved successfully!',
    data: result,
  });
});

export const VolunteerControllers = {
  createVolunteer,
  getAllVolunteers,
};
