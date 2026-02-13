
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
  APPOINTMENT_BOOKED = 'APPOINTMENT_BOOKED',
  CONSULTATION_COMPLETED = 'CONSULTATION_COMPLETED',
  DIAGNOSIS_UPDATED = 'DIAGNOSIS_UPDATED',
  SURGERY_RECOMMENDED = 'SURGERY_RECOMMENDED',
  SURGERY_COMPLETED = 'SURGERY_COMPLETED',
  CASE_CLOSED = 'CASE_CLOSED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
  password?: string;
  organizationId?: string;
  registrationNumber?: string;
  location?: string;
}

export interface Hospital {
  id: string;
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  contactPerson: string;
  phone: string;
  capabilities: string[];
}

export interface Referral {
  id: string;
  patientName: string;
  patientMobile: string;
  referringDoctorId: string;
  hospitalId: string;
  specialistId?: string;
  status: ReferralStatus;
  createdAt: string;
  updatedAt: string;
  diagnosisSummary?: string;
  procedureRecommended?: string;
  surgeryDate?: string;
  packageCost?: number;
  discountValue?: number;
  discountAllocation?: 'PATIENT' | 'NGO' | 'RETAINED';
  ngoId?: string;
}

export interface NGO {
  id: string;
  name: string;
  mission: string;
}
