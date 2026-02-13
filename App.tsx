
import React, { useState, useEffect } from 'react';
import { User, UserRole, Referral, ReferralStatus, Hospital } from './types';
import { MOCK_HOSPITALS, MOCK_DOCTORS, INITIAL_REFERRALS, STATUS_COLORS } from './constants';
import Layout from './components/Layout';
import ReferralModal from './components/ReferralModal';
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
  // Fix: Import Hospital as HospitalIcon to avoid name collision with Hospital type from types.ts
  Hospital as HospitalIcon,
  // Fix: Import missing Users icon
  Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-login for demo purposes
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center space-y-8">
          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl shadow-blue-500/20 mb-6">
              M
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">MedRef Connect</h1>
            <p className="text-slate-500 mt-2">Private Surgical Referral Network</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Select Demo Role</p>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setCurrentUser({
                  id: 'ma1',
                  name: 'System Controller',
                  email: 'master@medref.com',
                  role: UserRole.MASTER_ADMIN
                })}
                className="w-full p-4 rounded-xl border-2 border-amber-100 hover:border-amber-500 hover:bg-amber-50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800">Master Admin</p>
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-xs text-slate-500">Platform-wide oversight (View Only)</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500" />
              </button>
              
              <button
                onClick={() => setCurrentUser(MOCK_DOCTORS[0])}
                className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-800">MBBS Doctor</p>
                  <p className="text-xs text-slate-500">Create and track referrals</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
              </button>
              <button
                onClick={() => setCurrentUser({
                  id: 'ha1',
                  name: 'Hospital Admin',
                  email: 'admin@citygeneral.com',
                  role: UserRole.HOSPITAL_ADMIN,
                  organizationId: 'h1'
                })}
                className="w-full p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition-all group flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-slate-800">Hospital Admin</p>
                  <p className="text-xs text-slate-500">Manage incoming cases</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-xs text-slate-400">
              This platform is strictly invite-only. Unauthorized access is prohibited by medical confidentiality agreements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Define logic for what referrals to see
  const userReferrals = currentUser.role === UserRole.MASTER_ADMIN
    ? referrals
    : currentUser.role === UserRole.REFERRING_DOCTOR 
      ? referrals.filter(r => r.referringDoctorId === currentUser.id)
      : referrals.filter(r => r.hospitalId === currentUser.organizationId);

  const stats = [
    { label: 'Total Referrals', value: userReferrals.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Successful Surgeries', value: userReferrals.filter(r => r.status === ReferralStatus.SURGERY_COMPLETED).length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'In Progress', value: userReferrals.filter(r => ![ReferralStatus.CASE_CLOSED, ReferralStatus.SURGERY_COMPLETED].includes(r.status)).length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Conversion Rate', value: `${userReferrals.length > 0 ? Math.round((userReferrals.filter(r => r.status === ReferralStatus.SURGERY_COMPLETED).length / userReferrals.length) * 100) : 0}%`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {currentUser.role === UserRole.MASTER_ADMIN 
                ? 'Platform Global Monitor' 
                : (currentUser.role === UserRole.REFERRING_DOCTOR ? 'Referral Hub' : 'Inbound Referrals')}
            </h1>
            <p className="text-slate-500 mt-1">
              {currentUser.role === UserRole.MASTER_ADMIN 
                ? 'Consolidated view of all referral doctor and hospital activity.' 
                : 'Manage patient hand-offs and track surgical outcomes.'}
            </p>
          </div>
          
          {currentUser.role === UserRole.REFERRING_DOCTOR && (
            <button
              onClick={() => setIsReferralModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
            >
              <UserPlus className="w-5 h-5" />
              Refer New Patient
            </button>
          )}

          {currentUser.role === UserRole.MASTER_ADMIN && (
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:bg-slate-800 text-sm">
                {/* Fix: Use aliased HospitalIcon to avoid type collision */}
                <HospitalIcon className="w-4 h-4" />
                Manage Hospitals
              </button>
              <button className="flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl transition-all hover:bg-slate-800 text-sm">
                {/* Fix: Use imported Users icon */}
                <Users className="w-4 h-4" />
                Manage Doctors
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  +4%
                </div>
              </div>
              <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Analytics & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search patient or hospital..." 
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                {currentUser.role === UserRole.MASTER_ADMIN && (
                   <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                     <Eye className="w-3.5 h-3.5" />
                     READ-ONLY GLOBAL VIEW
                   </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                      <th className="px-6 py-4">Patient & Contact</th>
                      <th className="px-6 py-4">Destination Hospital</th>
                      {currentUser.role === UserRole.MASTER_ADMIN && <th className="px-6 py-4">Referring Doctor</th>}
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userReferrals.length > 0 ? (
                      userReferrals.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm">
                                {ref.patientName[0]}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 leading-none">{ref.patientName}</p>
                                <p className="text-xs text-slate-500 mt-1">{ref.patientMobile}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-slate-700">
                              {MOCK_HOSPITALS.find(h => h.id === ref.hospitalId)?.name}
                            </p>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              ID: {ref.id}
                            </p>
                          </td>
                          {currentUser.role === UserRole.MASTER_ADMIN && (
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-slate-700">
                                {MOCK_DOCTORS.find(d => d.id === ref.referringDoctorId)?.name || 'Admin Referral'}
                              </p>
                            </td>
                          )}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[ref.status]}`}>
                              {ref.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600">{new Date(ref.createdAt).toLocaleDateString()}</p>
                            <p className="text-[10px] text-slate-400">{new Date(ref.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={currentUser.role === UserRole.MASTER_ADMIN ? 6 : 5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                              <AlertCircle className="w-8 h-8" />
                            </div>
                            <div className="max-w-xs mx-auto">
                              <p className="font-bold text-slate-800">No active referrals found</p>
                              <p className="text-sm text-slate-500">The platform registry is currently empty or filtered.</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-center">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                  VIEW ALL HISTORY <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column / Charts & Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                {currentUser.role === UserRole.MASTER_ADMIN ? 'Global Network Flow' : 'Referral Flow Trends'}
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Mon', count: 4 },
                    { name: 'Tue', count: 7 },
                    { name: 'Wed', count: 3 },
                    { name: 'Thu', count: 8 },
                    { name: 'Fri', count: 5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {[1, 2, 3, 4, 5].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-lg mb-2">Ethical Value Redistribution</h4>
                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                  Referral discounts are automatically redirected to our partnered NGOs if you choose to.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Total Contributed</span>
                  <span className="text-2xl font-bold">₹42,500</span>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg font-bold text-sm transition-colors border border-white/20">
                  View Impact Report
                </button>
              </div>
              <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {isReferralModalOpen && (
        <ReferralModal
          onClose={() => setIsReferralModalOpen(false)}
          onSubmit={handleAddReferral}
          hospitals={MOCK_HOSPITALS}
          referringDoctor={currentUser}
        />
      )}
    </Layout>
  );
};

export default App;
