// middleware/VerifyToken.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
   
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer token
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Akses ditolak. Token tidak tersedia.'
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token tidak valid atau kadaluarsa.'
                });
            }
            
           
            req.user = {
                adminId: decoded.adminId,
                nama: decoded.nama,
                email: decoded.email,
                role: decoded.role,
                status: decoded.status
            };
            next();
        });
        
    
};