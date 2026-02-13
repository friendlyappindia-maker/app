
export enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN = 'ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  HOSPITAL_COORDINATOR = 'HOSPITAL_COORDINATOR',
  REFERRING_DOCTOR = 'REFERRING_DOCTOR',
  NGO_ADMIN = 'NGO_ADMIN'
}

export enum ReferralStatus {
  CREATED = 'CREATED',
  SURGERY_COMPLETED = 'SURGERY_COMPLETED',
  MEDICATION_DONE = 'MEDICATION_DONE',
  PACKAGE_DISCUSSED = 'PACKAGE_DISCUSSED',
  SURGERY_LOST = 'SURGERY_LOST',
  NOT_ARRIVED = 'NOT_ARRIVED',
  FOLLOWUP_SURGERY = 'FOLLOWUP_SURGERY',
  FOLLOWUP = 'FOLLOWUP',
  PRE_OPS = 'PRE_OPS',
  RNR = 'RNR',
  // Deprecated but kept for backward compatibility with initial mocks
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED'
}

export interface User {
  id: string; // UUID in DB
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  username?: string;
  password?: string;
  organizationId?: string; // UUID of Hospital
  registrationNumber?: string;
  location?: string;
}

export interface Hospital {
  id: string; // UUID in DB
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  contactPerson: string;
  phone: string;
  capabilities: string[];
}

export interface Referral {
  id: string; // UUID in DB
  patientName: string;
  patientMobile: string;
  referringDoctorId: string; // UUID of Profile
  hospitalId: string; // UUID of Hospital
  specialistId?: string; // UUID of Profile
  status: ReferralStatus;
  createdAt: string;
  updatedAt: string;
  fileId?: string;
  note?: string;
  diagnosisSummary?: string;
  procedureRecommended?: string;
  surgeryDate?: string;
  packageCost?: number;
  discountValue?: number;
  discountAllocation?: 'PATIENT' | 'NGO' | 'RETAINED';
  ngoId?: string; // UUID of NGO
}

export interface NGO {
  id: string; // UUID in DB
  name: string;
  mission: string;
}
