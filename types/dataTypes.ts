// types/dataTypes.ts
// ==========================
// Import Prisma Enums
// ==========================
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

// Re-export enums
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
  gender: Gender;
  img?: string;
  colorCode?: string;
  date_of_birth?: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  img?: string;
  colorCode?: string;
}

export interface Appointment {
  id: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  status: AppointmentStatus;
  type?: string;
  reason?: string | null;
  updated_at?: Date;
}

export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// ==========================
// Relations / Extended Types
// ==========================
export type AppointmentWithRelations = Appointment & {
  patient: Patient;
  doctor: Doctor;
};

export type RatingWithPatient = Rating & {
  patient: Pick<Patient, "id" | "first_name" | "last_name">;
};

// ==========================
// LabTest
// ==========================
export type LabTest = {
  id: number;
  test_date: Date;
  result?: string;
  status: LabTestStatus;
  service_id?: number;
  services?: { id: number; service_name: string };
  technician?: { id: string; name: string } | null;
  units?: string;
  reference_range?: string;
  notes?: string;
  medical_record: { id: number; patient: Patient };
};

// ==========================
// Inventory
// ==========================
export type InventoryItem = {
  id: number;
  name: string;
  category: InventoryCategory;
  description?: string | null;
  quantity: number;
  unit: string;
  reorder_level: number;
  cost_price: number;
  selling_price: number;
  price: number; // mapped from selling_price
  batch_number?: string;
  expiry_date?: Date | null;
  supplier?: string;
  last_restocked: Date;
  status: Status;
  created_at: Date;
  updated_at: Date;
};

// ==========================
// Dashboard Types
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
  time: string;
  patient: DashboardPatient;
  doctor: DashboardDoctor;
};

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

export type AppointmentsChartProps = {
  name: string;
  appointment: number;
  completed: number;
}[];

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
  availableDoctor: AvailableDoctorProps;
  monthlyData: AppointmentsChartProps;
}

// ==========================
// Nurse Types
// ==========================
export interface MedicationAdministration {
  id: string;
  patientId: string;
  nurseId: string;
  medication: string;
  dosage: string;
  administeredAt: Date;
  notes?: string;
}
