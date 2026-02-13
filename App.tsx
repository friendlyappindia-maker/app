
import React, { useState, useEffect, useRef } from 'react';
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
  MessageSquare,
  Upload,
  X,
  Save,
  Trash2,
  Stethoscope,
  Info,
  ExternalLink,
  ChevronLeft,
  // Fix: Added missing PlusCircle import
  PlusCircle
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
  
  // Hospital Detail View State
  const [selectedHospitalForView, setSelectedHospitalForView] = useState<Hospital | null>(null);

  // Profile Edit State
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [newCapability, setNewCapability] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser?.role === UserRole.HOSPITAL_ADMIN && currentUser.organizationId) {
      const hospital = hospitals.find(h => h.id === currentUser.organizationId);
      if (hospital) setEditingHospital({ ...hospital });
    }
  }, [currentUser, hospitals]);

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

  const handleAddHospital = (username: string, password: string) => {
    const hospitalId = `h-${Date.now()}`;
    const newHospital: Hospital = {
      id: hospitalId,
      name: `${username.charAt(0).toUpperCase() + username.slice(1)} Hospital`,
      registrationNumber: `HOSP-TBD-${Math.floor(Math.random() * 1000)}`,
      address: 'Update Address in Profile',
      city: 'Update City',
      contactPerson: 'Admin',
      phone: '0000000000',
      capabilities: ['General Surgery'],
      images: []
    };

    const adminUser: User = {
      id: `hu-${Date.now()}`,
      name: `${username.charAt(0).toUpperCase() + username.slice(1)} Admin`,
      email: `${username}@medref-hospital.com`,
      username: username,
      password: password,
      role: UserRole.HOSPITAL_ADMIN,
      organizationId: hospitalId
    };

    setHospitals(prev => [...prev, newHospital]);
    setUsers(prev => [...prev, adminUser]);
    setIsAddHospitalModalOpen(false);
  };

  const handleAddDoctor = (username: string, password: string) => {
    const doctor: User = {
      id: `d-${Date.now()}`,
      name: `Dr. ${username.charAt(0).toUpperCase() + username.slice(1)}`,
      email: `${username}@medref.com`,
      phone: '',
      username: username,
      password: password,
      role: UserRole.REFERRING_DOCTOR,
      registrationNumber: 'REG-PENDING',
      location: 'Update Location'
    };
    setUsers(prev => [...prev, doctor]);
    setIsAddDoctorModalOpen(false);
  };

  const updateReferralField = (referralId: string, field: keyof Referral, value: any) => {
    setReferrals(prev => prev.map(ref => 
      ref.id === referralId ? { ...ref, [field]: value, updatedAt: new Date().toISOString() } : ref
    ));
  };

  const handleUpdateHospitalProfile = () => {
    if (!editingHospital) return;
    setHospitals(prev => prev.map(h => h.id === editingHospital.id ? editingHospital : h));
    alert('Hospital profile updated successfully!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !editingHospital) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingHospital(prev => prev ? {
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        } : null);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setEditingHospital(prev => prev ? {
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    } : null);
  };

  const addCapability = () => {
    if (!newCapability.trim() || !editingHospital) return;
    setEditingHospital(prev => prev ? {
      ...prev,
      capabilities: [...prev.capabilities, newCapability.trim()]
    } : null);
    setNewCapability('');
  };

  const removeCapability = (index: number) => {
    setEditingHospital(prev => prev ? {
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    } : null);
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

  const renderHospitalDetailModal = (hospital: Hospital) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
              <HospitalIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{hospital.name}</h2>
              <p className="text-slate-500 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                {hospital.registrationNumber} • Verified Facility
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSelectedHospitalForView(null)}
            className="p-3 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Facility Showcase</h3>
            </div>
            {hospital.images && hospital.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospital.images.map((img, i) => (
                  <div key={i} className="aspect-video rounded-[24px] overflow-hidden border border-slate-100 shadow-sm hover:scale-[1.02] transition-transform duration-300">
                    <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[24px] p-12 text-center text-slate-400">
                <Plus className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold">No facility photos uploaded yet</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Contact & Location */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-5">
                 <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Location & Reach</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Physical Address</p>
                    <p className="text-slate-700 font-bold leading-relaxed">{hospital.address}</p>
                    <p className="text-indigo-600 font-black">{hospital.city}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Direct Contact</p>
                      <p className="text-slate-900 font-black text-lg">{hospital.phone}</p>
                    </div>
                    <a href={`tel:${hospital.phone}`} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200"><Phone className="w-5 h-5" /></a>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[24px] border-2 border-indigo-50 shadow-sm space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Surgical Capabilities</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hospital.capabilities.map((cap, i) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-100 font-black text-sm uppercase tracking-tight">
                      {cap}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                    Referrals for these specialties are processed with priority tracking in the MedRef system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
           <button 
              onClick={() => {
                setSelectedHospitalForView(null);
                setActiveTab('dashboard');
                setIsReferralModalOpen(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 group"
            >
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              CREATE REFERRAL NOW
            </button>
        </div>
      </div>
    </div>
  );

  const renderHospitals = () => (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registered Hospitals</h1>
          <p className="text-slate-500 font-medium">Browse verified surgical facilities and their specializations.</p>
        </div>
        {currentUser.role === UserRole.MASTER_ADMIN && (
          <button onClick={() => setIsAddHospitalModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"><Plus className="w-5 h-5" /> Register New Hospital</button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hospitals.map(hospital => (
          <div key={hospital.id} className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all group relative">
            {hospital.images && hospital.images.length > 0 ? (
              <div className="h-48 overflow-hidden relative">
                <img src={hospital.images[0]} alt={hospital.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              </div>
            ) : (
              <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-300">
                <HospitalIcon className="w-12 h-12" />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <HospitalIcon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 tracking-widest uppercase mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 tracking-widest">{hospital.registrationNumber}</span>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{hospital.name}</h3>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-600 flex items-center gap-2.5 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" /> 
                  {hospital.city}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {hospital.capabilities?.slice(0, 3).map((cap, i) => (
                    <span key={i} className="text-[10px] font-black bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-tighter">
                      {cap}
                    </span>
                  ))}
                  {hospital.capabilities.length > 3 && (
                    <span className="text-[10px] font-black text-slate-400 px-2.5 py-1">+{hospital.capabilities.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => setSelectedHospitalForView(hospital)}
                  className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:underline tracking-tight group/btn"
                >
                  VIEW PROFILE
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
                {currentUser.role === UserRole.REFERRING_DOCTOR && (
                  <button 
                    onClick={() => {
                      setSelectedHospitalForView(null);
                      setIsReferralModalOpen(true);
                    }}
                    className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHospitalProfile = () => {
    if (!editingHospital) return null;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hospital Profile</h1>
            <p className="text-slate-500 mt-1">Configure your facility's public information and services.</p>
          </div>
          <button 
            onClick={handleUpdateHospitalProfile}
            className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Save className="w-5 h-5" />
            Save Profile Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Settings className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Hospital Name</label>
                  <input 
                    type="text"
                    value={editingHospital.name}
                    onChange={(e) => setEditingHospital({...editingHospital, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</label>
                  <textarea 
                    rows={3}
                    value={editingHospital.address}
                    onChange={(e) => setEditingHospital({...editingHospital, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium"
                    placeholder="Physical street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">City</label>
                    <input 
                      type="text"
                      value={editingHospital.city}
                      onChange={(e) => setEditingHospital({...editingHospital, city: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <input 
                      type="tel"
                      value={editingHospital.phone}
                      onChange={(e) => setEditingHospital({...editingHospital, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Surgical Capabilities */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800">Surgical Capabilities</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {editingHospital.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 font-bold text-xs group">
                    {cap}
                    <button onClick={() => removeCapability(i)} className="text-indigo-400 hover:text-indigo-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Laparoscopic Surgery"
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCapability()}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button 
                  onClick={addCapability}
                  className="px-6 py-3 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Image Management */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">Gallery</h3>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{editingHospital.images?.length || 0} / 5</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {editingHospital.images?.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 p-1.5 bg-white/90 text-rose-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(editingHospital.images?.length || 0) < 5 && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-400 transition-all gap-2"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase">Add Photo</span>
                  </button>
                )}
              </div>
              <input 
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-[10px] text-slate-400 font-medium text-center">Images should be under 5MB. Formats: PNG, JPG.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

  const renderSettings = () => {
    if (currentUser.role === UserRole.HOSPITAL_ADMIN) {
      return renderHospitalProfile();
    }
    return (
      <div className="p-12 text-center text-slate-400">
        <Settings className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="font-medium">Master Settings Coming Soon</p>
      </div>
    );
  };

  return (
    <Layout user={currentUser} onLogout={handleLogout} activeTab={activeTab} onNavigate={setActiveTab}>
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'hospitals' && renderHospitals()}
      {activeTab === 'doctors' && renderDoctors()}
      {activeTab === 'referrals' && renderDashboard()}
      {activeTab === 'settings' && renderSettings()}
      
      {isReferralModalOpen && <ReferralModal onClose={() => setIsReferralModalOpen(false)} onSubmit={handleAddReferral} hospitals={hospitals} referringDoctor={currentUser} />}
      {isAddHospitalModalOpen && <AddHospitalModal onClose={() => setIsAddHospitalModalOpen(false)} onSubmit={handleAddHospital} />}
      {isAddDoctorModalOpen && <AddDoctorModal onClose={() => setIsAddDoctorModalOpen(false)} onSubmit={handleAddDoctor} />}
      {selectedHospitalForView && renderHospitalDetailModal(selectedHospitalForView)}
    </Layout>
  );
};

export default App;
