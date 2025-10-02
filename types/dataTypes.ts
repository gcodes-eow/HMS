// types/dataTypes.ts
import {
  AppointmentStatus,
  Status,
  Gender,
  Role,
  JOBTYPE,
  PaymentMethod,
  PaymentStatus,
  InventoryCategory,
  LabTestStatus,
} from "@prisma/client";

export {
  AppointmentStatus,
  Status,
  Gender,
  Role,
  JOBTYPE,
  PaymentMethod,
  PaymentStatus,
  InventoryCategory,
  LabTestStatus,
};

// ==========================
// Core Models
// ==========================
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: Gender;
  phone: string;
  email?: string;
  marital_status: string;
  address: string;
  emergency_contact_name?: string | null;
  emergency_contact_number?: string | null;
  relation?: string | null;
  blood_group?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  medical_history?: string | null;
  insurance_provider?: string | null;
  insurance_number?: string | null;
  privacy_consent: boolean;
  service_consent: boolean;
  medical_consent: boolean;
  img?: string | null;
  colorCode?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Doctor {
  id: string;
  email: string;
  name: string;
  specialization: string;
  license_number: string;
  phone: string;
  address: string;
  department?: string | null; // <-- allow null
  img?: string | null;         // <-- allow null
  colorCode?: string | null;   // <-- allow null
  availability_status: Status;
  type: JOBTYPE;
  created_at: Date;
  updated_at: Date;
}

export interface Appointment {
  id: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  time: string;
  status: AppointmentStatus;
  type?: string;
  reason?: string | null;
  note?: string | null;
  updated_at?: Date;
}

// ==========================
// Relations / Extended Types
// ==========================
export type AppointmentWithRelations = Appointment & {
  patient: Patient;
  doctor: Doctor;
  hasConflict?: boolean;
  doctorConflict?: boolean;
};

export type RatingWithPatient = {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  patient: Pick<Patient, "id" | "first_name" | "last_name">;
};

// ==========================
// Dashboard / UI Types
// ==========================
export type DashboardPatient = Pick<
  Patient,
  "id" | "first_name" | "last_name" | "gender" | "img" | "colorCode"
>;

export type DashboardDoctor = Pick<
  Doctor,
  "id" | "name" | "specialization" | "img" | "colorCode"
>;

export type DashboardAppointment = Appointment & {
  patient: DashboardPatient;
  doctor: DashboardDoctor;
  type?: string;
};

// ==========================
// Available Doctors Props
// ==========================
export type AvailableDoctorProps = {
  id: string;
  name: string;
  specialization: string;
  img?: string;
  colorCode?: string;
  working_days: {
    day: string;
    start_time: string;
    close_time: string;
  }[];
}[];

// ==========================
// Appointments Chart Props
// ==========================
export type AppointmentsChartProps = {
  name: string;
  appointment: number;
  completed: number;
}[];

// ==========================
// FullPatientData / PatientDashboardData
// ==========================
export interface FullPatientData extends Patient {
  appointmentCounts: Record<AppointmentStatus | "TODAY", number>;
  last5Records: DashboardAppointment[];
  totalAppointments: number;
  availableDoctors: AvailableDoctorProps;
  monthlyData: AppointmentsChartProps;
  lastVisit?: Date;
}

export interface PatientDashboardData {
  id: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  img?: string;
  colorCode?: string;
  appointmentCounts: Record<AppointmentStatus | "TODAY", number>;
  last5Records: DashboardAppointment[];
  totalAppointments: number;
  availableDoctors: AvailableDoctorProps;
  monthlyData: AppointmentsChartProps;
}

// ==========================
// Lab Tests
// ==========================
export interface LabTest {
  id: string;
  patient_id: string;
  technician_id?: string | null;
  service_id: string;
  status: LabTestStatus;
  result?: string | null;
  notes?: string | null;
  created_at: Date;
  updated_at: Date;

  // Relations (optional, depending on what you query)
  patient?: DashboardPatient;
  technician?: DashboardDoctor;
  service?: { id: string; service_name: string };
}

// ==========================
// Medication Administration
// ==========================
export interface MedicationAdministration {
  id: string;
  patientId: string;
  staffId: string;
  doctorId?: string;
  patientName: string;
  staffName: string;
  staffRole: string;
  medication: string;
  dosage: string;
  administeredAt: Date;
  notes?: string;
}

// ==========================
// Generic Service Response
// ==========================
export interface ServiceResponse<T> {
  success: boolean;
  error: boolean;
  status: number;
  message?: string;
  data?: T | null;
  totalRecords?: number;
}

// ==========================
// Generic Paginated Response
// ==========================
export interface PaginatedResponse<T> extends ServiceResponse<T[]> {
  totalPages: number;
  currentPage: number;
  limit: number;
}
