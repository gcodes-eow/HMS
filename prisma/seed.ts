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
} from "@prisma/client";
import { fakerDE as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  console.log("Clearing existing data...");

  // Clear in reverse dependency order
  await prisma.rating.deleteMany();
  await prisma.patientBills.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.labTest.deleteMany();
  await prisma.medicalRecords.deleteMany();
  await prisma.vitalSigns.deleteMany();
  await prisma.diagnosis.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.services.deleteMany();
  await prisma.inventory.deleteMany(); // ✅ Clear inventory

  console.log("Seeding new data...");

  // Seed Services
  const services = await prisma.$transaction([
    prisma.services.create({
      data: {
        service_name: "General Consultation",
        description: "Standard doctor consultation for diagnosis and medical advice.",
        price: 50.0,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "Blood Test (Complete CBC)",
        description: "Comprehensive blood test to check overall health and detect disorders.",
        price: 40.0,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "X-Ray (Chest)",
        description: "Chest radiography to examine lungs, heart, and chest wall.",
        price: 80.0,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "MRI Scan",
        description: "Detailed magnetic resonance imaging for accurate diagnosis.",
        price: 500.0,
      },
    }),
    prisma.services.create({
      data: {
        service_name: "Physiotherapy Session",
        description: "One-hour rehabilitation and physical therapy session.",
        price: 60.0,
      },
    }),
  ]);

  // Seed Staff Roles
  const staffRoles: Role[] = [
    Role.NURSE,
    Role.CASHIER,
    Role.LABORATORY,
    Role.ADMIN,
    Role.PHARMACIST,
    Role.RECEPTIONIST,
  ];

  for (const role of staffRoles) {
    await prisma.staff.create({
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
  }

  // Seed Doctors
  const doctors = [];
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
  }

  // Seed Patients
  const patients = [];
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
    patients.push(patient);
  }

  // Inventory categories typed strictly
  const categories = ["MEDICATION", "CONSUMABLE", "EQUIPMENT", "OTHER"] as const;

  // Seed Inventory Items
  for (let i = 0; i < 15; i++) {
    await prisma.inventory.create({
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
  }

  // Seed Appointments, Payments, Medical Records, Vital Signs, Diagnosis, Lab Tests, Ratings
  for (let i = 0; i < 10; i++) {
    const doctor = faker.helpers.arrayElement(doctors);
    const patient = faker.helpers.arrayElement(patients);

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

    await prisma.payment.create({
      data: {
        appointment_id: appointment.id,
        patient_id: patient.id,
        bill_date: new Date(),
        payment_date: new Date(),
        discount: 5.0,
        total_amount: 100.0,
        amount_paid: 95.0,
        payment_method: PaymentMethod.CASH,
        status: PaymentStatus.PAID,
        bills: {
          create: {
            service_id: services[0].id,
            service_date: new Date(),
            quantity: 1,
            unit_cost: services[0].price,
            total_cost: services[0].price,
          },
        },
      },
    });

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

    await prisma.vitalSigns.create({
      data: {
        patient_id: patient.id,
        medical_id: record.id,
        body_temperature: 37.0,
        systolic: 120,
        diastolic: 80,
        heartRate: "72",
        respiratory_rate: 18,
        oxygen_saturation: 98,
        weight: 70.5,
        height: 175.3,
      },
    });

    await prisma.diagnosis.create({
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

    await prisma.labTest.create({
      data: {
        record_id: record.id,
        test_date: new Date(),
        result: "Normal",
        status: "Completed",
        service_id: services[1].id,
        notes: "No issues found",
      },
    });

    await prisma.rating.create({
      data: {
        staff_id: doctor.id,
        patient_id: patient.id,
        rating: faker.number.int({ min: 4, max: 5 }),
        comment: "Very professional and helpful",
      },
    });
  }

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

seed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
