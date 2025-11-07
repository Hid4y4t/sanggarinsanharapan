import express from 'express';
import {
    createAgenda,
    getAllAgenda,
    getAgendaById,
    updateAgenda,
    deleteAgenda,
    getUpcomingAgenda
} from '../controllers/Agenda.js';
import { verifyToken } from '../middleware/VerifyToken.js';

const router = express.Router();

// Public routes
router.get('/agenda', getAllAgenda);
router.get('/agenda/upcoming', getUpcomingAgenda);
router.get('/agenda/:id', getAgendaById);

// Protected routes (butuh token)
router.post('/agenda', verifyToken, createAgenda);
router.put('/agenda/:id', verifyToken, updateAgenda);
router.delete('/agenda/:id', verifyToken, deleteAgenda);

export default router;