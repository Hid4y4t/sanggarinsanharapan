import { DataTypes } from 'sequelize';
import db from '../config/Koneksi.js';

const Artikel = db.define('Artikel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
   
    judul_artikel: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    deskripsi_artikel: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    gambar_artikel: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    
    penulis: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tanggal_terbit: {
        type: DataTypes.DATE,
        allowNull: true
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

export default Artikel;

// (async() => {
//     try {
//         await db.sync({ alter: true });
//         console.log('Tabel stunting sudah disinkronisasi');
//     } catch (error) {
//         console.error('Gagal menyinkronkan tabel stunting:', error);
//     }
// })();