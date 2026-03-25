import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/audit?key_id=&user_id=&limit=&offset=
router.get('/', requireAuth, async (req, res) => {
  const { key_id, user_id, limit = 50, offset = 0 } = req.query;

  const conditions = [];
  const params = [];

  if (key_id) { params.push(key_id); conditions.push(`a.key_id = $${params.length}`); }
  if (user_id) { params.push(user_id); conditions.push(`a.user_id = $${params.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(Number(limit), Number(offset));

  try {
    const { rows } = await pool.query(`
      SELECT
        a.id,
        a.action,
        a.notes,
        a.created_at,
        k.key_number,
        k.label AS key_label,
        u.name AS user_name,
        u.service_number AS user_sn,
        o.name AS officer_name,
        o.service_number AS officer_sn
      FROM audit_log a
      JOIN keys k ON k.id = a.key_id
      LEFT JOIN users u ON u.id = a.user_id
      LEFT JOIN users o ON o.id = a.officer_id
      ${where}
      ORDER BY a.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
