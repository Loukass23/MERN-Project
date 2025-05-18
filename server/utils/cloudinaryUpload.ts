import { v2 as cloudinary } from "cloudinary";

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

const pictureUpload = async (
  filePath: string,
  folder: string = "ducks-app"
): Promise<CloudinaryUploadResult> => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });
    return {
      secure_url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
  } catch (error) {
    console.error(`Error uploading image to Cloudinary: ${error}`);
    throw error;
  }
};

export { pictureUpload };
