// Helper to extract public_id from Cloudinary image URL
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../utils/cloudinary";


export function extractPublicIdFromUrl(imageUrl: string): string | null {
  try {
    const parts = imageUrl.split("/upload/");
    if (parts.length < 2) return null;

    // Remove the version (e.g., "v1746601109") and extension
    const pathSegments = parts[1].split("/");
    pathSegments.shift(); // remove version
    const publicIdWithExt = pathSegments.join("/");
    const publicId = publicIdWithExt.split(".")[0];

    return publicId;
  } catch (error) {
    return null;
  }
}

export const streamUpload = (buffer: Buffer, folder: string) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: uuidv4(),
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(buffer);
  });
};