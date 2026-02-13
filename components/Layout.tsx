
import React from 'react';
import { UserRole, User } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  Hospital, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  HeartHandshake, 
  ShieldCheck, 
  PlusCircle,
  Building2
} from 'lucide-react';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, children, onLogout, activeTab, onNavigate }) => {
  const getNavItems = () => {
    switch (user.role) {
      case UserRole.MASTER_ADMIN:
        return [
          { icon: LayoutDashboard, label: 'Platform Overview', id: 'dashboard' },
          { icon: Hospital, label: 'All Hospitals', id: 'hospitals' },
          { icon: Users, label: 'All Doctors', id: 'doctors' },
          { icon: FileText, label: 'Global Referrals', id: 'referrals' },
          { icon: Settings, label: 'Settings', id: 'settings' }
        ];
      case UserRole.REFERRING_DOCTOR:
        return [
          { icon: LayoutDashboard, label: 'Referral Hub', id: 'dashboard' },
          { icon: Building2, label: 'Hospitals', id: 'hospitals' }, // Added for doctors
          { icon: FileText, label: 'My Referrals', id: 'referrals' },
          { icon: HeartHandshake, label: 'NGO Impacts', id: 'impact' }
        ];
      case UserRole.HOSPITAL_ADMIN:
        return [
          { icon: LayoutDashboard, label: 'Inbound Cases', id: 'dashboard' },
          { icon: FileText, label: 'Surgical Queue', id: 'cases' },
          { icon: Settings, label: 'Hospital Profile', id: 'settings' }
        ];
      default:
        return [{ icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' }];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg">M</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">MedRef</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">Hello, {user.name.split(' ')[0]}</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                {user.role.replace('_', ' ')}
              </span>
              {user.role === UserRole.MASTER_ADMIN && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  Master
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="avatar" />
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
