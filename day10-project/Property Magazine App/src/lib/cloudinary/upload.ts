import { cloudinary } from "@/lib/cloudinary/cloudinary";

export async function uploadToCloudinary(dataUrl: string, folder = "property-magazine") {
  return cloudinary.uploader.upload(dataUrl, {
    folder,
    quality: "auto",
    fetch_format: "auto",
    flags: "progressive"
  });
}

