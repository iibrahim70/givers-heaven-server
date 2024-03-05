import { ObjectId } from 'mongoose';

export interface IDonations {
  title: string;
  donationImage: string;
  category: string;
  amount: number;
  description: string;
  createdBy: ObjectId;
}
