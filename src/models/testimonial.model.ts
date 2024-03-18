import { Schema, model } from 'mongoose';
import { ITestimonial } from '../interfaces/testimonial.interface';

const testimonialSchema = new Schema<ITestimonial>(
  {
    fullName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Testimonial = model<ITestimonial>('Testimonials', testimonialSchema);
