<!-- TO-DO LIST -->

1. Complete search and filter functionality for all roles.

2. Build notification and messaging system according to roles.

3. Build leave application system and avail it to all staff via their respective dashboards.

4. Build inventory management system.

5. Make sure all links direct to the right pages without braking.

<!-- ENHANCEMENTS OF THE AVAILABLE -->
1. medical-records. Add [id] to target the records of each individual patient.

<!-- Project structure enhancement -->
hospital/
├── .next/
├── app/
│   ├── favicon.ico
│   ├── global.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in\[[...sign-in]]/page.tsx
│   │   ├── sign-up\[[...sign-up]]/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── system-admin/page.tsx
│   │   │   ├── inventory/                      // 📂 NEW: Inventory dashboard for admin
│   │   │   │   ├── page.tsx                    // NEW: Main inventory management page
│   │   │   │   ├── add-item/page.tsx           // NEW: Form to add new stock items
│   │   │   │   ├── edit/[itemId]/page.tsx      // NEW: Edit stock items
│   │   │   │   ├── stock-alerts/page.tsx       // NEW: Low stock/expiry alerts
│   │   ├── cashier/page.tsx
│   │   ├── doctor/page.tsx
│   │   ├── lab-technician/page.tsx
│   │   ├── nurse/page.tsx
│   │   ├── patient/page.tsx
│   │   │   ├── [patientId]/page.tsx
│   │   │   ├── registration/page.tsx
│   │   ├── pharmacist/page.tsx                 // UPDATE: Show stock levels when dispensing meds
│   │   ├── receptionist/page.tsx
│   │   ├── records/
│   │   │   ├── appointments/page.tsx
│   │   │   ├── appointments/[id]page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   ├── doctors/page.tsx
│   │   │   ├── doctors/[id]page.tsx
│   │   │   ├── medical-records/page.tsx
│   │   │   ├── patient-list/page.tsx
│   │   │   ├── staff/page.tsx
│   │   │   ├── users/page.tsx
│   ├── actions/
│   │   ├── admin.ts
│   │   ├── appointments.ts
│   │   ├── lab.ts
│   │   ├── medical.ts
│   │   ├── nurse.ts
│   │   ├── patient.ts
│   │   ├── pharmacist.ts
│   │   ├── inventory.ts                         // NEW: Server actions for inventory CRUD & alerts
│   ├── components/
│   │   ├── inventory/                           // 📂 NEW UI Components for inventory
│   │   │   ├── inventory-table.tsx              // NEW: Table for listing stock
│   │   │   ├── inventory-form.tsx               // NEW: Add/Edit form
│   │   │   ├── stock-alert-card.tsx             // NEW: Card UI for low stock/expiry alerts
│   │   │   ├── inventory-filters.tsx            // NEW: Filter/search inventory
│   │   │   ├── inventory-stats.tsx              // NEW: Quick stats (total items, low stock count)
│   │   ├── tables/
│   │   │   ├── patient-list-table.tsx
│   │   │   ├── recent-appointment.tsx
│   │   │   ├── table.tsx
│   │   │   ├── inventory-table.tsx              // UPDATE: Adapt generic table for inventory list
│   │   ├── ui/
│   │   │   ├── ...
│   ├── lib/
│   │   ├── db.ts                                // UPDATE: Add Prisma inventory queries
│   │   ├── index.ts
│   │   ├── routes.ts                            // UPDATE: Add inventory-related routes
│   │   ├── schema.ts                            // UPDATE: Add Zod schemas for inventory validation
│   │   ├── utils.ts
├── prisma/
│   ├── migrations/
│   │   ├── <timestamp>_add_inventory_model/     // NEW: Prisma migration for inventory table
│   ├── schema.prisma                            // UPDATE: Add Inventory model & relations
│   ├── seed.ts                                  // UPDATE: Optionally seed sample stock items
├── public/
│   ├── inventory/                               // NEW: Optional static icons/images for stock
│   │   ├── default-item.png
├── types/
│   ├── data-types.ts                            // UPDATE: Add InventoryItem type
│   ├── globals.d.ts
│   ├── index.ts
├── utils/
│   ├── services/
│   │   ├── admin.ts
│   │   ├── appointment.ts
│   │   ├── doctor.ts
│   │   ├── medical-records.ts
│   │   ├── medical.ts
│   │   ├── patient.ts
│   │   ├── payments.ts
│   │   ├── receptionist.ts
│   │   ├── staff.ts
│   │   ├── inventory.ts                         // NEW: Client-side inventory API service
│   ├── index.ts
│   ├── roles.ts                                 // UPDATE: Add permissions for inventory module
│   ├── seetings.ts

Summary of updates
New Files
Frontend pages:

app/(protected)/admin/inventory/... (main dashboard, add/edit, alerts)

Components:

components/inventory/... (table, forms, stats, alerts)

Backend actions:

actions/inventory.ts (CRUD operations)

utils/services/inventory.ts (client API helper)

Database & types:

Prisma migration for Inventory model

Type definitions in types/data-types.ts

Files to Update
prisma/schema.prisma → Add Inventory model

lib/db.ts → Inventory queries

lib/schema.ts → Zod schemas for validation

lib/routes.ts → Inventory routes

types/data-types.ts → Inventory type

utils/roles.ts → Permissions for inventory module

pharmacist/page.tsx → Integrate stock deduction when dispensing meds

If you want, I can draft the Prisma Inventory model and Zod schema so this fits directly into your HMS with minimal friction. That would set up your DB and validation layer in one go.