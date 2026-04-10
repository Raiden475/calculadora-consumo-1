const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const pool = require('./db');
const app  = express();

app.use(cors());
app.use(express.json());

// ─── GET /api/viajes — Lista todos los viajes ───────────────
app.get('/api/viajes', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM viajes ORDER BY creado_en DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── GET /api/viajes/:id — Detalle de un viaje con cargas ───
app.get('/api/viajes/:id', async (req, res) => {
    try {
        const [[viaje]] = await pool.query(
            'SELECT * FROM viajes WHERE id = ?', [req.params.id]
        );
        if (!viaje) return res.status(404).json({ error: 'Viaje no encontrado' });

        const [cargas] = await pool.query(
            'SELECT * FROM cargas WHERE viaje_id = ? ORDER BY nro_carga',
            [req.params.id]
        );
        res.json({ ...viaje, cargas });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/viajes — Guarda un viaje completo ────────────
app.post('/api/viajes', async (req, res) => {
    const { km_inicial, km_final, distancia_km,
            litros_total, consumo_l100, cargas } = req.body;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Insertar el viaje
        const [result] = await conn.query(
            `INSERT INTO viajes 
             (km_inicial, km_final, distancia_km, litros_total, consumo_l100)
             VALUES (?, ?, ?, ?, ?)`,
            [km_inicial, km_final, distancia_km, litros_total, consumo_l100]
        );
        const viaje_id = result.insertId;

        // Insertar cada carga
        for (const carga of cargas) {
            await conn.query(
                `INSERT INTO cargas 
                 (viaje_id, nro_carga, km, litros, km_parcial)
                 VALUES (?, ?, ?, ?, ?)`,
                [viaje_id, carga.nro_carga, carga.km,
                 carga.litros, carga.km_parcial ?? null]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'Viaje guardado', viaje_id });

    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
    }
});

// ─── Servidor ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`LogiRuta API corriendo en http://localhost:${PORT}`);
});