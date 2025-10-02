import {
  PrismaClient,
  Status,
  JOBTYPE,
  Role,
  ShiftType,
  Gender,
  AppointmentStatus,
  PaymentMethod,
  PaymentStatus,
  InventoryCategory,
  LabTestStatus,
  LeaveStatus,
  EventType,
  EventStatus,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// 🔹 Ensure UTF-8 safe values
function sanitize(str: string): string {
  return str.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
}

async function main() {
  console.log("🌱 Seeding database...");

  // ==========================
  // Seed Services
  // ==========================
  const serviceList = [
    { name: "General Consultation", price: 50 },
    { name: "Blood Test", price: 30 },
    { name: "X-Ray", price: 75 },
    { name: "MRI Scan", price: 200 },
  ];

  const services = [];
  for (const s of serviceList) {
    const service = await prisma.services.create({
      data: {
        service_name: s.name,
        description: sanitize(faker.lorem.sentence()),
        price: s.price,
      },
    });
    services.push(service);
  }

  // ==========================
  // Seed Doctors
  // ==========================
  const doctors = [];
  for (let i = 0; i < 5; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: sanitize(faker.person.fullName()),
        specialization: sanitize(faker.person.jobTitle()),
        license_number: faker.string.alphanumeric(8),
        phone: faker.phone.number(),
        address: sanitize(faker.location.streetAddress()),
        department: sanitize(faker.commerce.department()),
        availability_status: Status.ACTIVE,
        type: JOBTYPE.FULL,
      },
    });
    doctors.push(doctor);

    const days = ["Monday", "Wednesday", "Friday"];
    for (const day of days) {
      await prisma.workingDays.create({
        data: {
          doctor_id: doctor.id,
          day,
          start_time: faker.date.soon({ days: 1, refDate: new Date("2025-01-01T08:00:00Z") }),
          close_time: faker.date.soon({ days: 1, refDate: new Date("2025-01-01T16:00:00Z") }),
        },
      });
    }
  }

  // ==========================
  // Seed Staff
  // ==========================
  const staffMembers = [];
  for (let i = 0; i < 10; i++) {
    const staff = await prisma.staff.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: sanitize(faker.person.fullName()),
        phone: faker.phone.number(),
        address: sanitize(faker.location.streetAddress()),
        department: sanitize(faker.commerce.department()),
        role: faker.helpers.arrayElement(Object.values(Role)),
        status: Status.ACTIVE,
      },
    });
    staffMembers.push(staff);
  }

  // ==========================
  // Seed Shifts (fixed UTC start/end times)
  // ==========================
  const shifts = [];
  const shiftConfigs = [
    { type: ShiftType.MORNING, startHour: 8, endHour: 16 },
    { type: ShiftType.AFTERNOON, startHour: 16, endHour: 0 },
    { type: ShiftType.NIGHT, startHour: 0, endHour: 8 },
  ];

  for (const sc of shiftConfigs) {
    // Use UTC to avoid timezone issues
    const start_time = new Date(Date.UTC(2025, 0, 1, sc.startHour, 0, 0));
    const end_time = new Date(Date.UTC(2025, 0, 1, sc.endHour, 0, 0));

    const shift = await prisma.shift.create({
      data: {
        name: `${sc.type} Shift`,
        type: sc.type,
        start_time,
        end_time,
        notes: sanitize(faker.lorem.sentence()),
      },
    });
    shifts.push(shift);
  }

  // ==========================
  // Seed Rosters (link shifts + staff/doctors)
  // ==========================
  for (const shift of shifts) {
    const rosterDate = faker.date.soon({ days: 10 });

    // Staff in shifts
    for (let i = 0; i < 3; i++) {
      const staff = faker.helpers.arrayElement(staffMembers);
      await prisma.roster.create({
        data: {
          shift_id: shift.id,
          staff_id: staff.id,
          date: rosterDate,
          start_time: shift.start_time,
          end_time: shift.end_time,
          status: Status.ACTIVE,
        },
      });
    }

    // Doctor in shift
    const doctor = faker.helpers.arrayElement(doctors);
    await prisma.roster.create({
      data: {
        shift_id: shift.id,
        doctor_id: doctor.id,
        date: rosterDate,
        start_time: shift.start_time,
        end_time: shift.end_time,
        status: Status.ACTIVE,
      },
    });
  }

  // ==========================
  // Seed Patients
  // ==========================
  const patients = [];
  for (let i = 0; i < 10; i++) {
    const patient = await prisma.patient.create({
      data: {
        id: faker.string.uuid(),
        first_name: sanitize(faker.person.firstName()),
        last_name: sanitize(faker.person.lastName()),
        date_of_birth: faker.date.birthdate({ min: 18, max: 90, mode: "age" }),
        gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE]),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        marital_status: sanitize(faker.person.jobTitle()),
        address: sanitize(faker.location.streetAddress()),
        emergency_contact_name: sanitize(faker.person.fullName()),
        emergency_contact_number: faker.phone.number(),
        relation: "Relative",
        blood_group: faker.helpers.arrayElement(["A+", "A-", "B+", "O+", "O-", "AB+", "AB-"]),
        allergies: sanitize(faker.lorem.word()),
        medical_conditions: sanitize(faker.lorem.word()),
        medical_history: sanitize(faker.lorem.sentence()),
        insurance_provider: sanitize(faker.company.name()),
        insurance_number: faker.string.alphanumeric(10),
        privacy_consent: true,
        service_consent: true,
        medical_consent: true,
      },
    });
    patients.push(patient);
  }

  // ==========================
  // Seed Appointments + Payments + Medical Records
  // ==========================
  for (const patient of patients) {
    for (let i = 0; i < 2; i++) {
      const doctor = faker.helpers.arrayElement(doctors);
      const appointment = await prisma.appointment.create({
        data: {
          patient_id: patient.id,
          doctor_id: doctor.id,
          appointment_date: faker.date.soon({ days: 20 }),
          time: "10:00 AM",
          status: AppointmentStatus.SCHEDULED,
          type: "Consultation",
          note: sanitize(faker.lorem.sentence()),
          reason: sanitize(faker.lorem.sentence()),
        },
      });

      const payment = await prisma.payment.create({
        data: {
          patient_id: patient.id,
          appointment_id: appointment.id,
          bill_date: new Date(),
          payment_date: new Date(),
          discount: 0,
          total_amount: 100,
          amount_paid: 100,
          payment_method: PaymentMethod.CASH,
          status: PaymentStatus.PAID,
        },
      });

      await prisma.patientBills.create({
        data: {
          bill_id: payment.id,
          service_id: services[0].id,
          service_date: new Date(),
          quantity: 1,
          unit_cost: services[0].price,
          total_cost: services[0].price,
        },
      });

      const medical = await prisma.medicalRecords.create({
        data: {
          patient_id: patient.id,
          appointment_id: appointment.id,
          doctor_id: doctor.id,
          treatment_plan: sanitize(faker.lorem.sentence()),
          prescriptions: sanitize(faker.lorem.sentence()),
          lab_request: sanitize(faker.lorem.sentence()),
        },
      });

      await prisma.vitalSigns.create({
        data: {
          patient_id: patient.id,
          medical_id: medical.id,
          body_temperature: 36.6,
          systolic: 120,
          diastolic: 80,
          heart_rate: "72",
          respiratory_rate: 18,
          oxygen_saturation: 98,
          weight: 70,
          height: 175,
        },
      });

      await prisma.diagnosis.create({
        data: {
          patient_id: patient.id,
          medical_id: medical.id,
          doctor_id: doctor.id,
          symptoms: sanitize(faker.lorem.words()),
          diagnosis: sanitize(faker.lorem.words()),
          prescribed_medications: sanitize(faker.lorem.words()),
          follow_up_plan: sanitize(faker.lorem.sentence()),
        },
      });

      await prisma.labTest.create({
        data: {
          record_id: medical.id,
          test_date: new Date(),
          result: sanitize(faker.lorem.word()),
          status: LabTestStatus.COMPLETED,
          service_id: services[1].id,
        },
      });
    }
  }

  // ==========================
  // Seed Pharmacist Records
  // ==========================
  for (const patient of patients) {
    await prisma.pharmacistRecord.create({
      data: {
        medication_name: sanitize(faker.lorem.word()),
        dosage: "1 tablet",
        quantity: 10,
        patient_id: patient.id,
        prescription_date: new Date(),
        pharmacist_notes: sanitize(faker.lorem.sentence()),
      },
    });
  }

  // ==========================
  // Seed Inventory
  // ==========================
  const inventoryItems = [];
  for (let i = 0; i < 5; i++) {
    const item = await prisma.inventory.create({
      data: {
        name: sanitize(faker.commerce.productName()),
        category: faker.helpers.arrayElement([
          InventoryCategory.MEDICATION,
          InventoryCategory.CONSUMABLE,
          InventoryCategory.EQUIPMENT,
          InventoryCategory.OTHER,
        ]),
        description: sanitize(faker.commerce.productDescription()),
        quantity: faker.number.int({ min: 0, max: 100 }),
        unit: "piece",
        cost_price: parseFloat(faker.commerce.price({ min: 5, max: 100 })),
        selling_price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
        batch_number: faker.string.alphanumeric(8),
        expiry_date: faker.date.future(),
        supplier: sanitize(faker.company.name()),
        last_restocked: new Date(),
        status: Status.ACTIVE,
        added_by_id: staffMembers[0].id,
      },
    });
    inventoryItems.push(item);
  }

  // ==========================
  // Seed Events + RSVPs
  // ==========================
  const event = await prisma.event.create({
    data: {
      title: "Staff Meeting",
      description: sanitize(faker.lorem.sentence()),
      type: EventType.MEETING,
      start_date: faker.date.soon({ days: 5 }),
      end_date: faker.date.soon({ days: 5 }),
      status: EventStatus.CONFIRMED,
      created_by_id: staffMembers[0].id,
    },
  });

  for (const staff of staffMembers.slice(0, 5)) {
    await prisma.rSVP.create({
      data: {
        event_id: event.id,
        staff_id: staff.id,
        response: faker.datatype.boolean(),
      },
    });
  }

  // ==========================
  // Seed Announcements
  // ==========================
  await prisma.announcement.create({
    data: {
      title: "System Launch",
      message: "The hospital management system is now live!",
      created_by_id: staffMembers[0].id,
    },
  });

  // ==========================
  // Seed Leave Types
  // ==========================
  const leaveType = await prisma.leaveType.create({
    data: {
      name: "Annual Leave",
      description: "Yearly leave",
      max_days: 15,
    },
  });

  // ==========================
  // Seed Leave Requests + Approvals
  // ==========================
  for (const staff of staffMembers.slice(0, 3)) {
    const leave = await prisma.leaveRequest.create({
      data: {
        staff_id: staff.id,
        type_id: leaveType.id,
        start_date: faker.date.soon({ days: 5 }),
        end_date: faker.date.soon({ days: 10 }),
        reason: "Family event",
        status: LeaveStatus.PENDING,
        duration: 5,
      },
    });

    await prisma.approval.create({
      data: {
        leave_id: leave.id,
        approver_id: staffMembers[0].id,
        decision: LeaveStatus.APPROVED,
        comments: "Approved by system",
      },
    });
  }

  console.log("✅ Seeding complete!");
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
