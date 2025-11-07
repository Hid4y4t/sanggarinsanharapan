import Admin from '../models/Admin.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
// Create - Membuat admin baru
export const createAdmin = async (req, res) => {
    try {
        const { nama, email, password, role, status } = req.body;

        // Validasi input
        if (!nama || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nama, email, dan password harus diisi'
            });
        }

        // Cek apakah email sudah terdaftar
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Email sudah terdaftar'
            });
        }

        // Buat admin baru
        const newAdmin = await Admin.create({
            nama,
            email,
            password,
            role: role || 'admin',
            status: status || 'active'
        });

        // Hapus password dari response
        const adminResponse = {
            id: newAdmin.id,
            nama: newAdmin.nama,
            email: newAdmin.email,
            role: newAdmin.role,
            status: newAdmin.status,
            createdAt: newAdmin.createdAt,
            updatedAt: newAdmin.updatedAt
        };

        return res.status(201).json({
            success: true,
            message: 'Admin berhasil dibuat',
            data: adminResponse
        });

    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Read - Mendapatkan semua admin
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password'] }, // Exclude password dari response
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: 'Data admin berhasil diambil',
            data: admins
        });

    } catch (error) {
        console.error('Error getting admins:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Read - Mendapatkan admin by ID
export const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByPk(id, {
            attributes: { exclude: ['password'] } // Exclude password dari response
        });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin tidak ditemukan'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Data admin berhasil diambil',
            data: admin
        });

    } catch (error) {
        console.error('Error getting admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Update - Memperbarui data admin
export const updateAdmin = async (req, res) => {
    const {id} = req.params;
    const { nama, email, password, role, status } = req.body;

    try {
        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin tidak ditemukan'
            });
        }

        const updatedData = {
            nama, 
            email,
            role,
            status

        };
        if (password && password.trim() !== '') {
        const salt = await bcrypt.genSalt();
        updatedData.password = await bcrypt.hash(password, salt);
        }

        await admin.update(updatedData);

        res.json({
            success: true,
            message: 'Admin berhasil diperbarui',
            updateAdmin:{
                id: admin.id,
                nama: admin.nama,
                email: admin.email,
                role: admin.role,
                status: admin.status
            }
        })

        
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
}

// Delete - Menghapus admin
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin tidak ditemukan'
            });
        }

        await admin.destroy();

        return res.status(200).json({
            success: true,
            message: 'Admin berhasil dihapus'
        });

    } catch (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email dan password harus diisi' 
            });
        }

        // Cari admin berdasarkan email
        const admin = await Admin.findOne({
            where: { email }
        });

        if (!admin) {
            return res.status(404).json({ 
                success: false,
                message: 'Email tidak ditemukan' 
            });
        }

        // Cek status admin
        if (admin.status !== 'active') {
            return res.status(403).json({ 
                success: false,
                message: 'Akun tidak aktif' 
            });
        }

        // Verifikasi password menggunakan bcrypt.compare langsung
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false,
                message: 'Password salah' 
            });
        }

        // Data untuk token
        const adminId = admin.id;
        const nama = admin.nama;
        const adminEmail = admin.email;
        const role = admin.role;

        // Buat token
        const accessToken = jwt.sign(
            { adminId, nama, email: adminEmail, role }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '2m' }
        );
        
        const refreshToken = jwt.sign(
            { adminId, nama, email: adminEmail, role }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        // Update refresh token di database (jika kolom exists)
        try {
            if (admin.refresh_token !== undefined) {
                await admin.update({ refresh_token: refreshToken });
            }
        } catch (error) {
            console.warn('Tidak dapat menyimpan refresh token:', error.message);
        }

        // Set cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login berhasil',
            data: {
                id: adminId,
                nama,
                email: adminEmail,
                role,
                accessToken
            }
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
}

export const Logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(200).json({
                success: true,
                message: 'Logout berhasil'
            });
        }

        // Cari admin berdasarkan refresh token - gunakan findOne
        const admin = await Admin.findOne({
            where: { refresh_token: refreshToken }
        });

        // Hapus refresh token dari database jika ditemukan
        if (admin) {
            await admin.update({ refresh_token: null });
        }

        // Hapus cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            success: true,
            message: 'Logout berhasil'
        });

    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
}

// Tambahkan function ini di controller Admin
export const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.adminId, {
      attributes: { exclude: ['password', 'refresh_token'] }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Data admin berhasil diambil',
      data: admin
    });

  } catch (error) {
    console.error('Error getting current admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

