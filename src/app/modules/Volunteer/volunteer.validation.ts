import { z } from 'zod';

export const volunteerValidationSchema = z.object({
  body: z.object({
    fullName: z.string({
      required_error: 'Full Name is required.',
      invalid_type_error: 'Full Name must be a string.',
    }),
    email: z.string({
      required_error: 'Email is required.',
      invalid_type_error: 'Email must be a string.',
    }),
    phone: z.string({
      required_error: 'Phone is required.',
      invalid_type_error: 'Phone must be a string.',
    }),
    availability: z.string({
      required_error: 'Availability is required.',
      invalid_type_error: 'Availability must be a string.',
    }),
    userImage: z.string({
      required_error: 'Image URL is required.',
      invalid_type_error: 'Image URL must be a string.',
    }),
    address: z.string({
      required_error: 'Address is required.',
      invalid_type_error: 'Address must be a string.',
    }),
  }),
});
