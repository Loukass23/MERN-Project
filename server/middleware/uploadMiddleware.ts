import multer from "multer";
import path from "path";
import fs from "fs";

// uploads directory exists
const uploadDir = path.join(__dirname, "../../tmp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    );
  },
});

export default multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
