import { Schema, model } from 'mongoose';
import { IDonationTransaction } from '../interfaces/donationTransaction.interface';

const donationTransactionSchema = new Schema<IDonationTransaction>(
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
    message: {
      type: String,
    },
  },
  { timestamps: true },
);

export const DonationTransaction = model<IDonationTransaction>(
  'DonationTransactions',
  donationTransactionSchema,
  'donationTransactions',
);
