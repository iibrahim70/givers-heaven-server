import { ObjectId } from 'mongoose';

export interface ICause {
  title: string;
  CauseImage: string;
  category: string;
  amount: number;
  description: string;
  createdBy: ObjectId;
}
