
export enum UserRole {
  MASTER_ADMIN = 'MASTER_ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
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
  RNR = 'RNR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
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
  images?: string[]; // New field for hospital profile images
}

export interface Referral {
  id: string;
  fileId?: string;
  patientName: string;
  patientMobile: string;
  referringDoctorId: string;
  hospitalId: string;
  status: ReferralStatus;
  note?: string;
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
