// app/actions/auditLogs.ts
import db from "@/lib/db";
import { logAction } from "@/utils/auditLogs";
import { AppointmentStatus, PaymentStatus, LabTestStatus } from "@prisma/client";

/**
 * ============================
 * PATIENT ACTIONS
 * ============================
 */
export async function updatePatientName(patientId: string, newName: string, userId: string) {
  const updated = await db.patient.update({
    where: { id: patientId },
    data: { first_name: newName },
  });

  await logAction({
    user_id: userId,
    record_id: patientId,
    action: "UPDATE_PATIENT_NAME",
    details: `Changed first name to "${newName}"`,
    model: "Patient",
  });

  return updated;
}

export async function updatePatientLastName(patientId: string, newLastName: string, userId: string) {
  const updated = await db.patient.update({
    where: { id: patientId },
    data: { last_name: newLastName },
  });

  await logAction({
    user_id: userId,
    record_id: patientId,
    action: "UPDATE_PATIENT_LAST_NAME",
    details: `Changed last name to "${newLastName}"`,
    model: "Patient",
  });

  return updated;
}

export async function deletePatient(patientId: string, userId: string) {
  const deleted = await db.patient.delete({ where: { id: patientId } });

  await logAction({
    user_id: userId,
    record_id: patientId,
    action: "DELETE_PATIENT",
    details: "Deleted patient record",
    model: "Patient",
  });

  return deleted;
}

/**
 * ============================
 * DOCTOR ACTIONS
 * ============================
 */
export async function updateDoctorSpecialization(doctorId: string, newSpecialization: string, userId: string) {
  const updated = await db.doctor.update({
    where: { id: doctorId },
    data: { specialization: newSpecialization },
  });

  await logAction({
    user_id: userId,
    record_id: doctorId,
    action: "UPDATE_DOCTOR_SPECIALIZATION",
    details: `Changed specialization to "${newSpecialization}"`,
    model: "Doctor",
  });

  return updated;
}

export async function deleteDoctor(doctorId: string, userId: string) {
  const deleted = await db.doctor.delete({ where: { id: doctorId } });

  await logAction({
    user_id: userId,
    record_id: doctorId,
    action: "DELETE_DOCTOR",
    details: "Deleted doctor record",
    model: "Doctor",
  });

  return deleted;
}

/**
 * ============================
 * APPOINTMENT ACTIONS
 * ============================
 */
export async function updateAppointmentStatus(appointmentId: number, status: AppointmentStatus, userId: string) {
  const updated = await db.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });

  await logAction({
    user_id: userId,
    record_id: appointmentId.toString(),
    action: "UPDATE_APPOINTMENT_STATUS",
    details: `Changed appointment status to "${status}"`,
    model: "Appointment",
  });

  return updated;
}

export async function deleteAppointment(appointmentId: number, userId: string) {
  const deleted = await db.appointment.delete({ where: { id: appointmentId } });

  await logAction({
    user_id: userId,
    record_id: appointmentId.toString(),
    action: "DELETE_APPOINTMENT",
    details: "Deleted appointment record",
    model: "Appointment",
  });

  return deleted;
}

/**
 * ============================
 * PAYMENT ACTIONS
 * ============================
 */
export async function updatePaymentStatus(paymentId: number, status: PaymentStatus, userId: string) {
  const updated = await db.payment.update({
    where: { id: paymentId },
    data: { status },
  });

  await logAction({
    user_id: userId,
    record_id: paymentId.toString(),
    action: "UPDATE_PAYMENT_STATUS",
    details: `Changed payment status to "${status}"`,
    model: "Payment",
  });

  return updated;
}

/**
 * ============================
 * LAB TEST ACTIONS
 * ============================
 */
export async function updateLabTestStatus(labTestId: number, status: LabTestStatus, userId: string) {
  const updated = await db.labTest.update({
    where: { id: labTestId },
    data: { status },
  });

  await logAction({
    user_id: userId,
    record_id: labTestId.toString(),
    action: "UPDATE_LABTEST_STATUS",
    details: `Changed lab test status to "${status}"`,
    model: "LabTest",
  });

  return updated;
}

/**
 * ============================
 * MEDICAL RECORDS ACTIONS
 * ============================
 */
export async function updateMedicalRecordNotes(medicalId: number, notes: string, userId: string) {
  const updated = await db.medicalRecords.update({
    where: { id: medicalId },
    data: { notes },
  });

  await logAction({
    user_id: userId,
    record_id: medicalId.toString(),
    action: "UPDATE_MEDICAL_RECORD_NOTES",
    details: "Updated medical record notes",
    model: "MedicalRecords",
  });

  return updated;
}

/**
 * ============================
 * INVENTORY ACTIONS
 * ============================
 */
export async function updateInventoryQuantity(inventoryId: number, quantity: number, userId: string) {
  const updated = await db.inventory.update({
    where: { id: inventoryId },
    data: { quantity },
  });

  await logAction({
    user_id: userId,
    record_id: inventoryId.toString(),
    action: "UPDATE_INVENTORY_QUANTITY",
    details: `Updated inventory quantity to ${quantity}`,
    model: "Inventory",
  });

  return updated;
}

/**
 * ============================
 * PHARMACIST RECORD ACTIONS
 * ============================
 */
export async function addPharmacistRecord(
  record: {
    medication_name: string;
    dosage: string;
    quantity: number;
    patient_id: string;
    prescription_date: Date;
    pharmacist_notes?: string;
    inventory_item_id?: number;
  },
  userId: string
) {
  const created = await db.pharmacistRecord.create({ data: record });

  await logAction({
    user_id: userId,
    record_id: created.id.toString(),
    action: "ADD_PHARMACIST_RECORD",
    details: `Added new pharmacist record for ${record.patient_id}`,
    model: "PharmacistRecord",
  });

  return created;
}

/**
 * ============================
 * GENERIC LOGGING
 * ============================
 */
export async function logModelAction(params: {
  userId: string;
  recordId: string;
  action: string;
  details?: string;
  model: string;
}) {
  await logAction({
    user_id: params.userId,
    record_id: params.recordId,
    action: params.action,
    details: params.details,
    model: params.model,
  });
}
