
import { Hospital, User, UserRole, NGO, Referral, ReferralStatus } from './types';

export const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'City General Surgical Center',
    registrationNumber: 'HOSP-2023-001',
    address: '123 Medical Plaza',
    city: 'Mumbai',
    contactPerson: 'Sarah Johnson',
    phone: '+91 9876543210',
    capabilities: ['Orthopedic', 'Cardiovascular', 'General Surgery', 'Neuro Surgery']
  },
  {
    id: 'h2',
    name: 'Apollo Specialty Hospital',
    registrationNumber: 'HOSP-2023-002',
    address: '45 Health Avenue',
    city: 'Pune',
    contactPerson: 'Michael Chen',
    phone: '+91 9876543211',
    capabilities: ['General Surgery', 'ENT', 'Urology']
  }
];

export const MOCK_DOCTORS: User[] = [
  {
    id: 'd1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.k@clinic.com',
    phone: '+91 91234 56789',
    username: 'doctor_kumar',
    password: 'password123',
    role: UserRole.REFERRING_DOCTOR,
    registrationNumber: 'REG-12345',
    location: 'Andheri West, Mumbai'
  },
  {
    id: 'd2',
    name: 'Dr. Anita Desai',
    email: 'anita.d@med.com',
    phone: '+91 98765 43210',
    username: 'doctor_anita',
    password: 'password123',
    role: UserRole.REFERRING_DOCTOR,
    registrationNumber: 'REG-54321',
    location: 'Kothrud, Pune'
  }
];

export const MOCK_HOSPITAL_USERS: User[] = [
  {
    id: 'hu1',
    name: 'Hospital Admin Mumbai',
    email: 'admin@citygeneral.com',
    username: 'hospital_mumbai',
    password: 'password123',
    role: UserRole.HOSPITAL_ADMIN,
    organizationId: 'h1'
  }
];

export const MOCK_MASTER_ADMIN: User = {
  id: 'ma1',
  name: 'System Controller',
  email: 'master@medref.com',
  username: 'admin',
  password: 'admin_password',
  role: UserRole.MASTER_ADMIN
};

export const MOCK_NGOS: NGO[] = [
  { id: 'n1', name: 'Health For All Foundation', mission: 'Rural medical aid' },
  { id: 'n2', name: 'Smile Surgical Trust', mission: 'Pediatric surgeries' }
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref-001',
    patientName: 'Amit Shah',
    patientMobile: '9988776655',
    referringDoctorId: 'd1',
    hospitalId: 'h1',
    status: ReferralStatus.SURGERY_COMPLETED,
    createdAt: '2023-11-01T10:00:00Z',
    updatedAt: '2023-11-05T15:30:00Z',
    diagnosisSummary: 'Severe Osteoarthritis of Left Knee',
    procedureRecommended: 'Total Knee Replacement',
    packageCost: 250000,
    discountValue: 15000,
    discountAllocation: 'NGO',
    ngoId: 'n1',
    fileId: 'FID-501',
    note: 'Priority case'
  },
  {
    id: 'ref-002',
    patientName: 'Priya Verma',
    patientMobile: '9911223344',
    referringDoctorId: 'd1',
    hospitalId: 'h2',
    status: ReferralStatus.CREATED,
    createdAt: '2023-11-10T09:15:00Z',
    updatedAt: '2023-11-10T09:15:00Z',
    fileId: '',
    note: ''
  }
];

export const STATUS_COLORS: Record<ReferralStatus, string> = {
  [ReferralStatus.CREATED]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ReferralStatus.SURGERY_COMPLETED]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [ReferralStatus.MEDICATION_DONE]: 'bg-teal-100 text-teal-700 border-teal-200',
  [ReferralStatus.PACKAGE_DISCUSSED]: 'bg-purple-100 text-purple-700 border-purple-200',
  [ReferralStatus.SURGERY_LOST]: 'bg-rose-100 text-rose-700 border-rose-200',
  [ReferralStatus.NOT_ARRIVED]: 'bg-slate-100 text-slate-700 border-slate-200',
  [ReferralStatus.FOLLOWUP_SURGERY]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  [ReferralStatus.FOLLOWUP]: 'bg-sky-100 text-sky-700 border-sky-200',
  [ReferralStatus.PRE_OPS]: 'bg-amber-100 text-amber-700 border-amber-200',
  [ReferralStatus.RNR]: 'bg-gray-100 text-gray-700 border-gray-200',
};
