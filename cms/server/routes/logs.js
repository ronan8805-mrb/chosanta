import { Router } from 'express';
import db from '../db.js';
import { logAudit } from '../index.js';
const router = Router();

// Generic CRUD for all log tables
const TABLES = {
  attendance: { table: 'staff_attendance', orderBy: 'date DESC' },
  supervision: { table: 'supervision_records', orderBy: 'date DESC' },
  hsinspections: { table: 'hs_inspections', orderBy: 'date DESC' },
  medaudits: { table: 'medication_audits', orderBy: 'date DESC' },
  roomsearch: { table: 'room_searches', orderBy: 'date DESC' },
  complaints: { table: 'complaints', orderBy: 'date_received DESC' },
  compliments: { table: 'compliments', orderBy: 'date DESC' },
  governance: { table: 'governance_minutes', orderBy: 'date DESC' },
  maintenance: { table: 'maintenance_records', orderBy: 'date_reported DESC' },
  training: { table: 'training_records', orderBy: 'date_completed DESC' },
  dailylog: { table: 'daily_log', orderBy: 'date DESC' },
  mar: { table: 'mar_records', orderBy: 'date DESC, time DESC' },
  sen: { table: 'sen_register', orderBy: 'date DESC' },
  childregister: { table: 'children_register', orderBy: 'id DESC' },
  pettycash: { table: 'petty_cash', orderBy: 'date DESC' },
  roster: { table: 'staff_roster', orderBy: 'week_commencing DESC' },
  compliancereview: { table: 'compliance_reviews', orderBy: 'date DESC' },
  childrisk: { table: 'child_risk_assessments', orderBy: 'date DESC' },
  careplans: { table: 'care_plans', orderBy: 'date DESC' },
  educontacts: { table: 'education_contacts', orderBy: 'id DESC' },
  houserisk: { table: 'house_risk_assessments', orderBy: 'date DESC' },
  riskregister: { table: 'risk_register', orderBy: 'id DESC' },
  missingchronology: { table: 'missing_chronology', orderBy: 'date DESC' },
};

router.get('/:type', (req, res) => {
  const cfg = TABLES[req.params.type];
  if (!cfg) return res.status(404).json({ error: 'Unknown log type' });
  const rows = db.prepare(`SELECT * FROM ${cfg.table} ORDER BY ${cfg.orderBy}`).all();
  res.json(rows);
});

router.post('/:type', (req, res) => {
  const cfg = TABLES[req.params.type];
  if (!cfg) return res.status(404).json({ error: 'Unknown log type' });
  const d = req.body;
  const cols = Object.keys(d);
  cols.push('created_by');
  const vals = Object.values(d);
  vals.push(req.user.id);
  const placeholders = cols.map(() => '?').join(',');
  try {
    const r = db.prepare(`INSERT INTO ${cfg.table} (${cols.join(',')}) VALUES (${placeholders})`).run(...vals);
    logAudit(req.user.id, 'CREATE', cfg.table, r.lastInsertRowid, null, d);
    res.json({ id: r.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:type/:id', (req, res) => {
  const cfg = TABLES[req.params.type];
  if (!cfg) return res.status(404).json({ error: 'Unknown log type' });
  const old = db.prepare(`SELECT * FROM ${cfg.table} WHERE id=?`).get(req.params.id);
  if (!old) return res.status(404).json({ error: 'Not found' });
  const d = req.body;
  const sets = Object.keys(d).map(k => `${k}=?`).join(',');
  const vals = [...Object.values(d), req.params.id];
  db.prepare(`UPDATE ${cfg.table} SET ${sets} WHERE id=?`).run(...vals);
  logAudit(req.user.id, 'UPDATE', cfg.table, req.params.id, old, d);
  res.json({ ok: true });
});

export default router;
