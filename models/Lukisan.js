import { DataTypes } from 'sequelize';
import db from '../config/Koneksi.js';

const Lukisan = db.define('Lukisan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
   
    judul_lukisan: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    deskripsi_lukisan: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    gambar_lukisan: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    teknik: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tahun_pembuatan: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    artis: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    harga: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true
    },
    status_karya: {
        type: DataTypes.ENUM('tersedia', 'terjual', 'dipamerkan'),
        defaultValue: 'tersedia'
    },
   
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

export default Lukisan;