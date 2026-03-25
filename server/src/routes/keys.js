import { Router } from 'express';
import pool from '../db/pool.js';
import { requireAuth, requireOfficer } from '../middleware/auth.js';

const router = Router();

// GET /api/keys — all keys with current status
router.get('/', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT k.*,
             u.name AS held_by_name,
             u.service_number AS held_by_sn
      FROM keys k
      LEFT JOIN audit_log a ON a.key_id = k.id
        AND a.action = 'issue'
        AND a.id = (
          SELECT MAX(a2.id) FROM audit_log a2
          WHERE a2.key_id = k.id AND a2.action = 'issue'
        )
      LEFT JOIN users u ON u.id = a.user_id
      ORDER BY k.key_number
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/keys — create a key (officer only)
router.post('/', requireAuth, requireOfficer, async (req, res) => {
  const { key_number, label, location } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO keys (key_number, label, location) VALUES ($1, $2, $3) RETURNING *',
      [key_number, label, location]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/keys/:id/issue
router.post('/:id/issue', requireAuth, requireOfficer, async (req, res) => {
  const { id } = req.params;
  const { user_id, notes } = req.body;
  const officer_id = req.user.id;

  try {
    const { rows: keyRows } = await pool.query('SELECT * FROM keys WHERE id = $1', [id]);
    const key = keyRows[0];
    if (!key) return res.status(404).json({ error: 'Key not found' });
    if (key.status === 'issued') return res.status(409).json({ error: 'Key already issued' });

    await pool.query('BEGIN');
    await pool.query('UPDATE keys SET status = $1 WHERE id = $2', ['issued', id]);
    await pool.query(
      'INSERT INTO audit_log (key_id, user_id, officer_id, action, notes) VALUES ($1, $2, $3, $4, $5)',
      [id, user_id, officer_id, 'issue', notes]
    );
    await pool.query('COMMIT');

    res.json({ message: 'Key issued' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/keys/:id/return
router.post('/:id/return', requireAuth, requireOfficer, async (req, res) => {
  const { id } = req.params;
  const { user_id, notes } = req.body;
  const officer_id = req.user.id;

  try {
    const { rows: keyRows } = await pool.query('SELECT * FROM keys WHERE id = $1', [id]);
    const key = keyRows[0];
    if (!key) return res.status(404).json({ error: 'Key not found' });
    if (key.status === 'available') return res.status(409).json({ error: 'Key not currently issued' });

    await pool.query('BEGIN');
    await pool.query('UPDATE keys SET status = $1 WHERE id = $2', ['available', id]);
    await pool.query(
      'INSERT INTO audit_log (key_id, user_id, officer_id, action, notes) VALUES ($1, $2, $3, $4, $5)',
      [id, user_id, officer_id, 'return', notes]
    );
    await pool.query('COMMIT');

    res.json({ message: 'Key returned' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
