import { z } from 'zod';

export const donationValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required.',
      invalid_type_error: 'Title must be a string.',
    }),
    donationImage: z.string({
      required_error: 'Donation Image is required.',
      invalid_type_error: 'Donation Image must be a string.',
    }),
    category: z.string({
      required_error: 'Category is required.',
      invalid_type_error: 'Category must be a string.',
    }),
    amount: z.number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number.',
    }),
    description: z.string({
      required_error: 'Description is required.',
      invalid_type_error: 'Description must be a string.',
    }),
  }),
});
