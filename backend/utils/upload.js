// backend/utils/upload.js
import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid format. Only PDF, JPEG, and PNG allowed.'), false);
};

export const uploadFields = multer({ storage, fileFilter });