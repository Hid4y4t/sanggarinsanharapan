import express from "express";
import { 
    createAdmin, 
    getAllAdmins, 
    getAdminById, 
    updateAdmin, 
    deleteAdmin, 
    Login, 
    Logout,  
    getCurrentAdmin
} from '../controllers/Admin.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { RefreshToken } from '../controllers/RefreshToken.js';

const router = express.Router();

// Public routes (tanpa authentication)
router.post('/login', Login);
router.delete('/logout', Logout);
router.get('/refresh-token', RefreshToken);

// Protected routes (dengan authentication)
router.get('/admin/me', verifyToken, getCurrentAdmin);
router.get('/admin', verifyToken, getAllAdmins);
router.get('/admin/:id', verifyToken, getAdminById);
router.post('/admin', verifyToken, createAdmin);
router.put('/admin/:id', verifyToken, updateAdmin); 
router.patch('/admin/:id', verifyToken, updateAdmin); 
router.delete('/admin/:id', verifyToken, deleteAdmin);


export default router;