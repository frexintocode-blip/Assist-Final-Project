// routes/authRoutes.js
import express from 'express';
import { uploadFields } from '../utils/upload.js';
import { registerUser, loginUser } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', uploadFields.single('businessLicenseFile'), registerUser);
router.post('/login', loginUser);

export default router;