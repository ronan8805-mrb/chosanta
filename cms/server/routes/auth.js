import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT u.*, r.name as role_name, r.level as role_level FROM users u JOIN roles r ON u.role_id=r.id WHERE u.email=? AND u.active=1').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.userId = user.id;
  res.json({ id: user.id, email: user.email, full_name: user.full_name, role: user.role_name, role_level: user.role_level });
});

router.post('/logout', (req, res) => { req.session.destroy(); res.json({ ok: true }); });

router.get('/me', (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.prepare('SELECT u.id, u.email, u.full_name, r.name as role, r.level as role_level FROM users u JOIN roles r ON u.role_id=r.id WHERE u.id=?').get(req.session.userId);
  if (!user) return res.status(401).json({ error: 'Not found' });
  res.json(user);
});

export default router;
