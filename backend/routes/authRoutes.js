// routes/authRoutes.js
import express from 'express';
import multer from 'multer';
import { registerUser, loginUser } from '../controllers/authController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/register', upload.single('businessLicenseFile'), registerUser);
router.post('/login', loginUser);

export default router;