import Lukisan from '../models/Lukisan.js';
import path from 'path';
import fs from 'fs';

class LukisanController {
  // GET semua lukisan dengan pagination dan filtering
  static async getAllLukisan(req, res) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;
      const offset = (page - 1) * limit;

      // Build where condition
      const whereCondition = {};
      if (status) whereCondition.status_karya = status;
      if (search) {
        whereCondition.judul_lukisan = {
          [Op.like]: `%${search}%`
        };
      }

      const lukisan = await Lukisan.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: lukisan.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(lukisan.count / limit),
          totalItems: lukisan.count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error getting lukisan:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // GET lukisan by ID
  static async getLukisanById(req, res) {
    try {
      const { id } = req.params;

      const lukisan = await Lukisan.findByPk(id);
      
      if (!lukisan) {
        return res.status(404).json({
          success: false,
          message: 'Lukisan tidak ditemukan'
        });
      }

      // Increment views
      await lukisan.increment('views');

      res.json({
        success: true,
        data: lukisan
      });
    } catch (error) {
      console.error('Error getting lukisan by id:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // CREATE lukisan baru
  static async createLukisan(req, res) {
    try {
      const {
        judul_lukisan,
        deskripsi_lukisan,
        teknik,
        tahun_pembuatan,
        artis,
        harga,
        status_karya
      } = req.body;

      // Validasi required fields
      if (!judul_lukisan || !deskripsi_lukisan) {
        return res.status(400).json({
          success: false,
          message: 'Judul dan deskripsi lukisan wajib diisi'
        });
      }

      // Handle file upload
      let gambar_lukisan = null;
      if (req.file) {
        gambar_lukisan = req.file.filename;
      }

      const newLukisan = await Lukisan.create({
        judul_lukisan,
        deskripsi_lukisan,
        gambar_lukisan,
        teknik,
        tahun_pembuatan: tahun_pembuatan ? parseInt(tahun_pembuatan) : null,
        artis,
        harga: harga ? parseFloat(harga) : null,
        status_karya: status_karya || 'tersedia'
      });

      res.status(201).json({
        success: true,
        message: 'Lukisan berhasil dibuat',
        data: newLukisan
      });
    } catch (error) {
      console.error('Error creating lukisan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal membuat lukisan',
        error: error.message
      });
    }
  }

  // UPDATE lukisan
  static async updateLukisan(req, res) {
    try {
      const { id } = req.params;
      const {
        judul_lukisan,
        deskripsi_lukisan,
        teknik,
        tahun_pembuatan,
        artis,
        harga,
        status_karya
      } = req.body;

      const lukisan = await Lukisan.findByPk(id);
      
      if (!lukisan) {
        return res.status(404).json({
          success: false,
          message: 'Lukisan tidak ditemukan'
        });
      }

      // Handle file upload - jika ada file baru
      let gambar_lukisan = lukisan.gambar_lukisan;
      if (req.file) {
        // Hapus file lama jika ada
        if (lukisan.gambar_lukisan) {
          const oldImagePath = path.join('upload/lukisan', lukisan.gambar_lukisan);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        gambar_lukisan = req.file.filename;
      }

      // Update data
      await lukisan.update({
        judul_lukisan: judul_lukisan || lukisan.judul_lukisan,
        deskripsi_lukisan: deskripsi_lukisan || lukisan.deskripsi_lukisan,
        gambar_lukisan,
        teknik: teknik || lukisan.teknik,
        tahun_pembuatan: tahun_pembuatan ? parseInt(tahun_pembuatan) : lukisan.tahun_pembuatan,
        artis: artis || lukisan.artis,
        harga: harga ? parseFloat(harga) : lukisan.harga,
        status_karya: status_karya || lukisan.status_karya
      });

      res.json({
        success: true,
        message: 'Lukisan berhasil diupdate',
        data: lukisan
      });
    } catch (error) {
      console.error('Error updating lukisan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate lukisan',
        error: error.message
      });
    }
  }

  // DELETE lukisan
  static async deleteLukisan(req, res) {
    try {
      const { id } = req.params;

      const lukisan = await Lukisan.findByPk(id);
      
      if (!lukisan) {
        return res.status(404).json({
          success: false,
          message: 'Lukisan tidak ditemukan'
        });
      }

      // Hapus file gambar jika ada
      if (lukisan.gambar_lukisan) {
        const imagePath = path.join('upload/lukisan', lukisan.gambar_lukisan);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await lukisan.destroy();

      res.json({
        success: true,
        message: 'Lukisan berhasil dihapus'
      });
    } catch (error) {
      console.error('Error deleting lukisan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal menghapus lukisan',
        error: error.message
      });
    }
  }

  // GET lukisan populer (berdasarkan views)
  static async getPopularLukisan(req, res) {
    try {
      const { limit = 5 } = req.query;

      const popularLukisan = await Lukisan.findAll({
        order: [['views', 'DESC']],
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: popularLukisan
      });
    } catch (error) {
      console.error('Error getting popular lukisan:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // UPDATE status lukisan
  static async updateStatusLukisan(req, res) {
    try {
      const { id } = req.params;
      const { status_karya } = req.body;

      const allowedStatus = ['tersedia', 'terjual', 'dipamerkan'];
      if (!allowedStatus.includes(status_karya)) {
        return res.status(400).json({
          success: false,
          message: 'Status tidak valid'
        });
      }

      const lukisan = await Lukisan.findByPk(id);
      
      if (!lukisan) {
        return res.status(404).json({
          success: false,
          message: 'Lukisan tidak ditemukan'
        });
      }

      await lukisan.update({ status_karya });

      res.json({
        success: true,
        message: `Status lukisan berhasil diubah menjadi ${status_karya}`,
        data: lukisan
      });
    } catch (error) {
      console.error('Error updating status lukisan:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengupdate status lukisan',
        error: error.message
      });
    }
  }
}

export default LukisanController;