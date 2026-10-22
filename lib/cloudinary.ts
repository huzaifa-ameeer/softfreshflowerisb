import { v2 as cloudinary } from "cloudinary";

let configured = false;

function client() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your environment.",
    );
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export type UploadedImage = {
  url: string;
  publicId: string;
  width: number;
  height: number;
};

export function uploadImageBuffer(
  buffer: Buffer,
  folder = "softfreshflower/products",
): Promise<UploadedImage> {
  const api = client();

  return new Promise((resolve, reject) => {
    const stream = api.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: 1600, height: 1600, crop: "limit" },
          { quality: "auto:good", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      },
    );

    stream.end(buffer);
  });
}

export async function destroyImage(publicId: string) {
  if (!publicId) return;

  try {
    await client().uploader.destroy(publicId);
  } catch (error) {
    console.error("[cloudinary] could not delete image", error);
  }
}
