import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./env";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const toDataURL = (file: Express.Multer.File) => {
  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataURL = `data:${file.mimetype};base64,${b64}`;
  return dataURL;
};

const getPublicIdFromFileUrl = (fileUrl: string) => {
  const fileNameUsingSubstring = fileUrl.substring(
    fileUrl.lastIndexOf("/") + 1
  );

  const publidId = fileNameUsingSubstring.substring(
    0,
    fileNameUsingSubstring.lastIndexOf(".")
  );

  return publidId;
};

export default {
  async uploadSingle(file: Express.Multer.File) {
    const fileDataURL = toDataURL(file);

    const result = await cloudinary.uploader.upload(fileDataURL, {
      resource_type: "auto",
    });
    return result;
  },
  async uploadMultiple(files: Express.Multer.File[]) {
    const uploadBatch = files.map((file) => {
      const result = this.uploadSingle(file);
      return result;
    });

    const results = await Promise.all(uploadBatch);
    return results;
  },

  async remove(fileUrl: string) {
    const publidId = getPublicIdFromFileUrl(fileUrl);
    const result = await cloudinary.uploader.destroy(publidId);
    return result;
  },
};
