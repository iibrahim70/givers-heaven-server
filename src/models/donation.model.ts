import { Schema, model } from 'mongoose';
import { IDonation } from '../interfaces/donation.interface';

const dontationsSchema = new Schema<IDonation>(
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
    // Add a reference to the Users model
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  { timestamps: true },
);

export const Donations = model<IDonation>('Donations', dontationsSchema);
