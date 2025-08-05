import QRCode from 'qrcode';
import cloudinary from './cloudinary';
import { FRONTEND_ORIGIN } from './utils';

/**
 * Generates a QR code from a business URL and uploads it to Cloudinary.
 * @param businessUrl - The custom path for the restaurant
 * @param cloudinaryPublicId - The public ID to use for Cloudinary upload
 * @returns The Cloudinary URL of the uploaded QR code
 */
export const generateAndUploadQR = async (
  businessUrl: string,
  cloudinaryPublicId: string
): Promise<string> => {
//   const fullUrl = `https://my-online-menu.com/${businessUrl}`; // or keep localhost for dev
  const fullUrl = `${FRONTEND_ORIGIN}/menu/${businessUrl}`; // or keep localhost for dev
  const qrBuffer = await QRCode.toBuffer(fullUrl);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `qr_codes/${cloudinaryPublicId}`,
        folder: 'qr_codes',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    uploadStream.end(qrBuffer);
  });
};
