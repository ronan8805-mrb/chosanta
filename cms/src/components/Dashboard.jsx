import React, { useState, useEffect } from 'react';
import { api } from '../App';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api('/api/dashboard').then(setStats).catch(console.error); }, []);

  if (!stats) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header"><h1>Dashboard</h1></div>
      <div className="dashboard-grid">
        <div className="stat-card info"><div className="stat-value">{stats.totalChildren}</div><div className="stat-label">Active Children</div></div>
        <div className={`stat-card ${stats.openIncidents > 0 ? 'danger' : 'success'}`}><div className="stat-value">{stats.openIncidents}</div><div className="stat-label">Open Incidents</div></div>
        <div className={`stat-card ${stats.pendingPICReview > 0 ? 'warning' : 'success'}`}><div className="stat-value">{stats.pendingPICReview}</div><div className="stat-label">Pending PIC Review</div></div>
        <div className="stat-card"><div className="stat-value">{stats.totalStaff}</div><div className="stat-label">Active Staff</div></div>
        <div className={`stat-card ${stats.overdueDocuments > 0 ? 'danger' : 'success'}`}><div className="stat-value">{stats.overdueDocuments}</div><div className="stat-label">Overdue Doc Reviews</div></div>
        <div className={`stat-card ${stats.openMaintenance > 0 ? 'warning' : 'success'}`}><div className="stat-value">{stats.openMaintenance}</div><div className="stat-label">Open Maintenance</div></div>
        <div className={`stat-card ${stats.trainingExpired > 0 ? 'danger' : 'success'}`}><div className="stat-value">{stats.trainingExpired}</div><div className="stat-label">Training Expired</div></div>
        <div className={`stat-card ${stats.trainingExpiring > 0 ? 'warning' : 'success'}`}><div className="stat-value">{stats.trainingExpiring}</div><div className="stat-label">Training Expiring (30d)</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header"><h3>Recent Incidents</h3></div>
          <div className="card-body">
            {stats.recentIncidents.length === 0
              ? <div className="empty-state"><p>No incidents recorded</p></div>
              : <table className="data-table">
                  <thead><tr><th>Date</th><th>Category</th><th>Severity</th><th>Child</th><th>Status</th></tr></thead>
                  <tbody>
                    {stats.recentIncidents.map(i => (
                      <tr key={i.id}>
                        <td>{i.date}</td><td>{i.category}</td>
                        <td><span className={`badge badge-${i.severity?.toLowerCase()}`}>{i.severity}</span></td>
                        <td>{i.child_name || '—'}</td>
                        <td><span className={`badge badge-${i.status?.toLowerCase()}`}>{i.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Recent Handovers</h3></div>
          <div className="card-body">
            {stats.recentHandovers.length === 0
              ? <div className="empty-state"><p>No handovers recorded</p></div>
              : <table className="data-table">
                  <thead><tr><th>Date</th><th>Shift</th><th>Leader</th></tr></thead>
                  <tbody>
                    {stats.recentHandovers.map(h => (
                      <tr key={h.id}><td>{h.date}</td><td>{h.shift_type}</td><td>{h.leader_name}</td></tr>
                    ))}
                  </tbody>
                </table>}
          </div>
        </div>
      </div>
    </div>
  );
}
