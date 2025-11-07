import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getPopularArticles
} from '../controllers/Artikel.js';
import uploadArtikel from '../middleware/uploadArtikel.js';
import { verifyToken } from '../middleware/VerifyToken.js';

const router = express.Router();

// Routes
router.get('/artikel', getAllArticles);
router.get('/artikel/popular', getPopularArticles);
router.get('/artikel/:id', getArticleById);

router.post('/artikel', verifyToken, uploadArtikel.single('gambar_artikel'), createArticle);
router.put('/artikel/:id', verifyToken, uploadArtikel.single('gambar_artikel'), updateArticle);
router.delete('/artikel/:id', verifyToken, deleteArticle);

export default router;