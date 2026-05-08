import { Router } from 'express';
import db from '../db.js';
import { logAudit } from '../index.js';
const router = Router();

router.get('/', (req, res) => {
  const { status, category, child_id, from, to } = req.query;
  let sql = `SELECT i.*, c.ref_code, c.first_name||' '||c.last_name as child_name, u.full_name as reporter FROM incidents i LEFT JOIN children c ON i.child_id=c.id LEFT JOIN users u ON i.created_by=u.id WHERE 1=1`;
  const params = [];
  if (status) { sql += ' AND i.status=?'; params.push(status); }
  if (category) { sql += ' AND i.category=?'; params.push(category); }
  if (child_id) { sql += ' AND i.child_id=?'; params.push(child_id); }
  if (from) { sql += ' AND i.date>=?'; params.push(from); }
  if (to) { sql += ' AND i.date<=?'; params.push(to); }
  sql += ' ORDER BY i.date DESC, i.time DESC LIMIT 200';
  res.json(db.prepare(sql).all(...params));
});

router.post('/', (req, res) => {
  const d = req.body;
  const r = db.prepare(`INSERT INTO incidents (date,time,category,severity,description,child_id,staff_id,location,immediate_action,injuries,sen_required,nims_ref,status,created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(d.date,d.time,d.category,d.severity,d.description,d.child_id||null,d.staff_id||null,d.location,d.immediate_action,d.injuries,d.sen_required?1:0,d.nims_ref,'Open',req.user.id);
  logAudit(req.user.id,'CREATE','incidents',r.lastInsertRowid,null,d);
  res.json({ id: r.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const old = db.prepare('SELECT * FROM incidents WHERE id=?').get(req.params.id);
  if (!old) return res.status(404).json({ error: 'Not found' });
  const d = req.body;
  db.prepare(`UPDATE incidents SET date=?,time=?,category=?,severity=?,description=?,child_id=?,location=?,immediate_action=?,injuries=?,sen_required=?,nims_ref=?,status=?,outcome=?,learning=?,pic_reviewed=?,pic_review_date=? WHERE id=?`)
    .run(d.date,d.time,d.category,d.severity,d.description,d.child_id||null,d.location,d.immediate_action,d.injuries,d.sen_required?1:0,d.nims_ref,d.status,d.outcome,d.learning,d.pic_reviewed?1:0,d.pic_review_date,req.params.id);
  logAudit(req.user.id,'UPDATE','incidents',req.params.id,old,d);
  res.json({ ok: true });
});

router.delete('/:id', (req, res) => {
  if (req.user.role_level < 3) return res.status(403).json({ error: 'PIC+ only' });
  const old = db.prepare('SELECT * FROM incidents WHERE id=?').get(req.params.id);
  db.prepare('DELETE FROM incidents WHERE id=?').run(req.params.id);
  logAudit(req.user.id,'DELETE','incidents',req.params.id,old,null);
  res.json({ ok: true });
});

export default router;
