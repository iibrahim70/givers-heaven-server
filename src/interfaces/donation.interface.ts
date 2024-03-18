import { ObjectId } from 'mongoose';

export interface IDonation {
  title: string;
  donationImage: string;
  category: string;
  amount: number;
  description: string;
  createdBy: ObjectId;
}
