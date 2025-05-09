import { z } from 'zod';

export const causeValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required.',
      invalid_type_error: 'Title must be a string.',
    }),
    CauseImage: z.string({
      required_error: 'Cause Image is required.',
      invalid_type_error: 'Cause Image must be a string.',
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
