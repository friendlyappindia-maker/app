
import React, { useState, useEffect } from 'react';
import { User, UserRole, Referral, ReferralStatus, Hospital } from './types';
import { MOCK_HOSPITALS, MOCK_DOCTORS, INITIAL_REFERRALS, STATUS_COLORS } from './constants';
import Layout from './components/Layout';
import ReferralModal from './components/ReferralModal';
import AddHospitalModal from './components/AddHospitalModal';
import AddDoctorModal from './components/AddDoctorModal';
import { 
  FileText, 
  TrendingUp, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Filter,
  Search,
  ChevronRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  Eye,
  Hospital as HospitalIcon,
  Users,
  MapPin,
  Phone,
  Plus,
  Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS);
  const [doctors, setDoctors] = useState<User[]>(MOCK_DOCTORS);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isAddHospitalModalOpen, setIsAddHospitalModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);

  useEffect(() => {
    // Defaulting to doctor for initial demo load
    setCurrentUser(MOCK_DOCTORS[0]);
  }, []);

  const handleLogout = () => setCurrentUser(null);

  const handleAddReferral = (data: Partial<Referral>) => {
    const newRef: Referral = {
      id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: data.patientName || '',
      patientMobile: data.patientMobile || '',
      referringDoctorId: currentUser?.id || '',
      hospitalId: data.hospitalId || '',
      status: ReferralStatus.CREATED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReferrals([newRef, ...referrals]);
    setIsReferralModalOpen(false);
  };

  const handleAddHospital = (hospital: Hospital) => {
    setHospitals([...hospitals, hospital]);
    setIsAddHospitalModalOpen(false);
  };

  const handleAddDoctor = (doctor: User) => {
    setDoctors([...doctors, doctor]);
    setIsAddDoctorModalOpen(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center space-y-8">
          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl shadow-blue-500/20 mb-6">M</div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">MedRef Connect</h1>
            <p className="text-slate-500 mt-2">Private Surgical Referral Network</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Select Demo Role</p>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setCurrentUser({ id: 'ma1', name: 'System Controller', email: 'master@medref.com', role: UserRole.MASTER_ADMIN })} className="w-full p-4 rounded-xl border-2 border-amber-100 hover:border-amber-500 hover:bg-amber-50 text-left transition-all group flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2"><p className="font-bold text-slate-800">Master Admin</p><ShieldCheck className="w-4 h-4 text-amber-500" /></div>
                  <p className="text-xs text-slate-500">Platform-wide oversight</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500" />
              </button>
              <button onClick={() => setCurrentUser(MOCK_DOCTORS[0])} className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group flex items-center justify-between">
                <div><p className="font-bold text-slate-800">MBBS Doctor</p><p className="text-xs text-slate-500">Create and track referrals</p></div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userReferrals = currentUser.role === UserRole.MASTER_ADMIN
    ? referrals
    : currentUser.role === UserRole.REFERRING_DOCTOR 
      ? referrals.filter(r => r.referringDoctorId === currentUser.id)
      : referrals.filter(r => r.hospitalId === currentUser.organizationId);

  const stats = [
    { label: 'Total Referrals', value: userReferrals.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Surgery Completed', value: userReferrals.filter(r => r.status === ReferralStatus.SURGERY_COMPLETED).length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Hospitals', value: hospitals.length, icon: HospitalIcon, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Referral Doctors', value: doctors.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
          <p className="text-slate-500 mt-1">Global monitoring of the referral ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAddHospitalModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-900/10"><Plus className="w-4 h-4" /> Add Hospital</button>
          <button onClick={() => setIsAddDoctorModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-600/10"><UserPlus className="w-4 h-4" /> Add Doctor</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl w-fit mb-4`}><stat.icon className="w-6 h-6" /></div>
            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="font-bold text-slate-800">Recent Referral Stream</h3>
          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100"><Eye className="w-3.5 h-3.5" /> READ-ONLY GLOBAL VIEW</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Source Dr.</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm">{ref.patientName[0]}</div><div><p className="font-bold text-slate-900 leading-none">{ref.patientName}</p><p className="text-xs text-slate-500 mt-1">{ref.patientMobile}</p></div></div></td>
                  <td className="px-6 py-4"><p className="text-sm font-medium text-slate-700">{hospitals.find(h => h.id === ref.hospitalId)?.name}</p></td>
                  <td className="px-6 py-4"><p className="text-sm font-medium text-slate-700">{doctors.find(d => d.id === ref.referringDoctorId)?.name || 'Admin'}</p></td>
                  <td className="px-6 py-4 text-center"><span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[ref.status]}`}>{ref.status.replace(/_/g, ' ')}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(ref.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderHospitals = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Registered Hospitals</h1>
          <p className="text-slate-500">Manage surgical facilities in the MedRef network.</p>
        </div>
        <button onClick={() => setIsAddHospitalModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"><Plus className="w-5 h-5" /> Register New Hospital</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map(hospital => (
          <div key={hospital.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors"><HospitalIcon className="w-6 h-6" /></div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded tracking-widest">{hospital.registrationNumber}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{hospital.name}</h3>
              <div className="mt-3 space-y-2">
                <p className="text-xs text-slate-500 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {hospital.address}, {hospital.city}</p>
                <p className="text-xs text-slate-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {hospital.phone}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {hospital.capabilities.map((cap, i) => (
                  <span key={i} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 uppercase">{cap}</span>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Primary Contact: {hospital.contactPerson}</span>
              <button className="text-blue-600 hover:underline">Manage Settings</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDoctors = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Referring Doctors</h1>
          <p className="text-slate-500">Network of physicians authorized to create digital referrals.</p>
        </div>
        <button onClick={() => setIsAddDoctorModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"><UserPlus className="w-5 h-5" /> Authorize New Doctor</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
              <th className="px-6 py-4">Physician Name</th>
              <th className="px-6 py-4">Reg. Number</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctors.map(doctor => (
              <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`} alt="avatar" /></div><p className="font-bold text-slate-900">{doctor.name}</p></div></td>
                <td className="px-6 py-4"><span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{doctor.registrationNumber}</span></td>
                <td className="px-6 py-4 text-sm text-slate-600">{doctor.location}</td>
                {/* Fixed: Added missing Settings icon from lucide-react */}
                <td className="px-6 py-4 text-right"><button className="text-slate-400 hover:text-blue-600 p-2"><Settings className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Layout user={currentUser} onLogout={handleLogout} activeTab={activeTab} onNavigate={setActiveTab}>
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'hospitals' && renderHospitals()}
      {activeTab === 'doctors' && renderDoctors()}
      {activeTab === 'referrals' && renderDashboard() /* Reusing dashboard for now for global referral view */}
      {/* Fixed: Added missing Settings icon from lucide-react */}
      {activeTab === 'settings' && <div className="p-12 text-center text-slate-400"><Settings className="w-12 h-12 mx-auto mb-4 opacity-20" /><p className="font-medium">System Settings Coming Soon</p></div>}
      
      {isReferralModalOpen && <ReferralModal onClose={() => setIsReferralModalOpen(false)} onSubmit={handleAddReferral} hospitals={hospitals} referringDoctor={currentUser} />}
      {isAddHospitalModalOpen && <AddHospitalModal onClose={() => setIsAddHospitalModalOpen(false)} onSubmit={handleAddHospital} />}
      {isAddDoctorModalOpen && <AddDoctorModal onClose={() => setIsAddDoctorModalOpen(false)} onSubmit={handleAddDoctor} />}
    </Layout>
  );
};

export default App;
