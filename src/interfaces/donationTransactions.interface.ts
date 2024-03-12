import { ObjectId } from 'mongoose';

export interface IDonationTransactions {
  amount: number;
  donationId: ObjectId;
  donatedBy: ObjectId;
}
