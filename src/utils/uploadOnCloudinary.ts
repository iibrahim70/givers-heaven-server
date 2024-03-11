import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import fs from 'fs';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'image',
      folder: 'Givers Heaven/Donations',
    });

    fs.unlinkSync(localFilePath);
    return res;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};
