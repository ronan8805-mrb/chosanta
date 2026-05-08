import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const NAV = [
  { section: 'Overview' },
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/dailylog', icon: '📖', label: 'Daily Running Log' },

  { section: 'Daily Operations' },
  { path: '/handovers', icon: '🔄', label: 'Shift Handover' },
  { path: '/visitors', icon: '👤', label: 'Visitor Log' },
  { path: '/nightchecks', icon: '🌙', label: 'Night Welfare Checks' },
  { path: '/incidents', icon: '⚠️', label: 'Incidents & Near Miss' },
  { path: '/trends', icon: '📈', label: 'Incident Trend Analysis' },
  { path: '/sen', icon: '📡', label: 'SEN Register' },
  { path: '/restrictive', icon: '🛑', label: 'Restrictive Practice' },
  { path: '/missing', icon: '🔍', label: 'Missing Child' },
  { path: '/missingchronology', icon: '📍', label: 'Missing Chronology' },
  { path: '/absenceplans', icon: '🗺️', label: 'Absence Plans' },
  { path: '/oncall', icon: '📞', label: 'On-Call & Escalation' },

  { section: 'Safeguarding' },
  { path: '/safeguarding', icon: '🛡️', label: 'Safeguarding Referrals', minLevel: 2 },

  { section: 'Children' },
  { path: '/childregister', icon: '👧', label: 'Children\'s Register' },
  { path: '/admissions', icon: '🏠', label: 'Admissions & Discharge' },
  { path: '/keyworking', icon: '💬', label: 'Keyworking Sessions' },
  { path: '/participation', icon: '🗣️', label: 'Participation & Voice' },
  { path: '/sanctions', icon: '⚖️', label: 'Sanctions & Consequences' },
  { path: '/childrisk', icon: '⚠️', label: 'Child Risk Assessment' },
  { path: '/careplans', icon: '📋', label: 'Care Plans' },
  { path: '/education', icon: '📚', label: 'Education & School' },
  { path: '/peeps', icon: '🔥', label: 'PEEPs (Evacuation)' },
  { path: '/roomsearch', icon: '🚪', label: 'Room Search' },

  { section: 'Health & Medication' },
  { path: '/mar', icon: '💊', label: 'MAR (Medication)' },
  { path: '/medstock', icon: '📦', label: 'Stock & PRN Protocols' },
  { path: '/medication', icon: '🔬', label: 'Medication Audit & Fire Drill' },
  { path: '/pettycash', icon: '💰', label: 'Petty Cash & Finance' },

  { section: 'Staff & Training' },
  { path: '/roster', icon: '📅', label: 'Staff Roster' },
  { path: '/attendance', icon: '✅', label: 'Staff Attendance' },
  { path: '/training', icon: '🎓', label: 'Training Sign-Off' },
  { path: '/supervision', icon: '👁', label: 'Staff Supervision' },
  { path: '/induction', icon: '📝', label: 'Induction Checklist' },
  { path: '/appraisals', icon: '⭐', label: 'Performance Appraisals', minLevel: 4 },

  { section: 'Safety & Compliance' },
  { path: '/healthsafety', icon: '🏥', label: 'H&S Inspection' },
  { path: '/maintenance', icon: '🔧', label: 'Maintenance & Repairs' },
  { path: '/compliancereview', icon: '📊', label: 'Compliance Review' },
  { path: '/houserisk', icon: '🏠', label: 'House Risk Assessment' },
  { path: '/riskregister', icon: '📉', label: 'Risk Register' },
  { path: '/fireequipment', icon: '🧯', label: 'Fire Equipment Service' },

  { section: 'Governance' },
  { path: '/audit', icon: '📁', label: 'Audit Trail & Documents' },
  { path: '/complaints', icon: '📝', label: 'Complaints & Feedback', minLevel: 2 },
  { path: '/compliments', icon: '⭐', label: 'Compliments' },
  { path: '/governance', icon: '🏛', label: 'Governance Minutes', minLevel: 3 },
  { path: '/govactions', icon: '✅', label: 'Governance Actions', minLevel: 3 },
  { path: '/qip', icon: '📈', label: 'Quality Improvement Plan', minLevel: 3 },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🏠</div>
          <div><h2>Chosanta</h2><small>CMS</small></div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.section) return <div key={i} className="sidebar-section">{item.section}</div>;
            if (item.minLevel && user.role_level < item.minLevel) return null;
            return (
              <button key={i} className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`} onClick={() => navigate(item.path)}>
                <span className="icon">{item.icon}</span>{item.label}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.full_name.split(' ').map(n => n[0]).join('')}</div>
          <div className="sidebar-user-info">
            <p>{user.full_name}</p>
            <small>{user.role}</small>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Logout">🚪</button>
        </div>
      </aside>
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-search"><span>🔍</span><input placeholder="Search records, documents, children..." /></div>
          <div className="topbar-right"><span>📅 {new Date().toLocaleDateString('en-IE')}</span></div>
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
