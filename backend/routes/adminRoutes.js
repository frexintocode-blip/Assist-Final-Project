// routes/adminRoutes.js
import express from 'express';
import { getAdminDashboard, moderateService, approveServiceUpdate, updateProviderRating, deleteService, deleteProvider } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(protect, isAdmin); // Secure entire administrative tier sub-routing tree

router.get('/pending-updates', getAdminDashboard);
router.patch('/service/:id', moderateService);
router.patch('/service/:id/approve-update', approveServiceUpdate);
router.patch('/provider/:providerId/rating', updateProviderRating);
router.delete('/service/:id', deleteService);
router.delete('/provider/:id', deleteProvider);


export default router;