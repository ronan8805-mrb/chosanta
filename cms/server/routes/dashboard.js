import { Router } from 'express';
import db from '../db.js';
const router = Router();

router.get('/', (req, res) => {
  const stats = {};
  stats.openIncidents = db.prepare("SELECT COUNT(*) as c FROM incidents WHERE status='Open'").get().c;
  stats.totalChildren = db.prepare("SELECT COUNT(*) as c FROM children WHERE status='Active'").get().c;
  stats.totalStaff = db.prepare("SELECT COUNT(*) as c FROM users WHERE active=1").get().c;
  stats.overdueDocuments = db.prepare("SELECT COUNT(*) as c FROM documents WHERE review_date < date('now') AND status='Active'").get().c;
  stats.pendingPICReview = db.prepare("SELECT COUNT(*) as c FROM incidents WHERE pic_reviewed=0 AND status='Open'").get().c;
  stats.openMaintenance = db.prepare("SELECT COUNT(*) as c FROM maintenance_records WHERE status='Open'").get().c;
  stats.trainingExpiring = db.prepare("SELECT COUNT(*) as c FROM training_records WHERE expiry_date < date('now','+30 days') AND expiry_date > date('now')").get().c;
  stats.trainingExpired = db.prepare("SELECT COUNT(*) as c FROM training_records WHERE expiry_date < date('now')").get().c;
  stats.recentIncidents = db.prepare(`SELECT i.*, c.first_name||' '||c.last_name as child_name FROM incidents i LEFT JOIN children c ON i.child_id=c.id ORDER BY i.created_at DESC LIMIT 5`).all();
  stats.recentHandovers = db.prepare(`SELECT h.*, u.full_name as leader_name FROM handovers h LEFT JOIN users u ON h.shift_leader_id=u.id ORDER BY h.created_at DESC LIMIT 3`).all();
  res.json(stats);
});

export default router;
