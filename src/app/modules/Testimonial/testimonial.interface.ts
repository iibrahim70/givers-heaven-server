import { ObjectId } from 'mongoose';

export interface ITestimonial {
  createdBy: ObjectId;
  fullName: string;
  designation: string;
  testimonial: string;
  userImage: string;
}
