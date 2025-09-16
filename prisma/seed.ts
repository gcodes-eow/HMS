// prisma/seed.ts
import { generateRandomColor } from "../utils/index.js";
import {
  PrismaClient,
  Role,
  Status,
  JOBTYPE,
  Gender,
  AppointmentStatus,
  PaymentMethod,
  PaymentStatus,
  LabTestStatus,
} from "@prisma/client";
import { fakerDE as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  console.log("Clearing existing data...");

  // Clear in reverse dependency order
  await prisma.rating.deleteMany();
  await prisma.patientBills.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.medicationAdministration.deleteMany();
  await prisma.labTest.deleteMany();
  await prisma.medicalRecords.deleteMany();
  await prisma.vitalSigns.deleteMany();
  await prisma.diagnosis.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.services.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.auditLog.deleteMany();

  console.log("Seeding new data...");

  // 1️⃣ Create system user for logging
  const systemUser = await prisma.staff.upsert({
    where: { id: "system-user" },
    update: {},
    create: {
      id: "system-user",
      name: "System",
      email: "system@hms.test",
      phone: "0000000000",
      address: "N/A",
      role: Role.ADMIN,
      status: Status.ACTIVE,
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: systemUser.id,
      record_id: systemUser.id,
      action: "SEED_STAFF_CREATE",
      details: `Created system user`,
      model: "Staff",
    },
  });

  // Seed Services
  const services = await prisma.$transaction([
    prisma.services.create({
      data: {
        service_name: "General Consultation",
        description: "Standard doctor consultation",
        price: 50,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "Blood Test (Complete CBC)",
        description: "Comprehensive blood test",
        price: 40,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "X-Ray (Chest)",
        description: "Chest radiography",
        price: 80,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "MRI Scan",
        description: "Detailed MRI imaging",
        price: 500,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "Physiotherapy Session",
        description: "Rehabilitation session",
        price: 60,
      },
    }),
  ]);

  // Seed Staff
  const staffRoles: Role[] = [
    Role.NURSE,
    Role.CASHIER,
    Role.LABORATORY,
    Role.ADMIN,
    Role.PHARMACIST,
    Role.RECEPTIONIST,
  ];
  const allStaff: any[] = [];
  for (const role of staffRoles) {
    const staff = await prisma.staff.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: faker.company.name(),
        license_number: faker.string.uuid(),
        role,
        status: Status.ACTIVE,
        colorCode: generateRandomColor(),
      },
    });
    allStaff.push(staff);
    await prisma.auditLog.create({
      data: {
        user_id: systemUser.id,
        record_id: staff.id,
        action: "SEED_STAFF_CREATE",
        details: `Created staff ${staff.name} (${staff.role})`,
        model: "Staff",
      },
    });
  }

  // Seed Doctors
  const doctors: any[] = [];
  for (let i = 0; i < 5; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        specialization: faker.person.jobTitle(),
        license_number: faker.string.uuid(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: faker.company.name(),
        availability_status: Status.ACTIVE,
        colorCode: generateRandomColor(),
        type: i % 2 === 0 ? JOBTYPE.FULL : JOBTYPE.PART,
        working_days: {
          create: [
            { day: "Monday", start_time: "08:00", close_time: "17:00" },
            { day: "Friday", start_time: "09:00", close_time: "16:00" },
          ],
        },
      },
    });
    doctors.push(doctor);
    await prisma.auditLog.create({
      data: {
        user_id: systemUser.id,
        record_id: doctor.id,
        action: "SEED_DOCTOR_CREATE",
        details: `Created doctor ${doctor.name} (${doctor.specialization})`,
        model: "Doctor",
      },
    });
  }

  // Seed Patients
  const allPatients: any[] = [];
  for (let i = 0; i < 10; i++) {
    const patient = await prisma.patient.create({
      data: {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        date_of_birth: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
        gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        phone: faker.phone.number(),
        email: faker.internet.email(),
        marital_status: faker.helpers.arrayElement(["Single", "Married"]),
        address: faker.location.streetAddress(),
        emergency_contact_name: faker.person.fullName(),
        emergency_contact_number: faker.phone.number(),
        relation: "Sibling",
        blood_group: "O+",
        allergies: faker.lorem.words(2),
        medical_conditions: faker.lorem.words(3),
        medical_history: faker.lorem.sentence(),
        privacy_consent: true,
        service_consent: true,
        medical_consent: true,
        colorCode: generateRandomColor(),
      },
    });
    allPatients.push(patient);
    await prisma.auditLog.create({
      data: {
        user_id: systemUser.id,
        record_id: patient.id,
        action: "SEED_PATIENT_CREATE",
        details: `Created patient ${patient.first_name} ${patient.last_name}`,
        model: "Patient",
      },
    });
  }

  // Seed Inventory
  const categories = [
    "MEDICATION",
    "CONSUMABLE",
    "EQUIPMENT",
    "OTHER",
  ] as const;
  for (let i = 0; i < 15; i++) {
    const item = await prisma.inventory.create({
      data: {
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        description: faker.commerce.productDescription(),
        quantity: faker.number.int({ min: 0, max: 200 }),
        unit: faker.helpers.arrayElement(["bottle", "box", "pack", "piece"]),
        reorder_level: faker.number.int({ min: 5, max: 20 }),
        cost_price: parseFloat(faker.commerce.price({ min: 1, max: 100 })),
        selling_price: parseFloat(faker.commerce.price({ min: 5, max: 200 })),
        batch_number: faker.string.alphanumeric(8).toUpperCase(),
        expiry_date: faker.date.future(),
        supplier: faker.company.name(),
        last_restocked: faker.date.recent(),
        status: Status.ACTIVE,
      },
    });
    await prisma.auditLog.create({
      data: {
        user_id: systemUser.id,
        record_id: item.id.toString(),
        action: "SEED_INVENTORY_CREATE",
        details: `Created inventory item ${item.name}`,
        model: "Inventory",
      },
    });
  }

  // Seed multiple appointments per patient
  for (const patient of allPatients) {
    const appointmentCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < appointmentCount; i++) {
      const doctor = faker.helpers.arrayElement(doctors);

      const appointment = await prisma.appointment.create({
        data: {
          patient_id: patient.id,
          doctor_id: doctor.id,
          appointment_date: faker.date.soon(),
          time: "10:00",
          status: AppointmentStatus.SCHEDULED,
          type: "Consultation",
          reason: faker.lorem.sentence(),
        },
      });
      await prisma.auditLog.create({
        data: {
          user_id: systemUser.id,
          record_id: appointment.id.toString(),
          action: "SEED_APPOINTMENT_CREATE",
          details: `Created appointment for patient ${patient.first_name} ${patient.last_name}`,
          model: "Appointment",
        },
      });

      // === Medication Administration (NEW) ===
      const nurse = allStaff.find((s) => s.role === Role.NURSE);
      if (nurse) {
        const medAdmin = await prisma.medicationAdministration.create({
          data: {
            patientId: patient.id,
            nurseId: nurse.id,
            medication: faker.helpers.arrayElement([
              "Paracetamol",
              "Ibuprofen",
              "Amoxicillin",
            ]),
            dosage: faker.helpers.arrayElement(["250mg", "500mg", "1g"]),
            administeredAt: faker.date.recent(),
            notes: faker.lorem.sentence(),
          },
        });
        await prisma.auditLog.create({
          data: {
            user_id: systemUser.id,
            record_id: medAdmin.id,
            action: "SEED_MEDICATION_ADMIN_CREATE",
            details: `Administered ${medAdmin.medication} to patient ${patient.first_name} ${patient.last_name}`,
            model: "MedicationAdministration",
          },
        });
      }

      // Payment (1 per appointment)
      const payment = await prisma.payment.create({
        data: {
          appointment_id: appointment.id,
          patient_id: patient.id,
          bill_date: faker.date.past(),
          payment_date: faker.date.recent(),
          discount: faker.number.int({ min: 0, max: 20 }),
          total_amount: faker.number.float({ min: 50, max: 500 }),
          amount_paid: faker.number.float({ min: 20, max: 500 }),
          payment_method: faker.helpers.arrayElement([
            PaymentMethod.CASH,
            PaymentMethod.CARD,
          ]),
          status: faker.helpers.arrayElement([
            PaymentStatus.PAID,
            PaymentStatus.UNPAID,
            PaymentStatus.PART,
          ]),
          bills: {
            create: {
              service_id: faker.helpers.arrayElement(services).id,
              service_date: new Date(),
              quantity: 1,
              unit_cost: 50,
              total_cost: 50,
            },
          },
        },
      });
      await prisma.auditLog.create({
        data: {
          user_id: systemUser.id,
          record_id: payment.id.toString(),
          action: "SEED_PAYMENT_CREATE",
          details: `Created payment ${payment.id} for appointment ${appointment.id}`,
          model: "Payment",
        },
      });

      // Medical Records
      const record = await prisma.medicalRecords.create({
        data: {
          patient_id: patient.id,
          appointment_id: appointment.id,
          doctor_id: doctor.id,
          treatment_plan: "Rest and medication",
          prescriptions: "Ibuprofen",
          lab_request: "Blood Test",
          notes: "Follow up in 2 weeks",
        },
      });
      await prisma.auditLog.create({
        data: {
          user_id: systemUser.id,
          record_id: record.id.toString(),
          action: "SEED_MEDICAL_RECORD_CREATE",
          details: `Created medical record for patient ${patient.first_name}`,
          model: "MedicalRecords",
        },
      });

      // Vital Signs
      const vitals = await prisma.vitalSigns.create({
        data: {
          patient_id: patient.id,
          medical_id: record.id,
          body_temperature: 37,
          systolic: 120,
          diastolic: 80,
          heartRate: "72",
          respiratory_rate: 18,
          oxygen_saturation: 98,
          weight: 70.5,
          height: 175.3,
        },
      });
      await prisma.auditLog.create({
        data: {
          user_id: systemUser.id,
          record_id: vitals.id.toString(),
          action: "SEED_VITAL_SIGNS_CREATE",
          details: `Created vital signs for patient ${patient.first_name}`,
          model: "VitalSigns",
        },
      });

      // Diagnosis
      const diagnosis = await prisma.diagnosis.create({
        data: {
          patient_id: patient.id,
          doctor_id: doctor.id,
          medical_id: record.id,
          symptoms: "Headache and fever",
          diagnosis: "Viral infection",
          notes: "Monitor symptoms",
          prescribed_medications: "Paracetamol",
          follow_up_plan: "Return if symptoms worsen",
        },
      });
      await prisma.auditLog.create({
        data: {
          user_id: systemUser.id,
          record_id: diagnosis.id.toString(),
          action: "SEED_DIAGNOSIS_CREATE",
          details: `Created diagnosis for patient ${patient.first_name}`,
          model: "Diagnosis",
        },
      });

      // Lab Test
      const lab = await prisma.labTest.create({
        data: {
          record_id: record.id,
          test_date: new Date(),
          result: "Normal",
          status: LabTestStatus.COMPLETED,
          service_id: faker.helpers.arrayElement(services).id,
          notes: "No issues found",
        },
      });
      await prisma.auditLog.create({
        data: {
          user_id: systemUser.id,
          record_id: lab.id.toString(),
          action: "SEED_LABTEST_CREATE",
          details: `Created lab test for patient ${patient.first_name}`,
          model: "LabTest",
        },
      });

      // Rating
      const rating = await prisma.rating.create({
        data: {
          staff_id: doctor.id,
          patient_id: patient.id,
          rating: faker.number.int({ min: 4, max: 5 }),
          comment: "Very professional and helpful",
        },
      });
      await prisma.auditLog.create({
        data: {
          user_id: systemUser.id,
          record_id: rating.id.toString(),
          action: "SEED_RATING_CREATE",
          details: `Created rating for doctor ${doctor.name} by patient ${patient.first_name}`,
          model: "Rating",
        },
      });
    }
  }

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

seed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
