import { Schema, model } from 'mongoose';
import { IDonationTransactions } from '../interfaces/donationTransactions.interface';

const donationTransactionsSchema = new Schema<IDonationTransactions>(
  {
    donationId: {
      type: Schema.Types.ObjectId,
      ref: 'Donations',
      required: true,
    },
    donatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const DonationTransactions = model<IDonationTransactions>(
  'DonationTransactions',
  donationTransactionsSchema,
  'donationTransactions',
);
