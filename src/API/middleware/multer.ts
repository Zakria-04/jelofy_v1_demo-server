import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory instead of disk
const upload = multer({ storage });

export default upload;
