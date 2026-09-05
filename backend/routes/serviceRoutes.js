import express from 'express';
import multer from 'multer';
import { getApprovedServices, createService, requestServiceUpdate, getMyServices, getServiceById } from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/', getApprovedServices); 
router.get('/my-services', protect, getMyServices);
router.get('/:id', getServiceById);
router.post('/', protect, upload.single('certificationFile'), createService);
router.put('/:id/request-update', protect, upload.single('certificationFile'), requestServiceUpdate);

export default router;