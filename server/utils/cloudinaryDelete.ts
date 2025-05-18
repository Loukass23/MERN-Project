import { v2 as cloudinary } from "cloudinary";

const pictureDelete = async (public_id: string) => {
  try {
    const deletedImage = await cloudinary.uploader.destroy(public_id);
    console.log("deletedImage :>> ", deletedImage);
    return deletedImage;
  } catch (error) {
    console.error(`Error deleting image from Cloudinary: ${error}`);
    throw error;
  }
};

export { pictureDelete };
