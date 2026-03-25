import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/pool.js';
import { requireAuth, requireOfficer } from '../middleware/auth.js';

const router = Router();

// GET /api/personnel
router.get('/', requireAuth, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, service_number, role, created_at FROM users ORDER BY name'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/personnel — create user (officer only)
router.post('/', requireAuth, requireOfficer, async (req, res) => {
  const { name, service_number, role, password } = req.body;
  if (!name || !service_number || !role || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, service_number, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, service_number, role',
      [name, service_number, role, hash]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Service number already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/personnel/:id (officer only)
router.delete('/:id', requireAuth, requireOfficer, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
