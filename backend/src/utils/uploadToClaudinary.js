import cloudinary from 'cloudinary';
import path from 'path';
import { getEnvVar } from './getEnvVar.js';

cloudinary.v2.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

export function uploadToCloudinary(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext);

  return cloudinary.v2.uploader.upload(filePath, {
    resource_type: isImage ? 'image' : 'raw',
  });
}