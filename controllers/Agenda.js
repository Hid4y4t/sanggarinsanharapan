import AgendaKegiatan from '../models/Agenda.js';

// Create - Membuat agenda baru
export const createAgenda = async (req, res) => {
    try {
        const {
            judul_kegiatan,
            deskripsi_kegiatan,
            tanggal_mulai,
            tanggal_selesai,
            waktu_mulai,
            waktu_selesai,
            lokasi,
            alamat_lengkap
        } = req.body;

        // Validasi input
        if (!judul_kegiatan || !deskripsi_kegiatan || !tanggal_mulai || !tanggal_selesai || !lokasi) {
            return res.status(400).json({
                success: false,
                message: 'Judul kegiatan, deskripsi, tanggal mulai, tanggal selesai, dan lokasi harus diisi'
            });
        }

        // Validasi tanggal
        if (new Date(tanggal_mulai) > new Date(tanggal_selesai)) {
            return res.status(400).json({
                success: false,
                message: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai'
            });
        }

        const agenda = await AgendaKegiatan.create({
            judul_kegiatan,
            deskripsi_kegiatan,
            tanggal_mulai,
            tanggal_selesai,
            waktu_mulai,
            waktu_selesai,
            lokasi,
            alamat_lengkap
        });

        res.status(201).json({
            success: true,
            message: 'Agenda berhasil dibuat',
            data: agenda
        });
    } catch (error) {
        console.error('Error creating agenda:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Read - Mendapatkan semua agenda
export const getAllAgenda = async (req, res) => {
    try {
        const agendas = await AgendaKegiatan.findAll({
            order: [['tanggal_mulai', 'ASC']]
        });

        res.status(200).json({
            success: true,
            message: 'Data agenda berhasil diambil',
            data: agendas
        });
    } catch (error) {
        console.error('Error getting agendas:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Read - Mendapatkan agenda by ID
export const getAgendaById = async (req, res) => {
    try {
        const { id } = req.params;

        const agenda = await AgendaKegiatan.findByPk(id);

        if (!agenda) {
            return res.status(404).json({
                success: false,
                message: 'Agenda tidak ditemukan'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Agenda berhasil diambil',
            data: agenda
        });
    } catch (error) {
        console.error('Error getting agenda by id:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Update - Mengupdate agenda
export const updateAgenda = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            judul_kegiatan,
            deskripsi_kegiatan,
            tanggal_mulai,
            tanggal_selesai,
            waktu_mulai,
            waktu_selesai,
            lokasi,
            alamat_lengkap
        } = req.body;

        const agenda = await AgendaKegiatan.findByPk(id);

        if (!agenda) {
            return res.status(404).json({
                success: false,
                message: 'Agenda tidak ditemukan'
            });
        }

        // Validasi tanggal jika diupdate
        if (tanggal_mulai && tanggal_selesai && new Date(tanggal_mulai) > new Date(tanggal_selesai)) {
            return res.status(400).json({
                success: false,
                message: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai'
            });
        }

        await agenda.update({
            judul_kegiatan: judul_kegiatan || agenda.judul_kegiatan,
            deskripsi_kegiatan: deskripsi_kegiatan || agenda.deskripsi_kegiatan,
            tanggal_mulai: tanggal_mulai || agenda.tanggal_mulai,
            tanggal_selesai: tanggal_selesai || agenda.tanggal_selesai,
            waktu_mulai: waktu_mulai !== undefined ? waktu_mulai : agenda.waktu_mulai,
            waktu_selesai: waktu_selesai !== undefined ? waktu_selesai : agenda.waktu_selesai,
            lokasi: lokasi || agenda.lokasi,
            alamat_lengkap: alamat_lengkap !== undefined ? alamat_lengkap : agenda.alamat_lengkap
        });

        res.status(200).json({
            success: true,
            message: 'Agenda berhasil diupdate',
            data: agenda
        });
    } catch (error) {
        console.error('Error updating agenda:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Delete - Menghapus agenda
export const deleteAgenda = async (req, res) => {
    try {
        const { id } = req.params;

        const agenda = await AgendaKegiatan.findByPk(id);

        if (!agenda) {
            return res.status(404).json({
                success: false,
                message: 'Agenda tidak ditemukan'
            });
        }

        await agenda.destroy();

        res.status(200).json({
            success: true,
            message: 'Agenda berhasil dihapus'
        });
    } catch (error) {
        console.error('Error deleting agenda:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};

// Get agenda yang akan datang
export const getUpcomingAgenda = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingAgendas = await AgendaKegiatan.findAll({
            where: {
                tanggal_selesai: {
                    [Op.gte]: today
                }
            },
            order: [['tanggal_mulai', 'ASC']]
        });

        res.status(200).json({
            success: true,
            message: 'Agenda yang akan datang berhasil diambil',
            data: upcomingAgendas
        });
    } catch (error) {
        console.error('Error getting upcoming agendas:', error);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan server',
            error: error.message
        });
    }
};