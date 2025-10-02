<!-- HMS - PROJECT STRUCTURE -->
hospital/
├── .clerk/
├── .next/
├── .vscode/
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
│   │   ├── admin/page.tsx
│   │   │   ├── audit-logs/page.tsx
│   │   │   ├── system-admin/page.tsx
│   │   ├── cashier/page.tsx
│   │   ├── doctor/page.tsx
│   │   ├── laboratory/page.tsx
│   │   ├── nurse/page.tsx
│   │   │   ├── administer-medication/page.tsx
│   │   │   ├── patient-management/page.tsx
│   │   ├── patient/page.tsx
│   │   │   ├── [patientId]/page.tsx
│   │   │   ├── registration/page.tsx
│   │   ├── pharmacist/page.tsx
│   │   ├── receptionist/page.tsx
│   │   ├── records/
│   │   │   ├── appointments/page.tsx
│   │   │   ├── appointments/[id]page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   ├── doctors/page.tsx
│   │   │   ├── doctors/[id]page.tsx
│   │   │   ├── inventory/page.tsx
│   │   │   ├── medical-records/page.tsx
│   │   │   ├── patients/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── staff/page.tsx
│   │   │   ├── users/page.tsx
│   ├── actions/
│   │   ├── admin.ts
│   │   ├── appointments.ts
│   │   ├── auditLogs.ts
│   │   ├── generals.ts
│   │   ├── inventory.ts
│   │   ├── laboratory.ts
│   │   ├── medicalServices.ts
│   │   ├── nurse.ts
│   │   ├── patient.ts
│   │   ├── pharmacist.ts
│   ├── fonts/
│   │   ├── GeistMonoVF.woff
│   │   ├── GeistVF.woff
│   ├── components/
│   │   ├── appointments/
│   │   │   ├── AppointmentDetails.tsx
│   │   │   ├── AppointmentQuickLinks.tsx
│   │   │   ├── BillsContainer.tsx
│   │   │   ├── BloodPressureChart.tsx
│   │   │   ├── ChartContainer.tsx
│   │   │   ├── DiagnosisContainer.tsx
│   │   │   ├── GenerateFinalBill.tsx
│   │   │   ├── HeartRateChart.tsx
│   │   │   ├── MedicalHistoryCard.tsx
│   │   │   ├── PatientDetailsCard.tsx
│   │   │   ├── PaymentContainer.tsx
│   │   │   ├── VitalVigns.tsx
│   │   ├── charts/
│   │   │   ├── AppointmentChart.tsx
│   │   │   ├── RatingChart.tsx
│   │   │   ├── StatSummary.tsx
│   │   ├── dialog/
│   │   │   ├── AddBills.tsx
│   │   │   ├── AddDiagnosis.tsx
│   │   │   ├── AddService.tsx
│   │   │   ├── EditInventory.tsx
│   │   │   ├── EditLabTest.tsx
│   │   │   ├── EditService.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ViewInventory.tsx
│   │   │   ├── ViewLabTest.tsx
│   │   │   ├── ViewService.tsx
│   │   ├── filters/
│   │   │   ├── AppointmentListToolbar.tsx
│   │   │   ├── DoctoresToolbar.tsx
│   │   │   ├── PatientListToolbar.tsx
│   │   ├── forms/
│   │   │   ├── BookAppointment.tsx
│   │   │   ├── CashierForm.tsx
│   │   │   ├── DoctorForm.tsx
│   │   │   ├── LabTestForm.tsx
│   │   │   ├── NewPatientFormSheet.tsx
│   │   │   ├── NurseForm.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   ├── PharmacistForm.tsx
│   │   │   ├── StaffForm.tsx
│   │   ├── inventory/
│   │   │   ├── InventoryFilters.tsx
│   │   │   ├── InventoryPageClient.tsx
│   │   │   ├── InventoryStats.tsx
│   │   │   ├── StockAlert.tsx
│   │   │   ├── StockAlertCard.tsx
│   │   ├── laboratory/
│   │   │   ├── ToggleLabFormButton.tsx
│   │   ├── settings/
│   │   │   ├── QuickLinkSettings.tsx
│   │   ├── tables/
│   │   │   ├── AppointmentTable.tsx
│   │   │   ├── InventoryListTable.tsx
│   │   │   ├── LabTestTable.tsx
│   │   │   ├── PatientListTable.tsx
│   │   │   ├── RecentAppointment.tsx
│   │   │   ├── Table.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Popover.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Separator.tsx
│   │   │   ├── Sheet.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Textarea.tsx
│   │   ├── ActionDialog.tsx
│   │   ├── ActionOptions.tsx
│   │   ├── AppointmentAction.tsx
│   │   ├── AppointmentActionDialog.tsx
│   │   ├── AppointmentActions.tsx
│   │   ├── AppointmentContainer.tsx
│   │   ├── AppointmentStatusIndicator.tsx
│   │   ├── AvailableDoctor.tsx
│   │   ├── CustomInput.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── MdedicalHistory.tsx
│   │   ├── MedicalHistoryContainer.tsx
│   │   ├── MedicalHistoryDialog.tsx
│   │   ├── Navbar.tsx
│   │   ├── NewPatient.tsx
│   │   ├── NoDataFound.tsx
│   │   ├── Pagination.tsx
│   │   ├── PatientRatingContainer.tsx
│   │   ├── ProfileImage.tsx
│   │   ├── RatingContainer.tsx
│   │   ├── RatingList.tsx
│   │   ├── SearchInput.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SidebarWrapper.tsx
│   │   ├── SmallCard.tsx
│   │   ├── StatCard.tsx
│   │   ├── ViewAppointment.tsx
│   ├── lib/
│   │   ├── db.ts
│   │   ├── index.ts
│   │   ├── routes.ts
│   │   ├── schema.ts
│   │   ├── utils.ts
├── node_nodules
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   ├── seed.ts
├── public/
├── types/
│   ├── dataTypes.ts
│   ├── globals.d.ts
│   ├── index.ts
├── utils/
│   ├── services/
│   │   ├── admin.ts
│   │   ├── appointment.ts
│   │   ├── doctor.ts
│   │   ├── inventory.ts
│   │   ├── laboratory.ts
│   │   ├── MedicalRecord.ts
│   │   ├── MedicalServices.ts
│   │   ├── patient.ts
│   │   ├── payments.ts
│   │   ├── receptionist.ts
│   │   ├── staff.ts
│   ├── auditLogs.ts
│   ├── index.ts
│   ├── roles.ts
│   ├── settings.ts
├── .env
├── .env.production
├── .gitignore
├── components.json
├── docker-compose.yml
├── Dockerfile
├── LICENSE
├── LICENSE-APACHE
├── LICENSE-MIT
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo

<!-- TO-DO LIST -->
1. Complete billing and payment systems.
2. Build notification and messaging system according to roles.
3. Trade Duties, Apply for Leave, Upcoming Events.
4. Make sure all links direct to the right pages without braking.
5. Create Electronic Health Records (EHR) system.
6. Decision Support Systems (DSS).
7. Telemedicine system.
8. Mobile and Cloud Access.
9. link medication administration to inventory items
10. 


<!-- Committing Changes to GitHub Repository -->
1. Stage the file(s) (quote to avoid issues with parenthes).

git add "app/(protected)/nurse/patient-management/[patientId]/page.tsx" \
        "app/(protected)/nurse/patient-management/page.tsx"

2. Verify staged files.
git status

3. Commit with a message.
git commit -m "Fix PatientDetailPage types and role checks for nurse"

4. Push to the remote repository.
git push origin main

<!-- Additional Options -->
5. git add -A 

Stages all changes (modified, deleted, and untracked files).
No need to list every file manually.

Git ignored files remain unless you force with, git add -f path/to/ignored-file.

<!-- CAUTION: Step 5 might still accidentally commit git ignored files. Best practice is to follow step 1 to 4 -->


6. Remove file from repository without deleting locally

git rm -r --cached .next

git commit -m "Remove ignored files from repository"

git push origin main

I have finished add new models to schema.prisma, zod schemas, and seed.ts. I have also finished adding all the files in the file structure below. Let's now create the files in the structure below one-by-one until everything is tied together and functional.

hospital/
├── app/
│   ├── (protected)/
│   │   ├── duty-rosters/
│   │   │   ├── page.tsx                    # Duty roster calendar view
│   │   │   ├── [id]/page.tsx               # Individual roster details
│   │   │   ├── assign/page.tsx             # Manual roster assignment
│   │   │   ├── swap/page.tsx               # Shift swap requests
│   │   │
│   │   ├── leave/
│   │   │   ├── page.tsx                    # Leave request form
│   │   │   ├── history/page.tsx            # Staff leave history
│   │   │   ├── approvals/page.tsx          # Manager approval dashboard
│   │   │
│   │   ├── events/
│   │   │   ├── page.tsx                    # Events & announcements board
│   │   │   ├── calendar/page.tsx           # Event calendar
│   │   │   ├── [id]/page.tsx               # Single event/announcement details
│   │   │   ├── create/page.tsx             # Admin create event form
│   │   │
│   ├── actions/
│   │   ├── dutyRosters.ts                  # Server actions for rosters
│   │   ├── leave.ts                        # Server actions for leave
│   │   ├── events.ts                       # Server actions for events
│
├── components/
│   ├── dutyRosters/
│   │   ├── DutyRosterCalendar.tsx          # Calendar view
│   │   ├── DutyRosterTable.tsx             # Tabular roster view
│   │   ├── AssignRosterForm.tsx            # Assign shifts manually
│   │   ├── ShiftSwapForm.tsx               # Request/approve swaps
│   │   ├── RosterFilters.tsx               # Department/role filters
│   │
│   ├── leave/
│   │   ├── LeaveRequestForm.tsx            # Staff leave application form
│   │   ├── LeaveApprovalTable.tsx          # Approvals dashboard
│   │   ├── LeaveHistoryTable.tsx           # Staff leave records
│   │   ├── LeaveBalanceCard.tsx            # Remaining quota tracker
│   │
│   ├── events/
│   │   ├── EventCard.tsx                   # Compact event/announcement card
│   │   ├── EventDetails.tsx                # Detailed event page
│   │   ├── EventCalendar.tsx               # Interactive calendar
│   │   ├── AnnouncementBoard.tsx           # List of announcements
│   │   ├── RSVPButton.tsx                  # RSVP action component
│   │
│   ├── tables/
│   │   ├── RosterTable.tsx                 # Generic roster data table
│   │   ├── LeaveTable.tsx                  # Generic leave request table
│   │   ├── EventsTable.tsx                 # Generic events listing table
│
├── utils/
│   ├── services/
│   │   ├── dutyRosters.ts                  # Business logic for scheduling
│   │   ├── leave.ts                        # Business logic for leave mgmt
│   │   ├── events.ts                       # Business logic for events
│
├── types/
│   ├── dutyRosters.ts                      # Type definitions for shifts/rosters
│   ├── leave.ts                            # Type definitions for leave
│   ├── events.ts                           # Type definitions for events

---
🧑‍⚕ 1. Duty Rosters Module

🔧 How It Works:
- Assigns shifts to medical and support staff based on roles, departments, and availability.
- Supports recurring schedules, emergency overrides, and shift swaps.
- Displays rosters in calendar or tabular format for easy viewing.

🛠 Work Plan:
1. Requirement Gathering
   - Define roles (doctors, nurses, lab techs, etc.)
   - Determine shift types (day/night, on-call, etc.)
   - Identify scheduling rules (max hours, rest periods)

2. Database Design
   - Tables: Staff, Shifts, Roster, Departments
   - Relationships: Staff ↔ Roster ↔ Shifts

3. Backend Logic
   - Auto-scheduling algorithm (optional)
   - Manual assignment interface
   - Conflict detection (overlapping shifts)

4. Frontend Interface
   - Calendar view (weekly/monthly)
   - Filters by department, role, or staff
   - Export/print options

5. Testing
   - Validate shift assignments
   - Check for edge cases (leave conflicts, holidays)

---

📝 2. Apply for Leave Module

🔧 How It Works:
- Staff submit leave requests with dates and reasons.
- Managers approve/reject based on availability and policy.
- Approved leave updates the duty roster automatically.

🛠 Work Plan:
1. Requirement Gathering
   - Leave types (annual, sick, emergency)
   - Approval hierarchy (supervisor, HR)
   - Leave policies (limits, blackout dates)

2. Database Design
   - Tables: LeaveRequests, LeaveTypes, Staff, Approvals
   - Status tracking: pending, approved, rejected

3. Backend Logic
   - Leave validation (quota, overlapping)
   - Notification system (email/SMS/in-app)
   - Integration with duty roster

4. Frontend Interface
   - Leave request form
   - Dashboard for approvals
   - Leave history and balance tracker

5. Testing
   - Submit and approve leave
   - Ensure roster updates correctly
   - Test policy enforcement

---

📢 3. Events & Announcements Module

🔧 How It Works:
- Admins post hospital-wide or department-specific updates.
- Includes meetings, training, celebrations, and alerts.
- Staff receive notifications and can RSVP if needed.

🛠 Work Plan:
1. Requirement Gathering
   - Event types (mandatory, optional)
   - Audience targeting (all staff, specific roles)
   - Notification preferences

2. Database Design
   - Tables: Events, Announcements, Staff, RSVPs
   - Fields: title, description, date/time, location, visibility

3. Backend Logic
   - Scheduling and reminders
   - RSVP tracking
   - Expiry and archive system

4. Frontend Interface
   - Announcement board
   - Event calendar
   - RSVP buttons and attendance logs

5. Testing
   - Post and view announcements
   - RSVP and attendance tracking
   - Notification delivery

---

🧩 Integration Strategy

- User Roles & Permissions: Ensure modules respect access levels (e.g., only HR can approve leave).
- Unified Dashboard: Combine all modules into a central dashboard for staff and admins.
- Mobile Compatibility: Make sure interfaces work on mobile for on-the-go access.
- Audit Logs: Track changes for compliance and accountability.
