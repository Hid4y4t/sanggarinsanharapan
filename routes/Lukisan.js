import express from 'express';
import LukisanController from '../controllers/Lukisan.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import upload from '../middleware/UploadMiddleware.js'; 

const router = express.Router();

// Middleware upload untuk file lukisan
const uploadLukisan = upload.single('gambar_lukisan');

// Public routes
router.get('/lukisan', LukisanController.getAllLukisan);
router.get('/lukisan/popular', LukisanController.getPopularLukisan);
router.get('/lukisan/:id', LukisanController.getLukisanById);

// Protected routes (butuh authentication)
router.post('/lukisan', verifyToken, uploadLukisan, LukisanController.createLukisan);
router.put('/lukisan/:id', verifyToken, uploadLukisan, LukisanController.updateLukisan);
router.delete('/lukisan/:id', verifyToken, LukisanController.deleteLukisan);
router.patch('/lukisan/:id/status', verifyToken, LukisanController.updateStatusLukisan);

export default router;