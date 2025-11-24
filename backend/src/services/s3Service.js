import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @returns {Promise<{publicId: string, url: string}>} Cloudinary public ID and URL
 */
export const uploadFileToCloudinary = async (fileBuffer, fileName, mimeType) => {
  try {
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'kramik-assignments',
          public_id: uniqueFileName,
          resource_type: 'raw', // For non-image files (PDFs, docs, etc.)
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              publicId: result.public_id,
              url: result.secure_url,
            });
          }
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
};

/**
 * Get a file URL from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {string} File URL
 */
export const getFileUrl = (publicId) => {
  try {
    return cloudinary.url(publicId, {
      resource_type: 'raw',
      secure: true,
    });
  } catch (error) {
    console.error('Cloudinary GetUrl Error:', error);
    throw new Error('Failed to generate download URL');
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
export const deleteFileFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
    });
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    throw new Error('Failed to delete file from cloud storage');
  }
};

export default {
  uploadFileToCloudinary,
  getFileUrl,
  deleteFileFromCloudinary,
};
