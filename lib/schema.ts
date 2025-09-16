// lib/schema.ts
import { z } from "zod";
import { SPECIALIZATION } from "@/utils/settings";

export const PatientFormSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name can't be more than 50 characters"),

    last_name: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(30, "Last name can't be more than 50 characters"),

    date_of_birth: z.coerce.date(),

    gender: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),

    phone: z
      .string()
      .min(10, "Enter 10-digit phone number")
      .max(10, "Enter 10-digit phone number"),

    email: z.string().email("Invalid email address.").optional().or(z.literal("")),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address must be at most 500 characters"),

    marital_status: z.enum(
      ["married", "single", "divorced", "widowed", "separated"],
      { message: "Marital status is required." }
    ),

    emergency_contact_name: z
      .string()
      .max(50, "Emergency contact must be at most 50 characters")
      .optional()
      .or(z.literal("")),

    emergency_contact_number: z
      .string()
      .max(10, "Enter 10-digit phone number")
      .optional()
      .or(z.literal("")),

    relation: z
      .enum(["mother", "father", "husband", "wife", "other"])
      .optional()
      .default("other"),

    blood_group: z.string().optional(),
    allergies: z.string().optional(),
    medical_conditions: z.string().optional(),
    medical_history: z.string().optional(),
    insurance_provider: z.string().optional(),
    insurance_number: z.string().optional(),

    privacy_consent: z
      .boolean()
      .default(false)
      .refine((val) => val === true, {
        message: "You must agree to the privacy policy.",
      }),

    service_consent: z
      .boolean()
      .default(false)
      .refine((val) => val === true, {
        message: "You must agree to the terms of service.",
      }),

    medical_consent: z
      .boolean()
      .default(false)
      .refine((val) => val === true, {
        message: "You must agree to the medical treatment terms.",
      }),

    img: z.string().optional(),
  })
  .refine(
    (data) =>
      (!data.emergency_contact_name && !data.emergency_contact_number) ||
      (data.emergency_contact_name && data.emergency_contact_number),
    {
      message: "Both emergency contact name and number must be provided or both left blank.",
      path: ["emergency_contact_name"],
    }
  );

export type PatientFormData = z.infer<typeof PatientFormSchema>;

// ==========================
// Appointment Form Schema
// ==========================
export const AppointmentSchema = z.object({
  id: z.number().optional(),
  doctor_id: z.string().min(1, "Select physician"),
  patient_id: z.string().min(1, "Select patient"),  
  type: z.string().min(1, "Select type of appointment"),
  appointment_date: z.string().min(1, "Select appointment date"),
  time: z.string().min(1, "Select appointment time"),
  note: z.string().optional(),
  status: z.enum(["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"]).optional(),
  reason: z.string().optional(),
  patient: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    phone: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
    img: z.string().nullable(),
    date_of_birth: z.string(),
    colorCode: z.string().nullable(),
  }).optional(),
  doctor: z.object({
    id: z.string(),
    name: z.string(),
    specialization: z.string(),
    colorCode: z.string().nullable(),
    img: z.string().nullable(),
  }).optional(),
  hasConflict: z.boolean().optional(), // patient conflict
  doctorConflict: z.boolean().optional(), // doctor conflict
});

// ==========================
// Doctor Registration Schema
// ==========================
export const DoctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  phone: z.string().min(10, "Enter phone number").max(10, "Enter phone number"),
  email: z.string().email("Invalid email address."),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),
  specialization: z.string().min(2, "Specialization is required."),
  license_number: z.string().min(2, "License number is required"),
  type: z.enum(["FULL", "PART"], { message: "Type is required." }),
  department: z.string().min(2, "Department is required."),
  img: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
});

// ==========================
// Working Days Schema
// ==========================
export const workingDaySchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  start_time: z.string(),
  close_time: z.string(),
});

export const WorkingDaysSchema = z.array(workingDaySchema).optional();

// ==========================
// Staff Schema
// ==========================
export const StaffSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  role: z.enum(
    ["NURSE", "LABORATORY", "RECEPTIONIST", "CASHIER", "PHARMACIST"],
    { message: "Role is required." }
  ),

  phone: z
    .string()
    .min(10, "Contact must be 10-digits")
    .max(10, "Contact must be 10-digits"),

  email: z.string().email("Invalid email address."),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),

  license_number: z.string().optional(),

  // ✅ Conditional validation
  department: z
    .string()
    .optional()
    .refine(
      (val) => !val || SPECIALIZATION.map((s) => s.value).includes(val),
      { message: "Invalid specialization selected." }
    ),

  img: z.string().optional(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
})
.superRefine((data, ctx) => {
  // If role requires department but none provided
  if (["NURSE", "LABORATORY", "PHARMACIST"].includes(data.role) && !data.department) {
    ctx.addIssue({
      code: "custom",
      path: ["department"],
      message: "Department is required for medical staff.",
    });
  }
});

// ==========================
// Vital Signs Schema
// ==========================
export const VitalSignsSchema = z.object({
  patient_id: z.string(),      // keep as string for validation/input
  medical_id: z.string(),      // keep as string
  body_temperature: z.coerce.number(),
  heartRate: z.string(),
  systolic: z.coerce.number(),
  diastolic: z.coerce.number(),
  respiratory_rate: z.coerce.number().optional(),
  oxygen_saturation: z.coerce.number().optional(),
  weight: z.coerce.number(),
  height: z.coerce.number(),
});

// ==========================
// Diagnosis Schema
// ==========================
export const DiagnosisSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  doctor_id: z.string(),
  symptoms: z.string({ message: "Symptoms required" }),
  diagnosis: z.string({ message: "Diagnosis required" }),
  notes: z.string().optional(),
  prescribed_medications: z.string().optional(),
  follow_up_plan: z.string().optional(),
});

// ==========================
// Payment Schema
// ==========================
export const PaymentSchema = z.object({
  id: z.string(),
  bill_date: z.coerce.date(),
  discount: z.string({ message: "discount" }),
  total_amount: z.string(),
});

// ==========================
// Patient Billing Schema
// ==========================
export const PatientBillSchema = z.object({
  bill_id: z.string(),
  service_id: z.string(),
  service_date: z.string(),
  appointment_id: z.string(),
  quantity: z.string({ message: "Quantity is required" }),
  unit_cost: z.string({ message: "Unit cost is required" }),
  total_cost: z.string({ message: "Total cost is required" }),
});

// ==========================
// Services Schema
// ==========================
export const ServicesSchema = z.object({
  service_name: z.string({ message: "Service name is required" }).min(1),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be greater than 0" }),
  description: z.string({ message: "Service description is required" }).min(1),
});

// ==========================
// Cashier Billing Form Schema
// ==========================
export const BillingFormSchema = z.object({
  patient_id: z.string().min(1, "Patient ID is required."),
  patient_name: z.string().min(2, "Patient name is required."),
  service: z.string().min(3, "Service details are required."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  payment_method: z.enum(["CASH", "CARD", "INSURANCE"], {
    message: "Select payment method.",
  }),
  notes: z.string().optional(),
});

// ==========================
// Pharmacist Form Schema
// ==========================
export const PharmacistSchema = z.object({
  medication_name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  patient_id: z.string().uuid("Invalid patient ID"),
  prescription_date: z.preprocess(
    (arg) => {
      if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
      return arg;
    },
    z.date({ invalid_type_error: "Invalid date" })
  ),
  pharmacist_notes: z.string().optional(),
});

export type PharmacistFormData = z.infer<typeof PharmacistSchema>;

// ==========================
// Lab Technician Schemas
// ==========================

// For creating (needs patient_id to find/attach medical record)
export const CreateLabTestSchema = z.object({
  patient_id: z.string().min(1, "Patient ID is required"),
  service_id: z.string().min(1, "Service is required"),
  test_date: z.coerce.date(),
  result: z.string().min(1, "Test result is required"),
  units: z.string().nullable().optional(),
  reference_range: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  technician_id: z.string().min(1, "Technician ID is required"),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export type CreateLabTestInput = z.infer<typeof CreateLabTestSchema>;

// For updating (no patient_id, because LabTest links to MedicalRecords)
export const UpdateLabTestSchema = z.object({
  service_id: z.string().optional(),
  test_date: z.coerce.date().optional(),
  result: z.string().optional(),
  units: z.string().nullable().optional(),
  reference_range: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  technician_id: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
});

export type UpdateLabTestInput = z.infer<typeof UpdateLabTestSchema>;

// ==========================
// Nurse Registration Schema
// ==========================
export const NurseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),

  phone: z
    .string()
    .min(10, "Enter phone number")
    .max(10, "Enter phone number"),

  email: z.string().email("Invalid email address."),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),

  license_number: z.string().min(2, "License number is required"),

  department: z.string().min(2, "Department is required."),

  type: z.enum(["REGISTERED", "ASSISTANT"], { message: "Type is required." }),

  shift: z.enum(["MORNING", "EVENING", "NIGHT"], {
    message: "Select working shift.",
  }),

  certifications: z.string().optional(),

  working_days: WorkingDaysSchema,

  img: z.string().optional(),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
});

export type NurseFormData = z.infer<typeof NurseSchema>;

// ==========================
// Inventory Schema
// ==========================
export const InventorySchema = z.object({
  name: z.string().min(1, "Item name is required"),
  category: z.enum(["MEDICATION", "CONSUMABLE", "EQUIPMENT", "OTHER"]),
  description: z.string().optional(),

  // Convert string inputs to numbers
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "Quantity cannot be negative")
  ),
  unit: z.string().min(1, "Unit is required"),
  reorder_level: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0).default(10)
  ),
  cost_price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Cost price cannot be negative")
  ),
  selling_price: z.preprocess(
    (val) => (val === "" || val === null ? undefined : Number(val)),
    z.number().min(0, "Selling price cannot be negative").optional()
  ),

  batch_number: z.string().optional(),

  expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD")
    .optional()
    .nullable(),
  last_restocked: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD")
    .optional()
    .nullable(),

  supplier: z.string().optional(),
});

export type InventorySchemaType = z.infer<typeof InventorySchema>;

// ==========================
// Input type for creating a log
// ==========================
export const AuditLogSchema = z.object({
  id: z.number().optional(), // Prisma autoincrements
  user_id: z.string(),
  record_id: z.string(),
  action: z.string(),
  details: z.string().nullable().optional(),
  model: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// TypeScript type inferred from Zod schema
export type AuditLogInput = z.infer<typeof AuditLogSchema>;

// ===================================
// Schema for Medication Administration
// ===================================
export const MedicationAdministrationSchema = z.object({
  patientId: z.string().uuid({ message: "Invalid patient ID" }),
  nurseId: z.string().uuid({ message: "Invalid nurse ID" }),
  medication: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  administeredAt: z.coerce.date(),
  notes: z.string().optional(),
});

export type MedicationAdministrationInput = z.infer<
  typeof MedicationAdministrationSchema
>;
