import { jsonError, withAdmin } from "@/lib/api";
import { uploadImageBuffer, type UploadedImage } from "@/lib/cloudinary";

const MAX_IMAGES = 3;

export async function POST(request: Request) {
  return withAdmin(request, async () => {
    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return jsonError(400, "Expected multipart/form-data with 'file' fields.");
    }

    const files = formData
      .getAll("file")
      .filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return jsonError(400, "Add 1 to 3 images under the 'file' field.");
    }

    if (files.length > MAX_IMAGES) {
      return jsonError(400, `Upload at most ${MAX_IMAGES} images per product.`);
    }

    if (files.some((file) => !file.type.startsWith("image/"))) {
      return jsonError(400, "Only image uploads are supported.");
    }

    try {
      const images: UploadedImage[] = await Promise.all(
        files.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());

          return uploadImageBuffer(buffer);
        }),
      );

      return Response.json({ images }, { status: 201 });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not upload images.";

      return jsonError(502, message);
    }
  });
}
