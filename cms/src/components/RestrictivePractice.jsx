import React, { useState, useEffect } from 'react';
import { api } from '../App';

const SH = ({ num, title }) => (
  <div style={{ background: 'linear-gradient(135deg, #0d1b2a, #1b2d42)', color: '#fff', padding: '6px 14px', borderRadius: 5, margin: '16px 0 8px', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
    <span style={{ background: 'linear-gradient(135deg, #c9a84c, #e0c070)', color: '#0d1b2a', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{num}</span>{title}
  </div>
);
const Check = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
    <input type="checkbox" checked={checked||false} onChange={onChange} style={{ width: 16, height: 16, accentColor: '#c9a84c' }} />{label}
  </label>
);

const TYPES = ['Physical hold / restraint (TCI-approved)','Guided away','Room restriction','Separation from peers','Environmental restriction','Other'];

export default function RestrictivePractice() {
  const [children, setChildren] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({});
  useEffect(() => { api('/api/children').then(setChildren); }, []);
  const F = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const openNew = () => {
    setForm({ date: new Date().toISOString().slice(0,10), time_start:'', time_end:'', duration:'', location:'', child_id:'', intervention_type:'', technique:'', behaviour:'', immediate_risk:'', deescalation:'', why_insufficient:'', staff_involved:'', child_spoken_to:true, proportionate:true, injury_detail:'', child_checked:true, medical_needed:false, sw_notified:false, parent_notified:false, nims_submitted:false, nims_ref:'', child_debrief_date:'', child_willing:true, child_q1:'', child_q2:'', child_q3:'', child_q4:'', child_q5:'', learning:'', pic_reviewed:false });
    setShowModal(true);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Physical Intervention &amp; Restrictive Practice</h1><p style={{fontSize:12,color:'#9a9484',marginTop:2}}>HIQA Standard 3 · TCI Model · Tusla NIMS</p></div>
        <button className="btn btn-primary" onClick={openNew}>+ New Record</button>
      </div>
      <div style={{background:'#fff0f0',border:'1px solid #c0392b',borderRadius:6,padding:'10px 16px',marginBottom:16,fontSize:12}}>
        <strong>⚠ CRITICAL:</strong> Physical intervention = absolute last resort. Record within 24 hours. Report to PIC immediately. Notify Tusla via NIMS.
      </div>
      <div className="card"><div className="card-body"><div className="empty-state"><div className="icon">🛑</div><p>No restrictive practice records yet.</p></div></div></div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{width:780,maxHeight:'92vh'}} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{background:'linear-gradient(135deg,#0d1b2a,#1b2d42)',color:'#fff',borderRadius:'12px 12px 0 0'}}><h2 style={{color:'#fff'}}>🛑 Physical Intervention Record</h2><button className="modal-close" style={{color:'#fff'}} onClick={() => setShowModal(false)}>×</button></div>
            <div className="modal-body" style={{padding:'12px 24px 20px'}}>
              <SH num="1" title="Incident Details" />
              <div className="form-grid">
                <div className="form-group"><label>Date</label><input type="date" value={form.date} onChange={e=>F('date',e.target.value)}/></div>
                <div className="form-group"><label>Time Started</label><input type="time" value={form.time_start} onChange={e=>F('time_start',e.target.value)}/></div>
                <div className="form-group"><label>Time Ended</label><input type="time" value={form.time_end} onChange={e=>F('time_end',e.target.value)}/></div>
                <div className="form-group"><label>Duration</label><input value={form.duration||''} onChange={e=>F('duration',e.target.value)} placeholder="e.g. 3 minutes"/></div>
                <div className="form-group"><label>Location</label><input value={form.location||''} onChange={e=>F('location',e.target.value)}/></div>
                <div className="form-group"><label>Child</label><select value={form.child_id} onChange={e=>F('child_id',e.target.value)}><option value="">Select...</option>{children.map(c=><option key={c.id} value={c.id}>{c.ref_code} — {c.first_name} {c.last_name}</option>)}</select></div>
              </div>
              <SH num="2" title="Type of Intervention" />
              <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>{TYPES.map(t=><Check key={t} label={t} checked={form.intervention_type===t} onChange={()=>F('intervention_type',t)}/>)}</div>
              <SH num="3" title="Events Leading to Intervention" />
              <div className="form-group"><label>Child's behaviour / state?</label><textarea value={form.behaviour||''} onChange={e=>F('behaviour',e.target.value)} rows={2}/></div>
              <div className="form-group"><label>Immediate risk / danger?</label><textarea value={form.immediate_risk||''} onChange={e=>F('immediate_risk',e.target.value)} rows={2}/></div>
              <div className="form-group"><label>De-escalation attempted</label><textarea value={form.deescalation||''} onChange={e=>F('deescalation',e.target.value)} rows={2}/></div>
              <SH num="4" title="During the Intervention" />
              <div className="form-group"><label>Staff Involved (name, role, TCI trained?)</label><textarea value={form.staff_involved||''} onChange={e=>F('staff_involved',e.target.value)} rows={2}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,margin:'8px 0'}}>
                <Check label="Child spoken to throughout?" checked={form.child_spoken_to} onChange={e=>F('child_spoken_to',e.target.checked)}/>
                <Check label="Proportionate to risk?" checked={form.proportionate} onChange={e=>F('proportionate',e.target.checked)}/>
              </div>
              <div className="form-group"><label>Injuries (child or staff)</label><textarea value={form.injury_detail||''} onChange={e=>F('injury_detail',e.target.value)} rows={2} placeholder="None / Detail..."/></div>
              <SH num="5" title="After the Intervention" />
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,margin:'8px 0'}}>
                <Check label="Child checked for wellbeing?" checked={form.child_checked} onChange={e=>F('child_checked',e.target.checked)}/>
                <Check label="Medical attention needed?" checked={form.medical_needed} onChange={e=>F('medical_needed',e.target.checked)}/>
                <Check label="Social worker notified?" checked={form.sw_notified} onChange={e=>F('sw_notified',e.target.checked)}/>
                <Check label="Parent / guardian notified?" checked={form.parent_notified} onChange={e=>F('parent_notified',e.target.checked)}/>
                <Check label="NIMS submitted?" checked={form.nims_submitted} onChange={e=>F('nims_submitted',e.target.checked)}/>
              </div>
              <SH num="6" title="Child Debrief (within 24hrs)" />
              <p style={{fontSize:11,color:'#9a9484',fontStyle:'italic',marginBottom:6}}>By staff NOT involved. Use child's own words.</p>
              <Check label="Child willing to participate?" checked={form.child_willing} onChange={e=>F('child_willing',e.target.checked)}/>
              {form.child_willing && <>
                <div className="form-group"><label>What happened from your point of view?</label><textarea value={form.child_q1||''} onChange={e=>F('child_q1',e.target.value)} rows={2}/></div>
                <div className="form-group"><label>What were you feeling at the time?</label><textarea value={form.child_q2||''} onChange={e=>F('child_q2',e.target.value)} rows={2}/></div>
                <div className="form-group"><label>What could have helped before it escalated?</label><textarea value={form.child_q3||''} onChange={e=>F('child_q3',e.target.value)} rows={2}/></div>
                <div className="form-group"><label>How are you feeling now?</label><textarea value={form.child_q4||''} onChange={e=>F('child_q4',e.target.value)} rows={2}/></div>
                <div className="form-group"><label>Anything about how staff handled it?</label><textarea value={form.child_q5||''} onChange={e=>F('child_q5',e.target.value)} rows={2}/></div>
              </>}
              <SH num="7" title="Staff Debrief (within 48hrs)" />
              <div className="form-group"><label>Learning / changes</label><textarea value={form.learning||''} onChange={e=>F('learning',e.target.value)} rows={2}/></div>
              <SH num="8" title="PIC Review & Sign-Off" />
              <Check label="PIC reviewed all documentation?" checked={form.pic_reviewed} onChange={e=>F('pic_reviewed',e.target.checked)}/>
              <div style={{background:'#faf9f7',border:'1px dashed #c9a84c',borderRadius:6,padding:'8px 12px',marginTop:16,fontSize:11,color:'#5c5648'}}><strong>Ref:</strong> CM-RPL-001 · HIQA Standard 3 · TCI Cornell · Tusla NIMS</div>
            </div>
            <div className="modal-footer" style={{borderTop:'2px solid #c9a84c'}}><button className="btn btn-ghost" onClick={()=>setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={()=>setShowModal(false)}>💾 Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
