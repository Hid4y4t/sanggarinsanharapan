import { DataTypes } from 'sequelize';
import db from '../config/Koneksi.js';

const AgendaKegiatan = db.define('AgendaKegiatan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    judul_kegiatan: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    deskripsi_kegiatan: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    tanggal_mulai: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tanggal_selesai: {
        type: DataTypes.DATE,
        allowNull: false
    },
    waktu_mulai: {
        type: DataTypes.TIME,
        allowNull: true
    },
    waktu_selesai: {
        type: DataTypes.TIME,
        allowNull: true
    },
    lokasi: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    alamat_lengkap: {
        type: DataTypes.TEXT,
        allowNull: true
    }
    
});

export default AgendaKegiatan;