import { ITestimonial } from '../interfaces/testimonial.interface';
import { Testimonial } from '../models/testimonial.model';

const createTestimonialFromDB = async (testimonialData: ITestimonial) => {
  const result = Testimonial.create(testimonialData);
  return result;
};

const getAllTestimonialsFromDB = async () => {
  const result = Testimonial.find();
  return result;
};

export const TestimonialServices = {
  createTestimonialFromDB,
  getAllTestimonialsFromDB,
};
