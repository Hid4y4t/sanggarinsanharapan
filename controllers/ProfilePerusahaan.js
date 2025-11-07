import ProfilPerusahaan from '../models/ProfilPerusahaan.js';
import path from 'path';
import fs from 'fs';

export const createProfile = async (req, res) => {
    try {
        const {
            nama_perusahaan,
            deskripsi_singkat,
            deskripsi_lengkap,
            alamat,
            telepon,
            email,
            website,
            fb,
            ig,
            visi,
            misi,
            tahun_berdiri,
            jumlah_anggota
        } = req.body;

        // Validasi field required
        if (!nama_perusahaan || !deskripsi_singkat || !deskripsi_lengkap || !alamat || !telepon || !email) {
            return res.status(400).json({
                message: "Semua field wajib diisi: nama_perusahaan, deskripsi_singkat, deskripsi_lengkap, alamat, telepon, email"
            });
        }

        // Cek apakah profile perusahaan sudah ada
        const existingProfile = await ProfilPerusahaan.findOne();
        if (existingProfile) {
            // Hapus file temporary jika ada
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                message: "Profile perusahaan sudah ada, gunakan update untuk mengubah data"
            });
        }

        let logo = null;
        if (req.file) {
            // Generate nama file permanen
            const fileExtension = path.extname(req.file.filename);
            const timestamp = Date.now();
            logo = `logo_${timestamp}${fileExtension}`;
            
            // Rename file dari temporary ke permanen
            const oldPath = req.file.path;
            const newPath = path.join('upload/perusahaan', logo);
            fs.renameSync(oldPath, newPath);
        }

        const profile = await ProfilPerusahaan.create({
            nama_perusahaan,
            deskripsi_singkat,
            deskripsi_lengkap,
            alamat,
            telepon,
            email,
            website: website || null,
            fb: fb || null,
            ig: ig || null,
            logo,
            visi: visi || null,
            misi: misi || null,
            tahun_berdiri: tahun_berdiri || null,
            jumlah_anggota: jumlah_anggota || 0
        });

        res.status(201).json({
            message: "Profile perusahaan berhasil dibuat",
            data: profile
        });

    } catch (error) {
        // Hapus file temporary jika ada error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            message: "Gagal membuat profile perusahaan",
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const {
            nama_perusahaan,
            deskripsi_singkat,
            deskripsi_lengkap,
            alamat,
            telepon,
            email,
            website,
            fb,
            ig,
            visi,
            misi,
            tahun_berdiri,
            jumlah_anggota
        } = req.body;

        // Validasi field required
        if (!nama_perusahaan || !deskripsi_singkat || !deskripsi_lengkap || !alamat || !telepon || !email) {
            // Hapus file temporary jika validasi gagal
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                message: "Semua field wajib diisi: nama_perusahaan, deskripsi_singkat, deskripsi_lengkap, alamat, telepon, email"
            });
        }

        // Cari profile perusahaan
        const profile = await ProfilPerusahaan.findOne();
        if (!profile) {
            // Hapus file temporary jika profile tidak ditemukan
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({
                message: "Profile perusahaan tidak ditemukan"
            });
        }

        let logo = profile.logo;
        
        // Jika ada file logo baru
        if (req.file) {
            // Hapus logo lama jika ada
            if (logo) {
                const oldLogoPath = path.join('upload/perusahaan', logo);
                if (fs.existsSync(oldLogoPath)) {
                    fs.unlinkSync(oldLogoPath);
                }
            }

            // Generate nama file permanen
            const fileExtension = path.extname(req.file.filename);
            const timestamp = Date.now();
            logo = `logo_${timestamp}${fileExtension}`;
            
            // Rename file dari temporary ke permanen
            const oldPath = req.file.path;
            const newPath = path.join('upload/perusahaan', logo);
            fs.renameSync(oldPath, newPath);
        }

        // Update data
        await ProfilPerusahaan.update({
            nama_perusahaan,
            deskripsi_singkat,
            deskripsi_lengkap,
            alamat,
            telepon,
            email,
            website: website || null,
            fb: fb || null,
            ig: ig || null,
            logo,
            visi: visi || null,
            misi: misi || null,
            tahun_berdiri: tahun_berdiri || null,
            jumlah_anggota: jumlah_anggota || 0
        }, {
            where: { id: profile.id }
        });

        // Ambil data terbaru
        const updatedProfile = await ProfilPerusahaan.findByPk(profile.id);

        res.json({
            message: "Profile perusahaan berhasil diupdate",
            data: updatedProfile
        });

    } catch (error) {
        // Hapus file temporary jika ada error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            message: "Gagal mengupdate profile perusahaan",
            error: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const profile = await ProfilPerusahaan.findOne();
        
        if (!profile) {
            return res.status(404).json({
                message: "Profile perusahaan tidak ditemukan"
            });
        }

        res.json({
            data: profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Gagal mengambil data profile perusahaan",
            error: error.message
        });
    }
};

// Helper function untuk menghapus file temporary yang tertinggal
export const cleanupTempFiles = () => {
    const uploadDir = 'upload/perusahaan';
    if (fs.existsSync(uploadDir)) {
        const files = fs.readdirSync(uploadDir);
        files.forEach(file => {
            if (file.startsWith('temp-')) {
                const filePath = path.join(uploadDir, file);
                // Hapus file yang lebih dari 1 jam
                const stats = fs.statSync(filePath);
                const now = new Date().getTime();
                const endTime = new Date(stats.ctime).getTime() + 3600000; // 1 jam
                if (now > endTime) {
                    fs.unlinkSync(filePath);
                }
            }
        });
    }
};