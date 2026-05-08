import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import IncidentLog from './components/IncidentLog';
import HandoverLog from './components/HandoverLog';
import VisitorLog from './components/VisitorLog';

import RestrictivePractice from './components/RestrictivePractice';
import MissingChild from './components/MissingChild';
import AdmissionsLog from './components/AdmissionsLog';
import OnCallLog from './components/OnCallLog';
import SanctionsLog from './components/SanctionsLog';
import KeyworkingLog from './components/KeyworkingLog';
import StaffAttendance from './components/StaffAttendance';
import TrainingLog from './components/TrainingLog';
import SupervisionLog from './components/SupervisionLog';
import HSInspection from './components/HSInspection';
import MaintenanceLog from './components/MaintenanceLog';
import MedicationAudit from './components/MedicationAudit';
import RoomSearchLog from './components/RoomSearchLog';
import ComplaintsLog from './components/ComplaintsLog';
import ComplimentsLog from './components/ComplimentsLog';
import GovernanceMinutes from './components/GovernanceMinutes';
import AuditTrail from './components/AuditTrail';
import DailyRunningLog from './components/DailyRunningLog';
import MARLog from './components/MARLog';
import SENRegister from './components/SENRegister';
import ChildrenRegister from './components/ChildrenRegister';
import PettyCashLog from './components/PettyCashLog';
import StaffRoster from './components/StaffRoster';
import ComplianceReview from './components/ComplianceReview';
import ChildRiskAssessment from './components/ChildRiskAssessment';
import CarePlanLog from './components/CarePlanLog';
import EducationContacts from './components/EducationContacts';
import HouseRiskAssessment from './components/HouseRiskAssessment';
import RiskRegister from './components/RiskRegister';
import MissingChronology from './components/MissingChronology';
import PEEPLog from './components/PEEPLog';
import QIPTracker from './components/QIPTracker';
import StaffInduction from './components/StaffInduction';
import StaffAppraisals from './components/StaffAppraisals';
import FireEquipment from './components/FireEquipment';
import SafeguardingReferral from './components/SafeguardingReferral';
import ChildParticipation from './components/ChildParticipation';
import AbsencePlans from './components/AbsencePlans';
import NightChecks from './components/NightChecks';
import MedicationStock from './components/MedicationStock';
import GovernanceActions from './components/GovernanceActions';
import IncidentTrends from './components/IncidentTrends';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const api = async (url, opts = {}) => {
  const res = await fetch(url, { ...opts, credentials: 'include', headers: { 'Content-Type': 'application/json', ...opts.headers } });
  if (res.status === 401) throw new Error('AUTH');
  return res.json();
};
export { api };

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/auth/me').then(u => setUser(u)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /><p>Loading Chosanta CMS...</p></div>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/incidents" element={<IncidentLog />} />
            <Route path="/handovers" element={<HandoverLog />} />
            <Route path="/visitors" element={<VisitorLog />} />
            <Route path="/restrictive" element={<RestrictivePractice />} />
            <Route path="/missing" element={<MissingChild />} />
            <Route path="/admissions" element={<AdmissionsLog />} />
            <Route path="/oncall" element={<OnCallLog />} />
            <Route path="/sanctions" element={<SanctionsLog />} />
            <Route path="/keyworking" element={<KeyworkingLog />} />
            <Route path="/attendance" element={<StaffAttendance />} />
            <Route path="/training" element={<TrainingLog />} />
            <Route path="/supervision" element={<SupervisionLog />} />
            <Route path="/healthsafety" element={<HSInspection />} />
            <Route path="/maintenance" element={<MaintenanceLog />} />
            <Route path="/medication" element={<MedicationAudit />} />
            <Route path="/roomsearch" element={<RoomSearchLog />} />
            <Route path="/complaints" element={<ComplaintsLog />} />
            <Route path="/compliments" element={<ComplimentsLog />} />
            <Route path="/governance" element={<GovernanceMinutes />} />
            <Route path="/audit" element={<AuditTrail />} />
            <Route path="/dailylog" element={<DailyRunningLog />} />
            <Route path="/mar" element={<MARLog />} />
            <Route path="/sen" element={<SENRegister />} />
            <Route path="/childregister" element={<ChildrenRegister />} />
            <Route path="/pettycash" element={<PettyCashLog />} />
            <Route path="/roster" element={<StaffRoster />} />
            <Route path="/compliancereview" element={<ComplianceReview />} />
            <Route path="/childrisk" element={<ChildRiskAssessment />} />
            <Route path="/careplans" element={<CarePlanLog />} />
            <Route path="/education" element={<EducationContacts />} />
            <Route path="/houserisk" element={<HouseRiskAssessment />} />
            <Route path="/riskregister" element={<RiskRegister />} />
            <Route path="/missingchronology" element={<MissingChronology />} />
            <Route path="/peeps" element={<PEEPLog />} />
            <Route path="/qip" element={<QIPTracker />} />
            <Route path="/induction" element={<StaffInduction />} />
            <Route path="/appraisals" element={<StaffAppraisals />} />
            <Route path="/fireequipment" element={<FireEquipment />} />
            <Route path="/safeguarding" element={<SafeguardingReferral />} />
            <Route path="/participation" element={<ChildParticipation />} />
            <Route path="/absenceplans" element={<AbsencePlans />} />
            <Route path="/nightchecks" element={<NightChecks />} />
            <Route path="/medstock" element={<MedicationStock />} />
            <Route path="/govactions" element={<GovernanceActions />} />
            <Route path="/trends" element={<IncidentTrends />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
