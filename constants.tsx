
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
    role: UserRole.REFERRING_DOCTOR,
    registrationNumber: 'REG-12345',
    location: 'Andheri West, Mumbai'
  },
  {
    id: 'd2',
    name: 'Dr. Anita Desai',
    email: 'anita.d@med.com',
    role: UserRole.REFERRING_DOCTOR,
    registrationNumber: 'REG-54321',
    location: 'Kothrud, Pune'
  }
];

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
    ngoId: 'n1'
  },
  {
    id: 'ref-002',
    patientName: 'Priya Verma',
    patientMobile: '9911223344',
    referringDoctorId: 'd1',
    hospitalId: 'h2',
    status: ReferralStatus.APPOINTMENT_BOOKED,
    createdAt: '2023-11-10T09:15:00Z',
    updatedAt: '2023-11-10T09:15:00Z'
  }
];

export const STATUS_COLORS: Record<ReferralStatus, string> = {
  [ReferralStatus.CREATED]: 'bg-blue-100 text-blue-700 border-blue-200',
  [ReferralStatus.APPOINTMENT_BOOKED]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  [ReferralStatus.CONSULTATION_COMPLETED]: 'bg-purple-100 text-purple-700 border-purple-200',
  [ReferralStatus.DIAGNOSIS_UPDATED]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [ReferralStatus.SURGERY_RECOMMENDED]: 'bg-orange-100 text-orange-700 border-orange-200',
  [ReferralStatus.SURGERY_COMPLETED]: 'bg-green-100 text-green-700 border-green-200',
  [ReferralStatus.CASE_CLOSED]: 'bg-slate-100 text-slate-700 border-slate-200'
};
