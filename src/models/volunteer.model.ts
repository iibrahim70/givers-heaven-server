import { Schema, model } from 'mongoose';
import { IVolunteer } from '../interfaces/volunteer.interface';

const volunteerSchema = new Schema<IVolunteer>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Volunteer = model<IVolunteer>('Volunteers', volunteerSchema);
