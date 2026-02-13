
import React, { useState, useEffect } from 'react';
import { User, UserRole, Referral, ReferralStatus, Hospital } from './types';
import { 
  MOCK_HOSPITALS, 
  MOCK_DOCTORS, 
  MOCK_HOSPITAL_USERS, 
  MOCK_MASTER_ADMIN, 
  INITIAL_REFERRALS, 
  STATUS_COLORS 
} from './constants';
import Layout from './components/Layout';
import ReferralModal from './components/ReferralModal';
import AddHospitalModal from './components/AddHospitalModal';
import AddDoctorModal from './components/AddDoctorModal';
import { 
  FileText, 
  UserPlus, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Eye,
  Hospital as HospitalIcon,
  Users,
  MapPin,
  Phone,
  Plus,
  Settings,
  Lock,
  User as UserIcon,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS || []);
  const [hospitals, setHospitals] = useState<Hospital[]>(MOCK_HOSPITALS || []);
  const [users, setUsers] = useState<User[]>([
    MOCK_MASTER_ADMIN,
    ...MOCK_DOCTORS,
    ...MOCK_HOSPITAL_USERS
  ]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Login states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginMode, setLoginMode] = useState<'DEMO' | 'CREDENTIALS'>('DEMO');

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isAddHospitalModalOpen, setIsAddHospitalModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError('');
  };

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginUsername && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

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
    setReferrals(prev => [newRef, ...prev]);
    setIsReferralModalOpen(false);
  };

  const handleAddHospital = (hospital: Hospital, adminUser: User) => {
    setHospitals(prev => [...prev, hospital]);
    setUsers(prev => [...prev, adminUser]);
    setIsAddHospitalModalOpen(false);
  };

  const handleAddDoctor = (doctor: User) => {
    setUsers(prev => [...prev, doctor]);
    setIsAddDoctorModalOpen(false);
  };

  const updateReferralField = (referralId: string, field: keyof Referral, value: any) => {
    setReferrals(prev => prev.map(ref => 
      ref.id === referralId ? { ...ref, [field]: value, updatedAt: new Date().toISOString() } : ref
    ));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl shadow-blue-500/20 mb-6">M</div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">MedRef Connect</h1>
            <p className="text-slate-500 mt-2">Private Surgical Referral Network</p>
          </div>

          <div className="flex p-1 bg-slate-100 rounded-xl">
             <button 
                onClick={() => setLoginMode('DEMO')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginMode === 'DEMO' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Quick Demo
             </button>
             <button 
                onClick={() => setLoginMode('CREDENTIALS')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${loginMode === 'CREDENTIALS' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Portal Login
             </button>
          </div>

          {loginMode === 'DEMO' ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Select Access Point</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => setCurrentUser(MOCK_MASTER_ADMIN)} className="w-full p-4 rounded-xl border-2 border-amber-100 hover:border-amber-500 hover:bg-amber-50 text-left transition-all group flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2"><p className="font-bold text-slate-800">Master Admin</p><ShieldCheck className="w-4 h-4 text-amber-500" /></div>
                    <p className="text-xs text-slate-500">System oversight & management</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500" />
                </button>
                <button onClick={() => setCurrentUser(MOCK_DOCTORS[0])} className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group flex items-center justify-between">
                  <div><p className="font-bold text-slate-800">Doctor View</p><p className="text-xs text-slate-500">Create & track patient referrals</p></div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                </button>
                <button onClick={() => setCurrentUser(MOCK_HOSPITAL_USERS[0])} className="w-full p-4 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all group flex items-center justify-between">
                  <div><p className="font-bold text-slate-800">Hospital Admin</p><p className="text-xs text-slate-500">Manage inbound cases & surgery</p></div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCredentialLogin} className="space-y-4 text-left">
               <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                       required
                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="Enter your username"
                       value={loginUsername}
                       onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input 
                       required
                       type="password"
                       className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="••••••••"
                       value={loginPassword}
                       onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
               </div>
               
               {loginError && (
                 <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-sm border border-rose-100 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4" />
                    {loginError}
                 </div>
               )}

               <button 
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
               >
                  Sign In to Portal
                  <ChevronRight className="w-5 h-5" />
               </button>
            </form>
          )}
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
    { label: 'Referral Doctors', value: users.filter(u => u.role === UserRole.REFERRING_DOCTOR).length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {currentUser.role === UserRole.MASTER_ADMIN ? 'Platform Overview' : 'Referral Hub'}
          </h1>
          <p className="text-slate-500 mt-1">
            {currentUser.role === UserRole.MASTER_ADMIN ? 'Global monitoring of the referral ecosystem.' : 'Manage and track your active cases.'}
          </p>
        </div>
        <div className="flex gap-3">
          {currentUser.role === UserRole.MASTER_ADMIN && (
            <>
              <button onClick={() => setIsAddHospitalModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-900/10"><Plus className="w-4 h-4" /> Add Hospital</button>
              <button onClick={() => setIsAddDoctorModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-600/10"><UserPlus className="w-4 h-4" /> Add Doctor</button>
            </>
          )}
          {currentUser.role === UserRole.REFERRING_DOCTOR && (
            <button onClick={() => setIsReferralModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all text-sm shadow-lg shadow-blue-600/10"><Plus className="w-4 h-4" /> New Referral</button>
          )}
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
          {currentUser.role === UserRole.MASTER_ADMIN && (
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100"><Eye className="w-3.5 h-3.5" /> READ-ONLY GLOBAL VIEW</div>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor Details</th>
                <th className="px-6 py-4">File ID</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userReferrals.length > 0 ? (
                userReferrals.map((ref) => {
                  const doctor = users.find(u => u.id === ref.referringDoctorId);
                  const isHospital = currentUser.role === UserRole.HOSPITAL_ADMIN;
                  
                  return (
                    <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm">
                            {ref.patientName ? ref.patientName[0] : 'P'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none">{ref.patientName}</p>
                            <p className="text-xs text-slate-500 mt-1">{ref.patientMobile}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800">{doctor?.name || 'Unknown Doctor'}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-blue-500" />
                            {doctor?.phone || 'No phone'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isHospital ? (
                          <input 
                            type="text"
                            placeholder="Set File ID"
                            value={ref.fileId || ''}
                            onChange={(e) => updateReferralField(ref.id, 'fileId', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <span className="text-xs font-mono text-slate-500">{ref.fileId || '-'}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isHospital ? (
                          <select 
                            value={ref.status}
                            onChange={(e) => updateReferralField(ref.id, 'status', e.target.value)}
                            className={`w-full text-[11px] font-bold border rounded-full px-3 py-1.5 outline-none cursor-pointer ${STATUS_COLORS[ref.status] || 'bg-slate-100 text-slate-600'}`}
                          >
                            <option value={ReferralStatus.CREATED}>Created</option>
                            <option value={ReferralStatus.SURGERY_COMPLETED}>Surgery Completed</option>
                            <option value={ReferralStatus.MEDICATION_DONE}>Medication Done</option>
                            <option value={ReferralStatus.PACKAGE_DISCUSSED}>Package Discussed</option>
                            <option value={ReferralStatus.SURGERY_LOST}>Surgery Lost</option>
                            <option value={ReferralStatus.NOT_ARRIVED}>Not Arrived</option>
                            <option value={ReferralStatus.FOLLOWUP_SURGERY}>Follow-up Surgery</option>
                            <option value={ReferralStatus.FOLLOWUP}>Follow-up</option>
                            <option value={ReferralStatus.PRE_OPS}>Pre-Ops</option>
                            <option value={ReferralStatus.RNR}>RNR</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[ref.status] || 'bg-slate-100 text-slate-600'}`}>
                            {ref.status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isHospital ? (
                          <div className="relative group/note">
                            <MessageSquare className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                            <input 
                              type="text"
                              placeholder="Add Note"
                              value={ref.note || ''}
                              onChange={(e) => updateReferralField(ref.id, 'note', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 italic max-w-[150px] truncate">{ref.note || 'No remarks'}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-slate-500 font-medium">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">No referrals found in current stream.</td>
                </tr>
              )}
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
        {currentUser.role === UserRole.MASTER_ADMIN && (
          <button onClick={() => setIsAddHospitalModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"><Plus className="w-5 h-5" /> Register New Hospital</button>
        )}
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
                {hospital.capabilities?.map((cap, i) => (
                  <span key={i} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 uppercase">{cap}</span>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Primary Contact: {hospital.contactPerson}</span>
              {currentUser.role === UserRole.MASTER_ADMIN && <button className="text-blue-600 hover:underline">Manage Account</button>}
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
        {currentUser.role === UserRole.MASTER_ADMIN && (
          <button onClick={() => setIsAddDoctorModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"><UserPlus className="w-5 h-5" /> Authorize New Doctor</button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
              <th className="px-6 py-4">Physician Name</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Reg. Number</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.filter(u => u.role === UserRole.REFERRING_DOCTOR).map(doctor => (
              <tr key={doctor.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.email}`} alt="avatar" /></div><p className="font-bold text-slate-900">{doctor.name}</p></div></td>
                <td className="px-6 py-4 text-sm text-slate-600 flex flex-col">
                  <span className="font-medium text-slate-800">{doctor.phone || 'N/A'}</span>
                  <span className="text-[10px] text-slate-400">{doctor.email}</span>
                </td>
                <td className="px-6 py-4"><span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">{doctor.registrationNumber}</span></td>
                <td className="px-6 py-4 text-sm text-slate-600">{doctor.location}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600 p-2"><Settings className="w-4 h-4" /></button>
                </td>
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
      {activeTab === 'referrals' && renderDashboard()}
      {activeTab === 'settings' && <div className="p-12 text-center text-slate-400"><Settings className="w-12 h-12 mx-auto mb-4 opacity-20" /><p className="font-medium">System Settings Coming Soon</p></div>}
      
      {isReferralModalOpen && <ReferralModal onClose={() => setIsReferralModalOpen(false)} onSubmit={handleAddReferral} hospitals={hospitals} referringDoctor={currentUser} />}
      {isAddHospitalModalOpen && <AddHospitalModal onClose={() => setIsAddHospitalModalOpen(false)} onSubmit={handleAddHospital} />}
      {isAddDoctorModalOpen && <AddDoctorModal onClose={() => setIsAddDoctorModalOpen(false)} onSubmit={handleAddDoctor} />}
    </Layout>
  );
};

export default App;
