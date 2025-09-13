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

// ==========================
// Core Models (manual types)
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
// LabTest Type (matches Prisma schema)
// ==========================
export type LabTest = {
  id: number;
  test_date: Date;
  result?: string;
  status: LabTestStatus;
  service_id?: number;
  services?: {
    id: number;
    service_name: string;
  };
  technician?: {
    id: string; // Prisma returns string for user IDs
    name: string;
  } | null;
  units?: string; // optional
  reference_range?: string; // optional
  notes?: string; // optional
  medical_record: {
    id: number;
    patient: Patient;
  };
};

// ==========================
// Inventory
// ==========================
export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  price: number;
  status: Status;
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
