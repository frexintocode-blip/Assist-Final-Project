
import express from 'express';
import multer from 'multer';
import { getApprovedServices, createService, requestServiceUpdate } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFields } from '../utils/upload.js';
import { getMyServices, getServiceById } from '../controllers/serviceController.js';

const upload = multer({ dest: 'uploads/'});
const router = express.Router();

router.get('/', getApprovedServices); 
router.get('/my-services', protect, getMyServices);
router.get('/:id', getServiceById);
router.post('/', protect, uploadFields.single('certificationFile'), createService);
router.put('/:id/request-update', protect, uploadFields.single('certificationFile'), requestServiceUpdate);


export default router;