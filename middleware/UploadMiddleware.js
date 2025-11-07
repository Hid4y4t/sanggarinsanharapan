import multer from 'multer';
import path from 'path';

// Konfigurasi storage untuk lukisan
const storageLukisan = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/lukisan/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'lukisan-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter file (hanya gambar dengan format tertentu)
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar dengan format JPG, JPEG, dan PNG yang diizinkan!'), false);
  }
};

const upload = multer({
  storage: storageLukisan,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export default upload;