import { v2 as cloudinary } from "cloudinary";

const pictureUpload = async (filePath: string) => {
  try {
    const uploadedImage = await cloudinary.uploader.upload(filePath, {
      folder: "ducks-app",
    });
    return uploadedImage;
  } catch (error) {
    console.log(`Error is => ${error}`);
    return null;
  }
};

export { pictureUpload };
