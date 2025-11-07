import multer from 'multer';
import path from 'path';

// Konfigurasi storage untuk artikel
const storageArtikel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/artikel/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'artikel-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file (hanya gambar dengan format tertentu)
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar dengan format JPG, JPEG, PNG, dan WebP yang diizinkan!'), false);
  }
};

const uploadArtikel = multer({
  storage: storageArtikel,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit untuk artikel
  }
});

export default uploadArtikel;