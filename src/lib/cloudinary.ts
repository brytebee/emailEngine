import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file (buffer or base64) to Cloudinary
 */
export async function uploadToCloudinary(fileData: string | Buffer, folder: string = "email-attachments") {
  try {
    const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "auto" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        
        if (typeof fileData === 'string') {
            // Assume it's a base64 string or URL
            cloudinary.uploader.upload(fileData, { folder, resource_type: "auto" })
                .then(resolve)
                .catch(reject);
        } else {
            uploadStream.end(fileData);
        }
    });

    return (result as any).secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}
