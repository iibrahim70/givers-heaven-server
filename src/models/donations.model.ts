import { Schema, model } from 'mongoose';
import { IDonations } from '../interfaces/donations.interface';

const dontationsSchema = new Schema<IDonations>(
  {
    title: {
      type: String,
      required: true,
    },
    donationImage: {
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
  },
  { timestamps: true },
);

export const Donations = model<IDonations>('Donations', dontationsSchema);
