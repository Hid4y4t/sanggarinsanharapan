import { DataTypes } from 'sequelize';
import db from '../config/Koneksi.js';
import bcrypt from 'bcryptjs';
const Admin = db.define('Admin', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'admin'),
        defaultValue: 'admin'
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
    },
    refresh_token: {  // Tambahkan kolom ini
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'admin',
    hooks: {
        beforeCreate: async (admin) => {
            if (admin.password) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        },
        beforeUpdate: async (admin) => {
            if (admin.changed('password')) {
                admin.password = await bcrypt.hash(admin.password, 10);
            }
        }
    }
});

export default Admin;

// (async() => {
//     try {
//         await db.sync({ alter: true });
//         console.log('Tabel stunting sudah disinkronisasi');
//     } catch (error) {
//         console.error('Gagal menyinkronkan tabel stunting:', error);
//     }
// })();