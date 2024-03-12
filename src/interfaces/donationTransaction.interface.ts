import { ObjectId } from 'mongoose';

export interface IDonationTransaction {
  amount: number;
  donationId: ObjectId;
  donatedBy: ObjectId;
}
