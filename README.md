npx prisma migrate reset && npm run seed
npx prisma migrate reset
npx prisma generate
npx prisma db seed
npm list --depth=0
npx prisma migrate dev --name add_cancelled_by_to_appointment
rm -rf .next

<!-- Moving to desktop -->

npm install --save-dev electron electron-builder concurrently wait-on

<!-- HMS - PROJECT STRUCTURE -->

hospital/
├── .next/
├── app/
│ ├── favicon.ico
│ ├── global.css
│ ├── layout.tsx
│ ├── page.tsx
│ ├── (auth)/
│ │ ├── layout.tsx
│ │ ├── sign-in\[[...sign-in]]/page.tsx
│ │ ├── sign-up\[[...sign-up]]/page.tsx
│ ├── (protected)/
│ │ ├── layout.tsx
│ │ ├── admin/
│ │ │ ├── page.tsx
│ │ │ ├── system-admin/page.tsx
│ │ ├── cashier/page.tsx
│ │ ├── doctor/page.tsx
│ │ ├── lab-technician/page.tsx
│ │ ├── nurse/page.tsx
│ │ ├── patient/page.tsx
│ │ │ ├── [patientId]/page.tsx
│ │ │ ├── registration/page.tsx
│ │ ├── pharmacist/page.tsx
│ │ ├── receptionist/page.tsx
│ │ ├── records/
│ │ │ ├── appointments/page.tsx
│ │ │ ├── appointments/[id]page.tsx
│ │ │ ├── billing/page.tsx
│ │ │ ├── doctors/page.tsx
│ │ │ ├── doctors/[id]page.tsx
│ │ │ ├── medical-records/page.tsx
│ │ │ ├── patient-list/page.tsx
│ │ │ ├── staff/page.tsx
│ │ │ ├── users/page.tsx
│ ├── actions/
│ │ ├── admin.ts
│ │ ├── appointments.ts
│ │ ├── lab.ts
│ │ ├── medical.ts
│ │ ├── nurse.ts
│ │ ├── patient.ts
│ │ ├── pharmacist.ts
│ ├── components/
│ │ ├── appointments/
│ │ │ ├── appointment-details.tsx
│ │ │ ├── appointment-quick-links.tsx
│ │ │ ├── bills-container.tsx
│ │ │ ├── blood-pressure-chart.tsx
│ │ │ ├── chart-container.tsx
│ │ │ ├── diagnosis-container.tsx
│ │ │ ├── generate-final-bill.tsx
│ │ │ ├── heart-rate-chart.tsx
│ │ │ ├── medical-history-card.tsx
│ │ │ ├── patient-details-card.tsx
│ │ │ ├── payment-container.tsx
│ │ │ ├── vital-signs.tsx
│ │ ├── charts/
│ │ │ ├── appointment-chart.tsx
│ │ │ ├── rating-chart.tsx
│ │ │ ├── stat-summary.tsx
│ │ ├── dialog/
│ │ │ ├── add-bill.tsx
│ │ │ ├── add-diagnosis.tsx
│ │ │ ├── add-service.tsx
│ │ │ ├── add-vital-signs.tsx
│ │ │ ├── review-form.tsx
│ │ ├── filters/
│ │ │ ├── appointment-list-toolbar.tsx
│ │ │ ├── patient-list-toolbar.tsx
│ │ ├── forms/
│ │ │ ├── book-appointment.tsx
│ │ │ ├── cashier-form.tsx
│ │ │ ├── doctor-form.tsx
│ │ │ ├── lab-technician-form.tsx
│ │ │ ├── NewPatientFormSheet.tsx
│ │ │ ├── nurse-form.tsx
│ │ │ ├── PatientForm.tsx
│ │ │ ├── pharmacist-form.tsx
│ │ │ ├── staff-form.tsx
│ │ ├── settings/
│ │ │ ├── quick-link-settings.tsx
│ │ │ ├── service-settings.tsx
│ │ ├── tables/
│ │ │ ├── patient-list-table.tsx
│ │ │ ├── recent-appointment.tsx
│ │ │ ├── table.tsx
│ │ ├── ui/
│ │ │ ├── button.tsx
│ │ │ ├── card.tsx
│ │ │ ├── checkbox.tsx
│ │ │ ├── dialog.tsx
│ │ │ ├── form.tsx
│ │ │ ├── input.tsx
│ │ │ ├── label.tsx
│ │ │ ├── popover.tsx
│ │ │ ├── radio-group.tsx
│ │ │ ├── select.tsx
│ │ │ ├── separator.tsx
│ │ │ ├── sheet.tsx
│ │ │ ├── switch.tsx
│ │ │ ├── textarea.tsx
│ │ ├── action-dialog.tsx
│ │ ├── action-options.tsx
│ │ ├── appointment-action-dialog.tsx
│ │ ├── appointment-action.tsx
│ │ ├── appointment-actions.tsx
│ │ ├── appointment-container.tsx
│ │ ├── appointment-status-indicator.tsx
│ │ ├── available-doctor.tsx
│ │ ├── custom-input.tsx
│ │ ├── logout-button.tsx
│ │ ├── medical-history-container.tsx
│ │ ├── medical-history-dialog.tsx
│ │ ├── mdedical-history.tsx
│ │ ├── navbar.tsx
│ │ ├── new-patient.tsx
│ │ ├── no-data-found.tsx
│ │ ├── pagination.tsx
│ │ ├── patient-rating-container.tsx
│ │ ├── profile-image.tsx
│ │ ├── rating-container.tsx
│ │ ├── rating-list.tsx
│ │ ├── search-input.tsx
│ │ ├── small-card.tsx
│ │ ├── view-appointment.tsx
│ ├── lib/
│ │ ├── db.ts
│ │ ├── index.ts
│ │ ├── routes.ts
│ │ ├── schema.ts
│ │ ├── utils.ts
├── node_nodules
├── prisma/
│ ├── migrations/
│ ├── schema.prisma
│ ├── seed.ts
├── public/
├── types/
│ ├── data-types.ts
│ ├── globals.d.ts
│ ├── index.ts
├── utils/
│ ├── services/
│ │ ├── admin.ts
│ │ ├── appointment.ts
│ │ ├── doctor.ts
│ │ ├── medical-records.ts
│ │ ├── medical.ts
│ │ ├── patient.ts
│ │ ├── payments.ts
│ │ ├── receptionist.ts
│ │ ├── staff.ts
│ ├── index.ts
│ ├── roles.ts
│ ├── seetings.ts
├── .env
├── .gitignore
├── components.json
├── docker-compose.yml
├── middleware.ts
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── TODO.md
├── tailwind.config.ts
├── tsconfig.json

<!-- INSTALLED DEPENDENCIES -->

hospital
├── @clerk/nextjs@6.31.1
├── @faker-js/faker@9.9.0
├── @hookform/resolvers@3.10.0
├── @prisma/client@6.15.0
├── @radix-ui/react-checkbox@1.3.3
├── @radix-ui/react-dialog@1.1.15
├── @radix-ui/react-label@2.1.7
├── @radix-ui/react-popover@1.1.15
├── @radix-ui/react-radio-group@1.3.8
├── @radix-ui/react-select@2.2.6
├── @radix-ui/react-separator@1.1.7
├── @radix-ui/react-slot@1.2.3
├── @radix-ui/react-switch@1.2.6
├── @types/html2pdf.js@0.10.0
├── @types/node@22.18.1
├── @types/react-dom@19.1.9
├── @types/react@19.1.12
├── class-variance-authority@0.7.1
├── clsx@2.1.1
├── date-fns@4.1.0
├── html2pdf.js@0.10.3
├── jspdf@3.0.2
├── lucide-react@0.468.0
├── next@15.4.6
├── postcss@8.5.6
├── prisma@6.15.0
├── react-dom@19.0.0
├── react-hook-form@7.62.0
├── react-icons@5.5.0
├── react-to-print@3.1.1
├── react@19.0.0
├── recharts@2.15.4
├── sonner@1.7.4
├── tailwind-merge@2.6.0
├── tailwindcss-animate@1.0.7
├── tailwindcss@3.4.17
├── ts-node@10.9.2
├── tsconfig-paths@4.2.0
├── typescript@5.9.2c
└── zod@3.25.76

<!-- Come back to this to complete receptionist dashboard -->

Let me know if you’d like:
Buttons to expand on hover
Animations or badges (e.g., patient counts)
To move the buttons into a Card component wrapper
Otherwise, this version is now styled exactly as per your requirements.

Let me know if you want me to:
Extract the buttons into a reusable <ReceptionistTile /> component
Convert this layout into a card grid with shadows and icons
Or apply hover transitions, animations, or Tailwind enhancements like group-hover, shadow, etc.

<!-- PUSHING TO GITHUB -->

Step-by-step guide to push project to GitHub for version control:

🛠️ 1. Initialize Git in Your Project Directory
cd your-project-folder
git init
This sets up Git tracking in your local project.

📄 2. Create a .gitignore File
This prevents unnecessary files (like node_modules) from being pushed:
touch .gitignore
Add common entries:
node_modules/
.next/
.env
.DS_Store
etc

📝 3. Stage and Commit Your Code
bash
git add .
git commit -m "Initial commit"

🐙 4. Create a GitHub Repository
Go to github.com
Click New Repository
Name it (e.g., my-nextjs-app)
Choose public or private
Don’t initialize with README (you already have one locally)

🔗 5. Link Your Local Repo to GitHub
Copy the repo URL from GitHub (HTTPS or SSH):
git remote add origin https://github.com/your-username/my-nextjs-app.git

🚀 6. Push Your Code to GitHub
git push -u origin master
Or if you're using the newer default branch name:

git push -u origin main
✅ 7. Confirm on GitHub
Visit your repo URL and you should see all your project files online.

If you want to go further, I can help you set up GitHub Actions for CI/CD, or deploy your Next.js app to Vercel or Netlify.
