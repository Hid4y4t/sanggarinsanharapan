import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Pastikan folder upload exists
const uploadDir = 'upload/perusahaan';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate nama file unik dengan timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname).toLowerCase();
        cb(null, 'temp-' + uniqueSuffix + fileExtension);
    }
});

// Filter file
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isValidMime = allowedMimes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (isValidMime && isValidExtension) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar dengan format JPG, JPEG, dan PNG yang diizinkan'), false);
    }
};

// Konfigurasi multer
const uploadPerusahaan = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

// Middleware untuk handle error multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File terlalu besar. Maksimal ukuran file adalah 5MB'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                message: 'Field file tidak sesuai'
            });
        }
    } else if (err) {
        return res.status(400).json({
            message: err.message
        });
    }
    next();
};

export { uploadPerusahaan, handleUploadError };