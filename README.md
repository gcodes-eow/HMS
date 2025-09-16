# 🏥 Hospital Management System (HMS)

A modern **full-stack hospital management system** built with **Next.js 15, TypeScript, Prisma, Clerk authentication, TailwindCSS, and Radix UI**.  
This system streamlines hospital operations including **patient registration, appointments, billing, staff management, medical records, pharmacy, and lab services**.

---

## 🚀 Features

- 👤 **Authentication & Roles** (via Clerk) → Admin, Doctor, Nurse, Pharmacist, Receptionist, Cashier, Lab Technician, Patient.
- 📝 **Patient Management** → Registration, medical history, vitals, and records.
- 🗓 **Appointments** → Booking, doctor availability, status tracking.
- 💊 **Pharmacy** → Prescription management, pharmacist workflows.
- 🧪 **Lab Management** → Test orders, results, and reports.
- 💵 **Billing & Payments** → Automated invoices and cashier dashboards.
- 📊 **Dashboards & Reports** → Charts for appointments, ratings, and hospital performance.
- 🛡️ **Audit Logs** → Track all user actions (appointments, billing, lab results) for accountability, compliance, and operational insights.
- ⚡ **Scalable & Modular** → Built with Next.js App Router, Prisma, and Radix UI components.

---

## 📂 Project Structure

> Key folders and their responsibilities:

<!-- PROJECT STRUCTURE COMING SOON... -->

---

## 🛠️ Tech Stack & Dependencies

**Frontend**

- [Next.js 15](https://nextjs.org/) + [React 19](https://react.dev/) → App Router, server components, client components.
- [TailwindCSS](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) → Modern styling.
- [Radix UI](https://www.radix-ui.com/) → Accessible, composable UI primitives.
- [Lucide React](https://lucide.dev/) → Icons.

**Backend & Database**

- [Prisma](https://www.prisma.io/) ORM → Database schema & queries.
- [PostgreSQL] (configurable via `prisma/schema.prisma`).
- [ts-node](https://typestrong.org/ts-node/) for running TypeScript in dev.

**Authentication**

- [Clerk](https://clerk.com/) → Authentication and user management.

**Forms & Validation**

- [react-hook-form](https://react-hook-form.com/) → Form handling.
- [zod](https://zod.dev/) → Schema validation.

**PDF & Reports**

- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js), [jspdf](https://github.com/parallax/jsPDF), [react-to-print](https://www.npmjs.com/package/react-to-print).

**Charts**

- [Recharts](https://recharts.org/) → Data visualization.

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

````bash
git clone https://github.com/your-username/hospital.git
cd hospital


2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment

Create a .env file at the root:

DATABASE_URL="your_database_connection_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

4️⃣ Database Migration & Seeding
npx prisma migrate dev
npx prisma db seed

5️⃣ Run the Development Server
npm run dev


App runs at http://localhost:3000
.

📸 Screenshots (To be added)
🛡️ License

This project is dual-licensed under either:

MIT License

Apache License, Version 2.0

at your option.

What this means for you

Users: You may choose either MIT or Apache 2.0 to govern your use of this project.

Contributors: By submitting code, you agree that your contributions will be licensed under both MIT and Apache 2.0, so that downstream users can continue to choose.

Why dual licensing?

MIT → simple, permissive, widely adopted.

Apache 2.0 → includes explicit patent rights and protections, preferred by enterprises.

This approach gives you the flexibility of MIT with the legal safeguards of Apache 2.0.

📌 Roadmap

 Add appointment reminders (email/SMS).

 Expand billing with insurance claims.

 Add multi-language support.

 Role-based dashboards with analytics.

 Deployment guides (Docker + cloud).

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Please check the TODO.md
 for planned tasks or open an issue.

🙌 Acknowledgements

Built with ❤️ using Next.js, Prisma, Clerk, Tailwind, and Radix UI.
Inspired by modern healthcare management needs.


---

⚡ This README covers:
- What the project is.
- How it works (structure + features).
- Dependencies.
- Setup guide.
- License section.
- Roadmap + contribution info.

---

## 🗄️ Database Design (ERD)

This project uses **Prisma ORM** with a relational database (PostgreSQL).

At a high level, the entities and relationships include:

- **User** (Clerk-based auth, mapped with Prisma for roles)
- **Patient** → linked to User, medical history, appointments, billing
- **Doctor** → linked to User, appointments, diagnoses, prescriptions
- **Appointment** → links Patient ↔ Doctor, includes vitals, diagnosis, and billing
- **MedicalRecord** → stores diagnosis, treatments, and historical data
- **Prescription** → connects Patient ↔ Doctor ↔ Pharmacist
- **Billing** → links to Appointments and Payments
- **LabTest** → ordered by Doctor, performed by LabTechnician, linked to Patient
- **Staff** → includes roles like Receptionist, Nurse, Cashier, Pharmacist, Lab Technician

📌 _ERD Diagram Placeholder_ → We’ll generate and include a visual Prisma ERD export here.

---

## 🌐 API & Actions

Instead of exposing REST endpoints, this system relies on **Next.js Server Actions** for backend logic, secured via Clerk authentication and role checks.

### Example Server Actions:
- `actions/admin.ts` → Manage system-wide settings and users.
- `actions/appointments.ts` → Book, cancel, and reschedule appointments.
- `actions/patient.ts` → Register new patients, update profiles, manage history.
- `actions/lab.ts` → Request and update lab test results.
- `actions/pharmacist.ts` → Dispense prescriptions and manage stock.

This keeps the app **secure** and avoids exposing unnecessary APIs.

---

 ### Audit Logs
 ### Why Important in a HMS

A Hospital Management System deals with sensitive patient data, financial records, and staff actions. Audit logs are critical for:

Accountability & Traceability

Every action (e.g., updating patient records, marking payments, changing lab results) is tracked with user_id and timestamp.

Makes it easy to identify who did what and when.

Security & Compliance

Many healthcare regulations (HIPAA, GDPR, etc.) require that sensitive actions are logged and auditable.

Helps detect unauthorized access or suspicious activity.

Error & Issue Tracking

If a wrong update happens, you can trace back which user performed the action and what data was changed.

Enables recovery or rollback of accidental changes.

Operational Insights

Aggregating logs by action or model can highlight workflow bottlenecks, e.g., too many pending lab tests or delayed payments.

Helps management optimize hospital operations.

Legal & Regulatory Protection

Provides an immutable record in case of legal disputes or investigations.

3. How It Fits in HMS Architecture

Your auditLog table acts as a centralized event store for user actions.

Works in conjunction with models like Appointment, Payment, and LabTest.

Provides an admin interface to monitor activity in real-time.

Supports filters, sorting, and pagination for usability.

✅ Summary:
This project audit logs system works by capturing actions across key HMS models, storing them safely, validating the data, and providing an admin-friendly UI to view, filter, and analyze logs. This ensures accountability, regulatory compliance, and operational insight — all essential for a secure and efficient hospital management system.

## 🖥️ Deployment Guide

### Using Docker
The repo includes a **docker-compose.yml** for containerized deployment.

1. Build and run:
   ```bash
   docker-compose up --build


The app will run on http://localhost:3000
.

Deploying to Vercel

Push the repo to GitHub.

Import into Vercel
.

Configure Environment Variables (DATABASE_URL, CLERK_KEYS).

Deploy with 1 click.

Deploying with Railway / Render

Same setup as Vercel.

Add a PostgreSQL database and update DATABASE_URL.

📖 Documentation Roadmap

Planned sections to be added later:

✅ Installation & setup (done)

✅ Project structure (done)

✅ License (done)

📌 API reference (to be expanded)

📌 ERD diagram (to be generated)

📌 Deployment walkthrough with screenshots

📌 Feature usage tutorials (step by step for doctors, patients, admins)

🧩 Modules Overview (by Role)
Role	Features
Admin	Manage users, hospital settings, roles
System Admin	Advanced system settings, configurations
Doctor	View patients, appointments, add diagnosis, prescribe medication
Nurse	Update vitals, assist with patient management
Patient	Self-registration, appointment booking, view history & bills
Cashier	Manage billing, process payments, generate invoices
Pharmacist	Manage prescriptions and dispense drugs
Lab Technician	Handle lab tests and results
Receptionist	Register patients, manage front-desk appointments
📸 Screenshots

(Coming soon – will include role dashboards, patient records, billing workflows, etc.)

✅ Status

This project is in active development 🚧.
Expect frequent changes as new features are added.

---

⚡ Next step: Generate a **Prisma-based ERD diagram** (Entity Relationship Diagram) so we can include it in the README as an image.

## 🏁 Conclusion

The **Hospital Management System (HMS)** is designed to be a **scalable, role-based platform** for managing hospital workflows.
It leverages **modern web technologies** (Next.js, Prisma, Clerk, Tailwind, Radix UI) to ensure a **secure, fast, and user-friendly** experience for both staff and patients.

This is just the foundation — more modules and integrations (insurance, SMS/email reminders, analytics dashboards) will be added in upcoming versions.

We welcome **contributions** from developers, healthcare professionals, and open-source enthusiasts to make HMS a complete and reliable solution.

---

💡 **Next Steps**
- Implement missing workflows (insurance claims, reminders, analytics).
- Add automated testing & CI/CD pipelines.
- Generate ERD diagram and API reference docs.
- Improve accessibility and multi-language support.

---

## 🤝 Get Involved

- Star ⭐ this repo if you find it useful.
- Fork 🍴 and submit pull requests with improvements.
- Open issues 🐛 to report bugs or request features.

Together, we can build a healthcare system that helps hospitals run more efficiently.

---

📜 **License**: Dual-licensed under **MIT** or **Apache 2.0** — your choice.
````
