// lib/schema.ts
import { z } from "zod";
import { SPECIALIZATION } from "@/utils/settings";
import { Status } from "@prisma/client";

// ==========================
// Patient Form Schema
// ==========================
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
      message:
        "Both emergency contact name and number must be provided or both left blank.",
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
  status: z
    .enum(["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"])
    .optional(),
  reason: z.string().optional(),
  patient: z
    .object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      phone: z.string(),
      gender: z.enum(["MALE", "FEMALE"]),
      img: z.string().nullable(),
      date_of_birth: z.string(),
      color_code: z.string().nullable(),
    })
    .optional(),
  doctor: z
    .object({
      id: z.string(),
      name: z.string(),
      specialization: z.string(),
      color_code: z.string().nullable(),
      img: z.string().nullable(),
    })
    .optional(),
  has_conflict: z.boolean().optional(), // patient conflict
  doctor_conflict: z.boolean().optional(), // doctor conflict
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
export const WorkingDaySchema = z.object({
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

export const WorkingDaysSchema = z.array(WorkingDaySchema).optional();

// ==========================
// Staff Schema
// ==========================
export const StaffSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),

    role: z.enum(
      ["ADMIN", "MANAGER", "NURSE", "LABORATORY", "RECEPTIONIST", "CASHIER", "PHARMACIST"],
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
    if (
      ["NURSE", "LABORATORY", "PHARMACIST"].includes(data.role) &&
      !data.department
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["department"],
        message: "Department is required for medical staff.",
      });
    }
  });

// ==========================
// Vital Signs Schema (snake_case)
// ==========================
export const VitalSignsSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  body_temperature: z.coerce.number(),
  heart_rate: z.string(),
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
// Billing Form Schema
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
// Pharmacist Schema
// ==========================
export const PharmacistSchema = z.object({
  medication_name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  patient_id: z.string().uuid("Invalid patient ID"),
  prescription_date: z.preprocess(
    (arg) => (typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg),
    z.date({ invalid_type_error: "Invalid date" })
  ),
  pharmacist_notes: z.string().optional(),
});

export type PharmacistFormData = z.infer<typeof PharmacistSchema>;

// ==========================
// Lab Technician Schemas
// ==========================
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
// Nurse Schema
// ==========================
export const NurseSchema = z.object({
  name: z.string().trim().min(2).max(50),
  phone: z.string().min(10).max(10),
  email: z.string().email(),
  address: z.string().min(5).max(500),
  license_number: z.string().min(2),
  department: z.string().min(2),
  type: z.enum(["REGISTERED", "ASSISTANT"]),
  shift: z.enum(["MORNING", "EVENING", "NIGHT"]),
  certifications: z.string().optional(),
  working_days: WorkingDaysSchema,
  img: z.string().optional(),
  password: z.string().min(8).optional().or(z.literal("")),
});

export type NurseFormData = z.infer<typeof NurseSchema>;

// ==========================
// Inventory Schema
// ==========================
export const InventorySchema = z.object({
  name: z.string().min(1),
  category: z.enum(["MEDICATION", "CONSUMABLE", "EQUIPMENT", "OTHER"]),
  description: z.string().optional(),
  quantity: z.preprocess((val) => Number(val), z.number().int().min(0)),
  unit: z.string().min(1),
  reorder_level: z.preprocess((val) => Number(val), z.number().int().min(0).default(10)),
  cost_price: z.preprocess((val) => Number(val), z.number().min(0)),
  selling_price: z
    .preprocess((val) => (val === "" || val === null ? undefined : Number(val)), z.number().min(0).optional()),
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
// Audit Log Schema
// ==========================
export const AuditLogSchema = z.object({
  id: z.number().optional(),
  user_id: z.string(),
  record_id: z.string(),
  action: z.string(),
  details: z.string().nullable().optional(),
  model: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type AuditLogInput = z.infer<typeof AuditLogSchema>;

// ==========================
// Medication Administration
// ==========================
export const MedicationAdministrationSchema = z.object({
  patient_id: z.string().uuid(),
  staff_id: z.string().uuid(),
  doctor_id: z.string().uuid().optional(),
  medication: z.string().min(1),
  dosage: z.string().min(1),
  administered_at: z.coerce.date(),
  notes: z.string().optional(),
});

export type MedicationAdministrationInput = z.infer<typeof MedicationAdministrationSchema>;

// ==========================
// Enums
// ==========================
export const ShiftTypeEnum = z.enum(["MORNING", "AFTERNOON", "NIGHT"]);
export const LeaveStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);
export const EventTypeEnum = z.enum(["MEETING", "TRAINING", "HOLIDAY", "ANNOUNCEMENT", "OTHER"]);
export const EventStatusEnum = z.enum(["CONFIRMED", "CANCELLED", "DRAFT"]);
export const StatusEnum = z.enum(["ACTIVE", "INACTIVE", "DORMANT"]);

// ==========================
// Shift Schema
// ==========================
export const ShiftSchema = z
  .object({
    id: z.number().optional(),
    name: z.string(),
    type: ShiftTypeEnum,
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    notes: z.string().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  })
  .refine((data) => data.end_time > data.start_time, {
    message: "Shift endTime must be after startTime",
    path: ["endTime"],
  });

// ==========================
// Roster Schema (with DateTime start/end times & overnight handling)
// ==========================
export const RosterSchema = z
  .object({
    id: z.number().optional(),
    shift_id: z.number(),
    staff_id: z.string().nullable().optional(),
    doctor_id: z.string().nullable().optional(),
    date: z.coerce.date(),
    status: z.nativeEnum(Status).optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),

    // Roster-specific times
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),

    working_days: z
      .array(
        z.object({
          day: z.enum([
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ]),
          start_time: z.string(), // format "HH:mm"
          close_time: z.string(), // format "HH:mm"
        })
      )
      .optional(),
  })
  // Must have either staff_id or doctor_id
  .refine((data) => data.staff_id || data.doctor_id, {
    message: "Roster must have either a staff_id or doctor_id",
    path: ["staff_id"],
  })
  // Cannot have both staff_id and doctor_id
  .refine((data) => !(data.staff_id && data.doctor_id), {
    message: "Roster cannot have both staff_id and doctor_id",
    path: ["staff_id"],
  })
  // Roster date cannot be in the past
  .refine((data) => data.date >= new Date(), {
    message: "Roster date cannot be in the past",
    path: ["date"],
  })
  // Doctor must work on that day
  .refine(
    (data) => {
      if (!data.doctor_id || !data.working_days) return true;

      const dayName = data.date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      return data.working_days.some((wd) => wd.day.toLowerCase() === dayName);
    },
    {
      message: "Roster date is not within the doctor’s working days",
      path: ["date"],
    }
  )
  // End time must be after start time (handle overnight)
  .refine(
    (data) => {
      if (!data.start_time || !data.end_time) return true;

      const start = new Date(data.start_time);
      let end = new Date(data.end_time);
      // Overnight adjustment
      if (end <= start) end.setDate(end.getDate() + 1);

      return end > start;
    },
    {
      message: "Roster end_time must be after start_time",
      path: ["end_time"],
    }
  );

// ==========================
// Leave Type & Requests
// ==========================
export const LeaveTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  description: z.string().optional(),
  max_days: z.number().nullable().optional(),
});

export const LeaveRequestSchema = z
  .object({
    id: z.number().optional(),
    staff_id: z.string(),
    type_id: z.number(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    reason: z.string().optional(),
    status: LeaveStatusEnum.optional(),
    duration: z.number().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "End date must be the same or after start date",
    path: ["end_date"],
  });

export const ApprovalSchema = z.object({
  id: z.number().optional(),
  leave_id: z.number(),
  approver_id: z.string(),
  decision: LeaveStatusEnum,
  comments: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// ==========================
// Events & Announcements
// ==========================

export const AdminOrManagerRoles = ["ADMIN", "MANAGER"] as const;
export type AdminOrManagerRole = (typeof AdminOrManagerRoles)[number];

// Event Schema
export const EventSchema = z
  .object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string().nullable().optional(),
    type: EventTypeEnum,
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    location: z.string().nullable().optional(),
    status: EventStatusEnum.default("CONFIRMED"),
    created_by_id: z.string(),
    created_by_role: z.enum(AdminOrManagerRoles), // ✅ strictly ADMIN | MANAGER
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    rsvpCount: z.number().int().optional(),
    attending: z.number().int().optional(),
    declined: z.number().int().optional(),
    myRsvp: z
      .object({
        event_id: z.number(),
        staff_id: z.string(),
        response: z.boolean(),
        id: z.number().optional(),
        created_at: z.date().optional(),
        updated_at: z.date().optional(),
      })
      .optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "Event end-date must be after start-date",
    path: ["end_date"],
  });

// Announcement Schema
export const AnnouncementSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  message: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"), // ✅ added
  published_at: z.date().optional(),
  created_by_id: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// RSVP Schema
export const RSVPSchema = z.object({
  id: z.number().optional(),
  event_id: z.number(),
  staff_id: z.string(),
  response: z.boolean(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

// ==========================
// TypeScript Exports
// ==========================
export type ShiftInput = z.infer<typeof ShiftSchema>;
export type RosterInput = z.infer<typeof RosterSchema>;
export type LeaveTypeInput = z.infer<typeof LeaveTypeSchema>;
export type LeaveRequestInput = z.infer<typeof LeaveRequestSchema>;
export type ApprovalInput = z.infer<typeof ApprovalSchema>;
export type EventInput = z.infer<typeof EventSchema>;
export type AnnouncementInput = z.infer<typeof AnnouncementSchema>;
export type RSVPInput = z.infer<typeof RSVPSchema>;
