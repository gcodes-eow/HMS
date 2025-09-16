// lib/index.ts
export const GENDER = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export const MARITAL_STATUS = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
  { label: "Separated", value: "separated" },
];

export const RELATION = [
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "husband", label: "Husband" },
  { value: "wife", label: "Wife" },
  { value: "other", label: "Other" },
];

export const USER_ROLES = {
  ADMIN: "ADMIN" as string,
  DOCTOR: "DOCTOR",
  NURSE: "NURSE",
  LABORATORY: "LABORATORY",
  RECEPTIONIST: "RECEPTIONIST",
  PHARMACIST: "PHARMACIST",
  PATIENT: "PATIENT",
  CASHIER: "CASHIER",
};
