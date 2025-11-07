// controllers/RefreshToken.js
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const RefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token tidak tersedia'
            });
        }

        // Verifikasi refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Cari admin berdasarkan refresh token dan ID
        const admin = await Admin.findOne({
            where: {
                id: decoded.adminId,
                refresh_token: refreshToken
            }
        });

        if (!admin) {
            return res.status(403).json({
                success: false,
                message: 'Refresh token tidak valid'
            });
        }

        // Buat access token baru
        const accessToken = jwt.sign(
            { 
                adminId: admin.id, 
                nama: admin.nama, 
                email: admin.email, 
                role: admin.role 
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        return res.json({ 
            success: true,
            message: 'Token berhasil diperbarui',
            data: {
                accessToken
            }
        });

    } catch (error) {
        console.error('Error refreshing token:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Refresh token expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Refresh token tidak valid'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
}