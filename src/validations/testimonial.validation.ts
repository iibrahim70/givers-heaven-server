import { z } from 'zod';

export const testimonialValidationSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full Name is required.',
      invalid_type_error: 'Full Name must be a string.',
    }),
    designation: z.string({
      required_error: 'Designation is required.',
      invalid_type_error: 'Designation must be a string.',
    }),
    testimonial: z.string({
      required_error: 'Testimonial is required.',
      invalid_type_error: 'Testimonial must be a string.',
    }),
    userImage: z.string({
      required_error: 'Image URL is required.',
      invalid_type_error: 'Image URL must be a string.',
    }),
  }),
});
