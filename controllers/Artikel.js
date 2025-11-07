import Artikel from '../models/Artikel.js';
import path from 'path';
import fs from 'fs';

// Helper function untuk menghapus file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Get all articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Artikel.findAll({
      order: [['tanggal_terbit', 'DESC']]
    });
    
    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data artikel',
      error: error.message
    });
  }
};

// Get article by ID
export const getArticleById = async (req, res) => {
  try {
    const article = await Artikel.findByPk(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    // Increment views
    await article.increment('views');
    
    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data artikel',
      error: error.message
    });
  }
};

// Create new article
export const createArticle = async (req, res) => {
  try {
    const {
      judul_artikel,
      deskripsi_artikel,
      penulis
    } = req.body;

    // Validasi required fields
    if (!judul_artikel || !deskripsi_artikel) {
      return res.status(400).json({
        success: false,
        message: 'Judul dan deskripsi artikel harus diisi'
      });
    }

    // Validasi file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Gambar artikel harus diupload'
      });
    }

    const newArticle = await Artikel.create({
      judul_artikel,
      deskripsi_artikel,
      gambar_artikel: req.file.filename,
      penulis: penulis || 'Admin',
      tanggal_terbit: new Date(),
      views: 0
    });

    res.status(201).json({
      success: true,
      message: 'Artikel berhasil dibuat',
      data: newArticle
    });
  } catch (error) {
    // Hapus file yang sudah diupload jika ada error
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal membuat artikel',
      error: error.message
    });
  }
};

// Update article
export const updateArticle = async (req, res) => {
  try {
    const article = await Artikel.findByPk(req.params.id);
    
    if (!article) {
      // Hapus file baru jika artikel tidak ditemukan
      if (req.file) {
        deleteFile(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    const {
      judul_artikel,
      deskripsi_artikel,
      penulis
    } = req.body;

    const updateData = {
      judul_artikel: judul_artikel || article.judul_artikel,
      deskripsi_artikel: deskripsi_artikel || article.deskripsi_artikel,
      penulis: penulis || article.penulis
    };

    // Jika ada file baru, update gambar dan hapus file lama
    if (req.file) {
      // Hapus file lama
      const oldImagePath = path.join('upload/artikel/', article.gambar_artikel);
      deleteFile(oldImagePath);
      
      updateData.gambar_artikel = req.file.filename;
    }

    await article.update(updateData);

    res.json({
      success: true,
      message: 'Artikel berhasil diupdate',
      data: article
    });
  } catch (error) {
    // Hapus file baru jika ada error
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate artikel',
      error: error.message
    });
  }
};

// Delete article
export const deleteArticle = async (req, res) => {
  try {
    const article = await Artikel.findByPk(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan'
      });
    }

    // Hapus file gambar
    const imagePath = path.join('upload/artikel/', article.gambar_artikel);
    deleteFile(imagePath);

    await article.destroy();

    res.json({
      success: true,
      message: 'Artikel berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus artikel',
      error: error.message
    });
  }
};

// Get popular articles (most viewed)
export const getPopularArticles = async (req, res) => {
  try {
    const articles = await Artikel.findAll({
      order: [['views', 'DESC']],
      limit: 5
    });
    
    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil artikel populer',
      error: error.message
    });
  }
};