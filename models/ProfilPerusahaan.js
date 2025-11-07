import { DataTypes } from 'sequelize';
import db from '../config/Koneksi.js';

const ProfilPerusahaan = db.define('ProfilPerusahaan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_perusahaan: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    deskripsi_singkat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deskripsi_lengkap: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    telepon: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    website: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fb: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    ig: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    logo: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    visi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    misi: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tahun_berdiri: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    jumlah_anggota: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'profil_perusahaan'
});

export default ProfilPerusahaan;