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
3. Build apply for leave system and avail it to all staff via dashboards.
4. Make sure all links direct to the right pages without braking.
5. Create Electronic Health Records (EHR) system.
6. Decision Support Systems (DSS).
7. Telemedicine system.
8. Mobile and Cloud Access.
9. link medication administration to inventory items


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
