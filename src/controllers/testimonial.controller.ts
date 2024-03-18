import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import { sendResponse } from '../utils/sendResponse';
import { TestimonialServices } from '../services/testimonial.service';

const createTestimonial = catchAsync(async (req, res) => {
  const testimonialData = req.body;

  const result =
    await TestimonialServices.createTestimonialFromDB(testimonialData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Testimonial created successfully!',
    data: result,
  });
});

const getAllTestimonials = catchAsync(async (req, res) => {
  const result = await TestimonialServices.getAllTestimonialsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All testimonials retrieved successfully!',
    data: result,
  });
});

export const TestimonialControllers = {
  createTestimonial,
  getAllTestimonials,
};
