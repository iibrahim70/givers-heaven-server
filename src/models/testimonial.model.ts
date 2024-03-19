import { Schema, model } from 'mongoose';
import { ITestimonial } from '../interfaces/testimonial.interface';

const testimonialSchema = new Schema<ITestimonial>(
  {
    // Add a reference to the Users model
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Testimonial = model<ITestimonial>(
  'Testimonials',
  testimonialSchema,
);
