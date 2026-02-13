
import React, { useState } from 'react';
import { X, Hospital as HospitalIcon, Plus, Trash2, Shield } from 'lucide-react';
import { Hospital, User, UserRole } from '../types';

interface AddHospitalModalProps {
  onClose: () => void;
  onSubmit: (hospital: Hospital, adminUser: User) => void;
}

const AddHospitalModal: React.FC<AddHospitalModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    address: '',
    city: '',
    contactPerson: '',
    phone: '',
    capabilities: ['General Surgery'],
    username: '',
    password: ''
  });
  const [newCap, setNewCap] = useState('');

  const addCapability = () => {
    if (newCap.trim()) {
      setFormData({ ...formData, capabilities: [...formData.capabilities, newCap.trim()] });
      setNewCap('');
    }
  };

  const removeCapability = (index: number) => {
    setFormData({
      ...formData,
      capabilities: formData.capabilities.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hospitalId = `h-${Date.now()}`;
    const hospital: Hospital = {
      id: hospitalId,
      name: formData.name,
      registrationNumber: formData.registrationNumber,
      address: formData.address,
      city: formData.city,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      capabilities: formData.capabilities
    };

    const adminUser: User = {
      id: `hu-${Date.now()}`,
      name: `${formData.name} Admin`,
      email: `${formData.username}@medref-hospital.com`,
      username: formData.username,
      password: formData.password,
      role: UserRole.HOSPITAL_ADMIN,
      organizationId: hospitalId
    };

    onSubmit(hospital, adminUser);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <HospitalIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Register New Hospital</h3>
              <p className="text-sm text-slate-500">Expand the surgical referral network</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-4">
             <div className="flex items-center gap-2 text-indigo-700 mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Hospital Admin Account</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
                  <input
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    placeholder="e.g. apollo_mumbai"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <input
                    required
                    type="password"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital Name</label>
              <input
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reg. Number</label>
              <input
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="HOSP-YYYY-XXX"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
              <input
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <input
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Address</label>
            <textarea
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surgical Capabilities</label>
            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="e.g. Cardiology"
                value={newCap}
                onChange={(e) => setNewCap(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCapability())}
              />
              <button
                type="button"
                onClick={addCapability}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.capabilities.map((cap, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                  {cap}
                  <button type="button" onClick={() => removeCapability(i)} className="text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              Register Hospital
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHospitalModal;
