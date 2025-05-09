import { Schema, model } from 'mongoose';
import { ICause } from './cause.interface';

const causeSchema = new Schema<ICause>(
  {
    title: {
      type: String,
      required: true,
    },
    CauseImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // Add a reference to the Users model
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  { timestamps: true },
);

export const Cause = model<ICause>('Causes', causeSchema);
