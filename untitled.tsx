
/**
 * SUPABASE SQL SCHEMA (v1.0)
 * 
 * Instructions:
 * 1. Open your Supabase Dashboard -> SQL Editor.
 * 2. Click "New Query" and paste this entire script.
 * 3. Click "Run".
 * 
 * DESIGN SPECIFICATION:
 * - Automatic Sync: Triggers handle data flow from auth.users to public.profiles.
 * - RBAC: Roles (Doctor, Hospital Admin, Master Admin) are enforced via RLS.
 * - Workflow: Tracks referrals from creation to surgery completion.
 */

export const SUPABASE_SQL_SCHEMA = `
-- ==========================================
-- 1. EXTENSIONS & CUSTOM TYPES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define the stages of a surgical referral
CREATE TYPE public.referral_status AS ENUM (
  'CREATED',
  'SURGERY_COMPLETED',
  'MEDICATION_DONE',
  'PACKAGE_DISCUSSED',
  'SURGERY_LOST',
  'NOT_ARRIVED',
  'FOLLOWUP_SURGERY',
  'FOLLOWUP',
  'PRE_OPS',
  'RNR'
);

-- Define user authorization roles
CREATE TYPE public.user_role AS ENUM (
  'MASTER_ADMIN',
  'HOSPITAL_ADMIN',
  'REFERRING_DOCTOR',
  'NGO_ADMIN'
);

-- ==========================================
-- 2. TABLES
-- ==========================================

-- Registered Hospitals
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Extended User Profiles (Links to Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'REFERRING_DOCTOR',
  organization_id UUID REFERENCES public.hospitals(id), -- Null for independent doctors
  registration_number TEXT,
  location TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Referral Tracking
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id TEXT, -- Hospital internal tracking number
  patient_name TEXT NOT NULL,
  patient_mobile TEXT NOT NULL,
  referring_doctor_id UUID NOT NULL REFERENCES public.profiles(id),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id),
  status public.referral_status NOT NULL DEFAULT 'CREATED',
  note TEXT, -- Medical/Operational remarks
  diagnosis_summary TEXT,
  procedure_recommended TEXT,
  package_cost DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 3. AUTOMATION (TRIGGERS)
-- ==========================================

-- TRIGGER: Automatic Profile Creation
-- When a user is created in Auth, this function extracts metadata and creates a public profile.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    username, 
    role, 
    organization_id, 
    phone,
    registration_number,
    location
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unnamed User'), 
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'REFERRING_DOCTOR'),
    (new.raw_user_meta_data->>'organization_id')::uuid,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'registration_number',
    new.raw_user_meta_data->>'location'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- TRIGGER: Auto-update timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referrals_timestamp
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ==========================================
-- 4. SECURITY (RLS POLICIES)
-- ==========================================
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- HOSPITALS: Viewable by all logged-in users
CREATE POLICY "View Hospitals" ON public.hospitals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Manage Hospitals" ON public.hospitals FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'MASTER_ADMIN'));

-- PROFILES: Users can see their own data
CREATE POLICY "Self View" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

-- REFERRALS: Multi-level Access
-- 1. Master Admin sees everything
CREATE POLICY "Master Admin Access" ON public.referrals FOR ALL TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'MASTER_ADMIN'));

-- 2. Referring Doctors see only THEIR patients
CREATE POLICY "Doctor Access" ON public.referrals FOR ALL TO authenticated 
  USING (referring_doctor_id = auth.uid());

-- 3. Hospital Admins see and update patients sent to THEIR hospital
CREATE POLICY "Hospital View" ON public.referrals FOR SELECT TO authenticated 
  USING (hospital_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Hospital Update" ON public.referrals FOR UPDATE TO authenticated 
  USING (hospital_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()))
  WITH CHECK (hospital_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
`;
