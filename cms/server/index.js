import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import incidentRoutes from './routes/incidents.js';
import handoverRoutes from './routes/handovers.js';
import visitorRoutes from './routes/visitors.js';
import documentRoutes from './routes/documents.js';
import childrenRoutes from './routes/children.js';
import logRoutes from './routes/logs.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(session({
  secret: 'chosanta-cms-secret-key-2025',
  resave: false, saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 }
}));

// Auth middleware
export function requireAuth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
  const user = db.prepare('SELECT u.*, r.name as role_name, r.level as role_level FROM users u JOIN roles r ON u.role_id=r.id WHERE u.id=?').get(req.session.userId);
  if (!user || !user.active) return res.status(401).json({ error: 'Account disabled' });
  req.user = user;
  next();
}
export function requireLevel(minLevel) {
  return (req, res, next) => {
    if (req.user.role_level < minLevel) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}

// Audit logger
export function logAudit(userId, action, tableName, recordId, oldVal, newVal) {
  db.prepare('INSERT INTO audit_trail (user_id,action,table_name,record_id,old_value,new_value) VALUES (?,?,?,?,?,?)')
    .run(userId, action, tableName, recordId, oldVal ? JSON.stringify(oldVal) : null, newVal ? JSON.stringify(newVal) : null);
}

// Serve COSANTA HTML policy documents
app.use('/policies', express.static(join(__dirname, '..', '..')));

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/incidents', requireAuth, incidentRoutes);
app.use('/api/handovers', requireAuth, handoverRoutes);
app.use('/api/visitors', requireAuth, visitorRoutes);
app.use('/api/documents', requireAuth, documentRoutes);
app.use('/api/children', requireAuth, childrenRoutes);
app.use('/api/logs', requireAuth, logRoutes);

app.get('/api/users', requireAuth, (req, res) => {
  res.json(db.prepare('SELECT id, full_name, email FROM users WHERE active=1').all());
});

app.get('/api/audit', requireAuth, requireLevel(3), (req, res) => {
  const rows = db.prepare(`SELECT a.*, u.full_name FROM audit_trail a LEFT JOIN users u ON a.user_id=u.id ORDER BY a.timestamp DESC LIMIT 200`).all();
  res.json(rows);
});

app.listen(3001, () => console.log('✅ Chosanta CMS API running on http://localhost:3001'));
