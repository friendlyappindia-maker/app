
import React, { useState } from 'react';
import { Hospital, User } from '../types';
import { X, Send, UserPlus } from 'lucide-react';
import { generatePatientNotification } from '../geminiService';

interface ReferralModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  hospitals: Hospital[];
  referringDoctor: User;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ onClose, onSubmit, hospitals, referringDoctor }) => {
  const [patientName, setPatientName] = useState('');
  const [patientMobile, setPatientMobile] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiTip, setAiTip] = useState('');

  const handlePreview = async () => {
    const hospital = hospitals.find(h => h.id === selectedHospital);
    if (!hospital) return;
    const msg = await generatePatientNotification(hospital.name, referringDoctor.name);
    setAiTip(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({
      patientName,
      patientMobile,
      hospitalId: selectedHospital,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">New Patient Referral</h3>
              <p className="text-sm text-slate-500">Secure digital medical hand-off</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Patient Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Rahul Sharma"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Mobile Number (WhatsApp Enabled)</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="+91 XXXXX XXXXX"
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Destination Hospital</label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition-all appearance-none"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="">Select a Hospital</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
              ))}
            </select>
          </div>

          {selectedHospital && !aiTip && (
             <button 
                type="button" 
                onClick={handlePreview}
                className="text-sm text-blue-600 font-medium hover:underline"
             >
                Preview patient notification message
             </button>
          )}

          {aiTip && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Patient SMS Preview</p>
              <p className="text-sm text-indigo-900 italic">"{aiTip}"</p>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {isSubmitting ? 'Submitting...' : 'Send Referral'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralModal;
