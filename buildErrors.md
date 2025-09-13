ms?.id : userId ?? undefined;    
     |                                                         ^
  25 |
  26 |   const response = await getPatientAppointments({
  27 |     page,
 GET /record/appointments?p=1 200 in 1138ms
Error: Route "/record/appointments" used `searchParams.id`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:60:6)
  58 |   const patientResponse = isPatient
  59 |     ? await getPatientFullDataById(userId ?? "")
> 60 |     : searchParams?.id
     |      ^
  61 |     ? await getPatientFullDataById(searchParams.id)
  62 |     : undefined;
  63 |
Error: Route "/record/appointments" used `searchParams.p`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:67:14)
  65 |     ? patientResponse?.data?.totalAppointments ?? 0
  66 |     : (await getPatientAppointments({
> 67 |         page: searchParams?.p || "1",
     |              ^
  68 |         search: searchParams?.q || "",
  69 |         status: searchParams?.status as AppointmentStatus,
  70 |         id: searchParams?.id ?? "",
Error: Route "/record/appointments" used `searchParams.q`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:68:16)
  66 |     : (await getPatientAppointments({
  67 |         page: searchParams?.p || "1",
> 68 |         search: searchParams?.q || "",
     |                ^
  69 |         status: searchParams?.status as AppointmentStatus,
  70 |         id: searchParams?.id ?? "",
  71 |       }))?.totalRecords ?? 0;
Error: Route "/record/appointments" used `searchParams.id`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:70:12)
  68 |         search: searchParams?.q || "",
  69 |         status: searchParams?.status as AppointmentStatus,
> 70 |         id: searchParams?.id ?? "",
     |            ^
  71 |       }))?.totalRecords ?? 0;
  72 |
  73 |   return (
Error: Route "/record/appointments" used `searchParams.p`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:19:22)
  17 |   const [role, { userId }] = await Promise.all([getRole(), auth()]);
  18 |
> 19 |   const page = Number(searchParams?.p || 1);
     |                      ^
  20 |   const query = searchParams?.q || "";
  21 |   const status = searchParams?.status as AppointmentStatus | undefined;
  22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
Error: Route "/record/appointments" used `searchParams.q`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:20:16)
  18 |
  19 |   const page = Number(searchParams?.p || 1);
> 20 |   const query = searchParams?.q || "";
     |                ^
  21 |   const status = searchParams?.status as AppointmentStatus | undefined;
  22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
  23 |
Error: Route "/record/appointments" used `searchParams.sort`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:22:15)
  20 |   const query = searchParams?.q || "";
  21 |   const status = searchParams?.status as AppointmentStatus | undefined;
> 22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
     |               ^
  23 |
  24 |   const queryId = role === "admin" || role === "nurse" ? searchParams?.id : userId ?? undefined;    
  25 |
Error: Route "/record/appointments" used `searchParams.id`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:24:57)
  22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
  23 |
> 24 |   const queryId = role === "admin" || role === "nurse" ? searchParams?.id : userId ?? undefined;
     |                                                         ^
  25 |
  26 |   const response = await getPatientAppointments({
  27 |     page,
 GET /record/appointments?p=1 200 in 712ms


Owere@EOWERE-JKGL2NL MINGW64 ~/Desktop/hospital
$
rmrm -rf node_modules/.cache
rm -rf .next

Owere@EOWERE-JKGL2NL MINGW64 ~/Desktop/hospital
$ npm run dev

> hospital-app@0.1.0 dev
> next dev

   ▲ Next.js 15.4.5
   - Local:        http://localhost:3000
   - Network:      http://172.17.224.76:3000
   - Environments: .env

 ✓ Starting...
 ✓ Ready in 10.7s
 ○ Compiling /middleware ...
 ✓ Compiled /middleware in 3.4s (218 modules)
<w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (160kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
 ○ Compiling /record/appointments ...
 ⚠ ./components/appointment-action-dialog.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action-dialog.tsx

./components/appointment-action.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action.tsx

./components/appointment-action-dialog.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action-dialog.tsx

./components/appointment-action.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action.tsx

./app/(protected)/record/appointments/page.tsx
Attempted import error: 'getPatientFullDataById' is not exported from '@/utils/services/patient' (imported as 'getPatientFullDataById').

Import trace for requested module:
./app/(protected)/record/appointments/page.tsx

./app/(protected)/record/appointments/page.tsx
Attempted import error: 'getPatientFullDataById' is not exported from '@/utils/services/patient' (imported as 'getPatientFullDataById').

Import trace for requested module:
./app/(protected)/record/appointments/page.tsx

./components/appointment-container.tsx
Attempted import error: 'getPatientById' is not exported from '@/utils/services/patient' (imported as 'getPatientById').

Import trace for requested module:
./components/appointment-container.tsx
./app/(protected)/record/appointments/page.tsx

./components/appointment-container.tsx
Attempted import error: 'BookAppointment' is not exported from './forms/book-appointment' (imported as 'BookAppointment').

Import trace for requested module:
./components/appointment-container.tsx
./app/(protected)/record/appointments/page.tsx
Error: Route "/record/appointments" used `searchParams.id`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:60:6)
  58 |   const patientResponse = isPatient
  59 |     ? await getPatientFullDataById(userId ?? "")
> 60 |     : searchParams?.id
     |      ^
  61 |     ? await getPatientFullDataById(searchParams.id)
  62 |     : undefined;
  63 |
Error: Route "/record/appointments" used `searchParams.p`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:67:14)
  65 |     ? patientResponse?.data?.totalAppointments ?? 0
  66 |     : (await getPatientAppointments({
> 67 |         page: searchParams?.p || "1",
     |              ^
  68 |         search: searchParams?.q || "",
  69 |         status: searchParams?.status as AppointmentStatus,
  70 |         id: searchParams?.id ?? "",
Error: Route "/record/appointments" used `searchParams.q`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:68:16)
  66 |     : (await getPatientAppointments({
  67 |         page: searchParams?.p || "1",
> 68 |         search: searchParams?.q || "",
     |                ^
  69 |         status: searchParams?.status as AppointmentStatus,
  70 |         id: searchParams?.id ?? "",
  71 |       }))?.totalRecords ?? 0;
Error: Route "/record/appointments" used `searchParams.id`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentsPage (app\(protected)\record\appointments\page.tsx:70:12)
  68 |         search: searchParams?.q || "",
  69 |         status: searchParams?.status as AppointmentStatus,
> 70 |         id: searchParams?.id ?? "",
     |            ^
  71 |       }))?.totalRecords ?? 0;
  72 |
  73 |   return (
 ⚠ ./components/appointment-action-dialog.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action-dialog.tsx

./components/appointment-action.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action.tsx

./components/appointment-action-dialog.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action-dialog.tsx

./components/appointment-action.tsx
Attempted import error: 'appointmentAction' is not exported from '@/app/actions/appointment' (imported as 'appointmentAction').

Import trace for requested module:
./components/appointment-action.tsx

./app/(protected)/record/appointments/page.tsx
Attempted import error: 'getPatientFullDataById' is not exported from '@/utils/services/patient' (imported as 'getPatientFullDataById').

Import trace for requested module:
./app/(protected)/record/appointments/page.tsx

./app/(protected)/record/appointments/page.tsx
Attempted import error: 'getPatientFullDataById' is not exported from '@/utils/services/patient' (imported as 'getPatientFullDataById').

Import trace for requested module:
./app/(protected)/record/appointments/page.tsx

./components/appointment-container.tsx
Attempted import error: 'getPatientById' is not exported from '@/utils/services/patient' (imported as 'getPatientById').

Import trace for requested module:
./components/appointment-container.tsx
./app/(protected)/record/appointments/page.tsx

./components/appointment-container.tsx
Attempted import error: 'BookAppointment' is not exported from './forms/book-appointment' (imported as 'BookAppointment').

Import trace for requested module:
./components/appointment-container.tsx
./app/(protected)/record/appointments/page.tsx
Error: Route "/record/appointments" used `searchParams.p`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:19:22)
  17 |   const [role, { userId }] = await Promise.all([getRole(), auth()]);
  18 |
> 19 |   const page = Number(searchParams?.p || 1);
     |                      ^
  20 |   const query = searchParams?.q || "";
  21 |   const status = searchParams?.status as AppointmentStatus | undefined;
  22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
Error: Route "/record/appointments" used `searchParams.q`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:20:16)
  18 |
  19 |   const page = Number(searchParams?.p || 1);
> 20 |   const query = searchParams?.q || "";
     |                ^
  21 |   const status = searchParams?.status as AppointmentStatus | undefined;
  22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
  23 |
Error: Route "/record/appointments" used `searchParams.sort`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:22:15)
  20 |   const query = searchParams?.q || "";
  21 |   const status = searchParams?.status as AppointmentStatus | undefined;
> 22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
     |               ^
  23 |
  24 |   const queryId = role === "admin" || role === "nurse" ? searchParams?.id : userId ?? undefined;
  25 |
Error: Route "/record/appointments" used `searchParams.id`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
    at AppointmentTableWrapper (app\(protected)\record\appointments\page.tsx:24:57)
  22 |   const sort = (searchParams?.sort as "newest" | "oldest") || "newest";
  23 |
> 24 |   const queryId = role === "admin" || role === "nurse" ? searchParams?.id : userId ?? undefined;
     |                                                         ^
  25 |
  26 |   const response = await getPatientAppointments({
  27 |     page,


Owere@EOWERE-JKGL2NL MINGW64 ~/Desktop/hospital
$ npx tsc --build --force
app/(protected)/doctor/page.tsx:26:5 - error TS2339: Property 'totalPatient' does not exist on type 'ServiceResponse<any>'.

26     totalPatient,
       ~~~~~~~~~~~~

app/(protected)/doctor/page.tsx:27:5 - error TS2339: Property 'totalNurses' does not exist on type 'ServiceResponse<any>'.

27     totalNurses,
       ~~~~~~~~~~~

app/(protected)/doctor/page.tsx:28:5 - error TS2339: Property 'totalAppointment' does not exist on type 'ServiceResponse<any>'.

28     totalAppointment,
       ~~~~~~~~~~~~~~~~

app/(protected)/doctor/page.tsx:29:5 - error TS2339: Property 'appointmentCounts' does not exist on type 'ServiceResponse<any>'.

29     appointmentCounts,
       ~~~~~~~~~~~~~~~~~

app/(protected)/doctor/page.tsx:30:5 - error TS2339: Property 'availableDoctors' does not exist on type 'ServiceResponse<any>'.

30     availableDoctors,
       ~~~~~~~~~~~~~~~~

app/(protected)/doctor/page.tsx:31:5 - error TS2339: Property 'monthlyData' does not exist on type 'ServiceResponse<any>'.

31     monthlyData,
       ~~~~~~~~~~~

app/(protected)/doctor/page.tsx:32:5 - error TS2339: Property 'last5Records' does not exist on type 'ServiceResponse<any>'.

32     last5Records,
       ~~~~~~~~~~~~

app/(protected)/patient/[patientId]/page.tsx:6:10 - error TS2305: Module '"@/utils/services/patient"' has no exported member 'getPatientFullDataById'.

6 import { getPatientFullDataById } from "@/utils/services/patient";      
app/(protected)/patient/page.tsx:7:36 - error TS2307: Cannot find module '@/components/tables/recent-appointments' or its corresponding type declarations.

7 import { RecentAppointments } from "@/components/tables/recent-appointments";

app/(protected)/patient/registration/page.tsx:3:10 - error TS2305: Module '"@/utils/services/patient"' has no exported member 'getPatientById'.     

3 import { getPatientById } from "@/utils/services/patient";
app/(protected)/record/appointments/[id]/page.tsx:12:10 - error TS2305: Module '"@/utils/services/appointment"' has no exported member 'getAppointmentWithMedicalRecordsById'.

12 import { getAppointmentWithMedicalRecordsById } from "@/utils/services/appointment";

app/(protected)/record/appointments/page.tsx:7:10 - error TS2305: Module '"@/utils/services/patient"' has no exported member 'getPatientFullDataById'.

7 import { getPatientFullDataById } from "@/utils/services/patient";      
app/(protected)/record/doctors/[id]/page.tsx:3:1 - error TS6133: 'PatientRatingContainer' is declared but its value is never read.

3 import { PatientRatingContainer } from "@/components/patient-rating-container";
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app/(protected)/record/doctors/[id]/page.tsx:19:17 - error TS2339: Property 'totalAppointment' does not exist on type 'ServiceResponse<any>'.       

19   const { data, totalAppointment } = await getDoctorById(params?.id);  
                   ~~~~~~~~~~~~~~~~

app/(protected)/record/doctors/page.tsx:9:1 - error TS6133: 'Button' is declared but its value is never read.

9 import { Button } from "@/components/ui/button";
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app/(protected)/record/doctors/page.tsx:120:13 - error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.

120             currentPage={currentPage}
                ~~~~~~~~~~~

  components/pagination.tsx:10:3
    10   currentPage: number;
         ~~~~~~~~~~~
    The expected type comes from property 'currentPage' which is declared here on type 'IntrinsicAttributes & PaginationProps'

app/(protected)/record/doctors/page.tsx:121:13 - error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.

121             totalRecords={totalRecords}
                ~~~~~~~~~~~~

  components/pagination.tsx:9:3
    9   totalRecords: number;
        ~~~~~~~~~~~~
    The expected type comes from property 'totalRecords' which is declared here on type 'IntrinsicAttributes & PaginationProps'

app/(protected)/record/inventory/edit/[id]/page.tsx:30:22 - error TS2322: Type '{ description: string | undefined; expiry_date: string | undefined; supplier: string | undefined; batch_number: string | undefined; unit: string; cost_price: number; selling_price: number; ... 9 more ...; last_restocked: Date; }' is not assignable to type '{ name: string; status: "ACTIVE" | "INACTIVE" | "DORMANT"; category: "MEDICATION" | "CONSUMABLE" | "EQUIPMENT" | "OTHER"; quantity: number; unit: string; reorder_level: number; cost_price: number; ... 6 more ...; added_by_id?: string | undefined; }'.     
  Types of property 'last_restocked' are incompatible.
    Type 'Date' is not assignable to type 'string'.

30       <InventoryForm defaultValues={defaultValues} isEdit />
                        ~~~~~~~~~~~~~

  components/forms/inventory-form.tsx:24:3
    24   defaultValues?: InventorySchemaType;
         ~~~~~~~~~~~~~
    The expected type comes from property 'defaultValues' which is declared here on type 'IntrinsicAttributes & InventoryFormProps'

app/(protected)/record/medical-records/page.tsx:66:9 - error TS6133: 'isAdmin' is declared but its value is never read.

66   const isAdmin = await checkRole("ADMIN");
           ~~~~~~~

app/(protected)/record/staffs/page.tsx:3:1 - error TS6133: 'ViewAction' is declared but its value is never read.

3 import { ViewAction } from "@/components/action-options";
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app/(protected)/record/staffs/page.tsx:4:1 - error TS6133: 'DoctorForm' is declared but its value is never read.

4 import { DoctorForm } from "@/components/forms/doctor-form";
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app/(protected)/record/staffs/page.tsx:10:1 - error TS6133: 'Button' is declared but its value is never read.

10 import { Button } from "@/components/ui/button";
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app/(protected)/record/staffs/page.tsx:15:10 - error TS6133: 'Doctor' is declared but its value is never read.

15 import { Doctor, Staff } from "@prisma/client";
            ~~~~~~

app/(protected)/record/users/appointment/[id]/page.tsx:7:10 - error TS2305: Module '"@/app/actions/appointment"' has no exported member 'appointmentAction'.

7 import { appointmentAction } from "@/app/actions/appointment";
           ~~~~~~~~~~~~~~~~~

app/(protected)/record/users/appointment/[id]/page.tsx:39:35 - error TS2339: Property 'user_id' does not exist on type '{ doctor: { address: string; img: string | null; name: string; type: JOBTYPE; email: string; id: string; updated_at: Date; created_at: Date; phone: string; colorCode: string | null; specialization: string; license_number: string; department: string | null; availability_status: Status; }; } & { ...; }'.

39   if (!appointment || appointment.user_id !== userId) {
                                     ~~~~~~~

app/(protected)/record/users/appointment/[id]/page.tsx:47:50 - error TS2339: Property 'CONFIRMED' does not exist on type '{ PENDING: "PENDING"; SCHEDULED: "SCHEDULED"; CANCELLED: "CANCELLED"; COMPLETED: "COMPLETED"; }'.   

47     safeAppointment.status === AppointmentStatus.CONFIRMED;
                                                    ~~~~~~~~~

app/(protected)/record/users/appointment/page.tsx:7:10 - error TS2305: Module '"@/app/actions/appointment"' has no exported member 'appointmentAction'.

7 import { appointmentAction } from "@/app/actions/appointment";
           ~~~~~~~~~~~~~~~~~

app/(protected)/record/users/appointment/page.tsx:15:14 - error TS2353: Object literal may only specify known properties, and 'user_id' does not exist in type 'AppointmentWhereInput'.

15     where: { user_id: userId },
                ~~~~~~~

app/(protected)/record/users/appointment/page.tsx:52:51 - error TS2339: Property 'CONFIRMED' does not exist on type '{ PENDING: "PENDING"; SCHEDULED: "SCHEDULED"; CANCELLED: "CANCELLED"; COMPLETED: "COMPLETED"; }'.        

52                 appt.status === AppointmentStatus.CONFIRMED;
                                                     ~~~~~~~~~

app/(protected)/record/users/appointment/page.tsx:63:45 - error TS2339: Property 'doctor' does not exist on type '{ time: string; type: string; note: string | null; status: AppointmentStatus; id: number; reason: string | null; updated_at: Date; created_at: Date; doctor_id: string; patient_id: string; appointment_date: Date; }'.

63                   <td className="p-2">{appt.doctor?.name || "—"}</td>  
                                               ~~~~~~

app/(protected)/record/users/book/page.tsx:8:10 - error TS2724: '"@/lib/schema"' has no exported member named 'AppointmentFormSchema'. Did you mean 'AppointmentSchema'?

8 import { AppointmentFormSchema } from "@/lib/schema";
           ~~~~~~~~~~~~~~~~~~~~~

  lib/schema.ts:101:14
    101 export const AppointmentSchema = z.object({
                     ~~~~~~~~~~~~~~~~~
    'AppointmentSchema' is declared here.

app/(protected)/record/users/book/page.tsx:11:10 - error TS2724: '"@/app/actions/appointment"' has no exported member named 'createNewAppointment'. Did you mean 'createAppointment'?

11 import { createNewAppointment } from "@/app/actions/appointment";      
            ~~~~~~~~~~~~~~~~~~~~

  app/actions/appointment.ts:25:23
    25 export async function createAppointment(input: AppointmentInput): Promise<ActionResponse> {
                             ~~~~~~~~~~~~~~~~~
    'createAppointment' is declared here.

app/(protected)/record/users/profile/page.tsx:30:14 - error TS2353: Object literal may only specify known properties, and 'user_id' does not exist in type 'AppointmentWhereInput'.

30     where: { user_id: userId },
                ~~~~~~~

app/(protected)/record/users/profile/page.tsx:94:47 - error TS2339: Property 'doctor' does not exist on type '{ time: string; type: string; note: string | null; status: AppointmentStatus; id: number; reason: string | null; updated_at: Date; created_at: Date; doctor_id: string; patient_id: string; appointment_date: Date; }'.

94                     <td className="p-2">{appt.doctor?.name || "—"}</td>
                                                 ~~~~~~

app/actions/admin.ts:191:7 - error TS2322: Type '{ expiry_date: Date | null; updated_at: Date; name?: string | undefined; status?: "ACTIVE" | "INACTIVE" | "DORMANT" | undefined; description?: string | undefined; category?: "MEDICATION" | ... 3 more ... | undefined; ... 8 more ...; added_by_id?: string | undefined; }' is not assignable to type '(Without<InventoryUpdateInput, InventoryUncheckedUpdateInput> & InventoryUncheckedUpdateInput) | (Without<...> & InventoryUpdateInput)'.
  Type '{ expiry_date: Date | null; updated_at: Date; name?: string | undefined; status?: "ACTIVE" | "INACTIVE" | "DORMANT" | undefined; description?: string | undefined; category?: "MEDICATION" | ... 3 more ... | undefined; ... 8 more ...; added_by_id?: string | undefined; }' is not assignable to type 'Without<InventoryUncheckedUpdateInput, InventoryUpdateInput> & InventoryUpdateInput'.
    Type '{ expiry_date: Date | null; updated_at: Date; name?: string | undefined; status?: "ACTIVE" | "INACTIVE" | "DORMANT" | undefined; description?: string | undefined; category?: "MEDICATION" | ... 3 more ... | undefined; ... 8 more ...; added_by_id?: string | undefined; }' is not assignable to type 'Without<InventoryUncheckedUpdateInput, InventoryUpdateInput>'. 
      Types of property 'added_by_id' are incompatible.
        Type 'string | undefined' is not assignable to type 'undefined'.  
          Type 'string' is not assignable to type 'undefined'.

191       data: {
          ~~~~

  node_modules/.prisma/client/index.d.ts:23159:5
    23159     data: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
              ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: InventorySelect<DefaultArgs> | null | undefined; omit?: InventoryOmit<DefaultArgs> | null | undefined; include?: InventoryInclude<...> | ... 1 more ... | undefined; data: (Without<...> & InventoryUncheckedUpdateInput) | (Without<...> & InventoryUpdateInput); where: InventoryWhereUniqueInput; }'

app/actions/inventory.ts:33:53 - error TS2322: Type '{ name: string; status: "ACTIVE" | "INACTIVE" | "DORMANT"; category: "MEDICATION" | "CONSUMABLE" | "EQUIPMENT" | "OTHER"; quantity: number; unit: string; reorder_level: number; cost_price: number; ... 6 more ...; added_by_id?: string | undefined; }' is not assignable to type '(Without<InventoryCreateInput, InventoryUncheckedCreateInput> & InventoryUncheckedCreateInput) | (Without<...> & InventoryCreateInput)'.
  Type '{ name: string; status: "ACTIVE" | "INACTIVE" | "DORMANT"; category: "MEDICATION" | "CONSUMABLE" | "EQUIPMENT" | "OTHER"; quantity: number; unit: string; reorder_level: number; cost_price: number; ... 6 more ...; added_by_id?: string | undefined; }' is not assignable to type 'Without<InventoryUncheckedCreateInput, InventoryCreateInput> & InventoryCreateInput'.
    Type '{ name: string; status: "ACTIVE" | "INACTIVE" | "DORMANT"; category: "MEDICATION" | "CONSUMABLE" | "EQUIPMENT" | "OTHER"; quantity: number; unit: string; reorder_level: number; cost_price: number; ... 6 more ...; added_by_id?: string | undefined; }' is not assignable to type 'Without<InventoryUncheckedCreateInput, InventoryCreateInput>'.
      Types of property 'added_by_id' are incompatible.
        Type 'string | undefined' is not assignable to type 'undefined'.  
          Type 'string' is not assignable to type 'undefined'.

33     const newItem = await prisma.inventory.create({ data: validated });
                                                       ~~~~

  node_modules/.prisma/client/index.d.ts:23103:5
    23103     data: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
              ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: InventorySelect<DefaultArgs> | null | undefined; omit?: InventoryOmit<DefaultArgs> | null | undefined; include?: InventoryInclude<...> | ... 1 more ... | undefined; data: (Without<...> & InventoryUncheckedCreateInput) | (Without<...> & InventoryCreateInput); }'

app/actions/inventory.ts:52:7 - error TS2322: Type '{ name?: string | undefined; status?: "ACTIVE" | "INACTIVE" | "DORMANT" | undefined; description?: string | undefined; category?: "MEDICATION" | "CONSUMABLE" | "EQUIPMENT" | "OTHER" | undefined; ... 9 more ...; added_by_id?: string | undefined; }' is not assignable to type '(Without<InventoryUpdateInput, InventoryUncheckedUpdateInput> & InventoryUncheckedUpdateInput) | (Without<...> & InventoryUpdateInput)'.
  Type '{ name?: string | undefined; status?: "ACTIVE" | "INACTIVE" | "DORMANT" | undefined; description?: string | undefined; category?: "MEDICATION" | "CONSUMABLE" | "EQUIPMENT" | "OTHER" | undefined; ... 9 more ...; added_by_id?: string | undefined; }' is not assignable to type 'Without<InventoryUncheckedUpdateInput, InventoryUpdateInput> & InventoryUpdateInput'.  
    Type '{ name?: string | undefined; status?: "ACTIVE" | "INACTIVE" | "DORMANT" | undefined; description?: string | undefined; category?: "MEDICATION" | "CONSUMABLE" | "EQUIPMENT" | "OTHER" | undefined; ... 9 more ...; added_by_id?: string | undefined; }' is not assignable to type 'Without<InventoryUncheckedUpdateInput, InventoryUpdateInput>'.
      Types of property 'added_by_id' are incompatible.
        Type 'string | undefined' is not assignable to type 'undefined'.  
          Type 'string' is not assignable to type 'undefined'.

52       data: validated,
         ~~~~

  node_modules/.prisma/client/index.d.ts:23159:5
    23159     data: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
              ~~~~
    The expected type comes from property 'data' which is declared here on type '{ select?: InventorySelect<DefaultArgs> | null | undefined; omit?: InventoryOmit<DefaultArgs> | null | undefined; include?: InventoryInclude<...> | ... 1 more ... | undefined; data: (Without<...> & InventoryUncheckedUpdateInput) | (Without<...> & InventoryUpdateInput); where: InventoryWhereUniqueInput; }'

app/actions/pharmacist.ts:3:1 - error TS6133: 'z' is declared but its value is never read.

3 import { z } from "zod";
  ~~~~~~~~~~~~~~~~~~~~~~~~

components/appointment-action-dialog.tsx:20:10 - error TS2305: Module '"@/app/actions/appointment"' has no exported member 'appointmentAction'.     

20 import { appointmentAction } from "@/app/actions/appointment";
            ~~~~~~~~~~~~~~~~~

components/appointment-action.tsx:10:10 - error TS2305: Module '"@/app/actions/appointment"' has no exported member 'appointmentAction'.

10 import { appointmentAction } from "@/app/actions/appointment";
            ~~~~~~~~~~~~~~~~~

components/appointment-actions.tsx:19:3 - error TS6133: 'userId' is declared but its value is never read.

19   userId,
     ~~~~~~

components/appointment-container.tsx:3:10 - error TS2724: '"./forms/book-appointment"' has no exported member named 'BookAppointment'. Did you mean 'BookAppointmentForm'?

3 import { BookAppointment } from "./forms/book-appointment";
           ~~~~~~~~~~~~~~~

  components/forms/book-appointment.tsx:50:14
    50 export const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
                    ~~~~~~~~~~~~~~~~~~~
    'BookAppointmentForm' is declared here.

components/appointment-container.tsx:4:10 - error TS2305: Module '"@/utils/services/patient"' has no exported member 'getPatientById'.

4 import { getPatientById } from "@/utils/services/patient";
           ~~~~~~~~~~~~~~

components/appointment/bills-container.tsx:7:18 - error TS6133: 'formatDate' is declared but its value is never read.

7 import { format, formatDate } from "date-fns";
                   ~~~~~~~~~~

components/appointment/diagnosis-container.tsx:9:1 - error TS6133: 'record' is declared but its value is never read.

9 import { record } from "zod";
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/appointment/generate-final-bill.tsx:31:7 - error TS6133: 'discountInfo' is declared but its value is never read.

31   let discountInfo = null;
         ~~~~~~~~~~~~

components/appointment/vital-signs.tsx:5:1 - error TS6133: 'stat' is declared but its value is never read.

5 import { stat } from "fs";
  ~~~~~~~~~~~~~~~~~~~~~~~~~~

components/dialogs/add-vital-signs.tsx:4:10 - error TS2305: Module '"@/app/actions/appointment"' has no exported member 'addVitalSigns'.

4 import { addVitalSigns } from "@/app/actions/appointment";
           ~~~~~~~~~~~~~

components/forms/doctor-form.tsx:7:17 - error TS6133: 'useActionState' is declared but its value is never read.

7 import React, { useActionState, useEffect, useState } from "react";     
                  ~~~~~~~~~~~~~~

components/forms/staff-form.tsx:4:10 - error TS6133: 'DoctorSchema' is declared but its value is never read.

4 import { DoctorSchema, StaffSchema } from "@/lib/schema";
           ~~~~~~~~~~~~

components/forms/staff-form.tsx:21:1 - error TS6133: 'SPECIALIZATION' is declared but its value is never read.

21 import { SPECIALIZATION } from "@/utils/settings";
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

components/forms/staff-form.tsx:23:10 - error TS6133: 'createNewDoctor' is declared but its value is never read.

23 import { createNewDoctor, createNewStaff } from "@/app/actions/admin"; 
            ~~~~~~~~~~~~~~~

components/medical-history-container.tsx:11:49 - error TS6133: 'id' is declared but its value is never read.

11 export const MedicalHistoryContainer = async ({ id, patientId }: DataProps) => {
                                                   ~~

components/medical-history-dialog.tsx:14:3 - error TS6133: 'id' is declared but its value is never read.

14   id,
     ~~

components/medical-history-dialog.tsx:15:3 - error TS6133: 'patientId' is declared but its value is never read.

15   patientId,
     ~~~~~~~~~

components/medical-history-dialog.tsx:16:3 - error TS6133: 'doctor_id' is declared but its value is never read.

16   doctor_id,
     ~~~~~~~~~

components/new-patient.tsx:121:18 - error TS2345: Argument of type '{ first_name: string; last_name: string; email: string | null; phone: string; date_of_birth: Date; gender: $Enums.Gender; marital_status: PatientFormValues["marital_status"]; ... 12 more ...; service_consent: boolean; }' is not assignable to parameter of type 'PatientFormValues | { address?: string | undefined; first_name?: string | undefined; last_name?: string | undefined; phone?: string | undefined; date_of_birth?: Date | undefined; ... 15 more ...; insurance_number?: string | undefined; } | ResetAction<...> | undefined'.
  Types of property 'email' are incompatible.
    Type 'string | null' is not assignable to type 'string | undefined'.  
      Type 'null' is not assignable to type 'string | undefined'.

121       form.reset({
                     ~
122         first_name: data.first_name,
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
...
141         service_consent: data.service_consent,
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
142       });
    ~~~~~~~

components/profile-image.tsx:6:29 - error TS7030: Not all code paths return a value.

  6 export const ProfileImage = ({
                                ~~
  7   url,
    ~~~~~~
...
 17   bgColor?: string;
    ~~~~~~~~~~~~~~~~~~~
 18 }) => {
    ~~~~~~~

components/rating-container.tsx:8:11 - error TS2339: Property 'ratings' does not exist on type 'ServiceResponse<any>'.

8   const { ratings, totalRatings, averageRating } = await getRatingById(id);
            ~~~~~~~

components/rating-container.tsx:8:20 - error TS2339: Property 'totalRatings' does not exist on type 'ServiceResponse<any>'.

8   const { ratings, totalRatings, averageRating } = await getRatingById(id);
                     ~~~~~~~~~~~~

components/rating-container.tsx:8:34 - error TS2339: Property 'averageRating' does not exist on type 'ServiceResponse<any>'.

8   const { ratings, totalRatings, averageRating } = await getRatingById(id);
                                   ~~~~~~~~~~~~~

components/rating-list.tsx:5:11 - error TS6196: 'DataProps' is declared but never used.

5 interface DataProps {
            ~~~~~~~~~

components/rating-list.tsx:22:27 - error TS6133: 'id' is declared but its value is never read.

22         {data?.map((rate, id) => (
                             ~~

components/settings/services-settings.tsx:1:10 - error TS2305: Module '"@/utils/services/admin"' has no exported member 'getServices'.

1 import { getServices } from "@/utils/services/admin";
           ~~~~~~~~~~~

node_modules/lucide-react/dist/lucide-react.d.ts:2:10 - error TS2305: Module '"react"' has no exported member 'ReactSVG'.

2 import { ReactSVG, SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';
           ~~~~~~~~

node_modules/react-icons/lib/iconBase.d.ts:16:50 - error TS2503: Cannot find namespace 'JSX'.

16 export type IconType = (props: IconBaseProps) => JSX.Element;~~

node_modules/react-icons/lib/iconBase.d.ts:19:5 - error TS2503: Cannot find namespace 'JSX'.

19 }): JSX.Element;
       ~~~

node_modules/recharts/types/chart/generateCategoricalChart.d.ts:2:36 - error TS7016: Could not find a declaration file for module 'lodash'. 'C:/Users/Owere/Desktop/hospital/node_modules/lodash/lodash.js' implicitly has an 'any' type.
  Try `npm i --save-dev @types/lodash` if it exists or add a new declaration (.d.ts) file containing `declare module 'lodash';`

2 import type { DebouncedFunc } from 'lodash';
                                     ~~~~~~~~

utils/services/doctor.ts:110:74 - error TS2345: Argument of type '{ id: number; appointment_date: Date; status: AppointmentStatus; doctor_id: string; patient_id: string; doctor: { id: string; name: string; specialization: string; img: string | null; colorCode: string | null; }; patient: { ...; }; }[]' is not assignable to parameter of type 'DashboardAppointment[]'.   
  Property 'time' is missing in type '{ id: number; appointment_date: Date; status: AppointmentStatus; doctor_id: string; patient_id: string; doctor: { id: string; name: string; specialization: string; img: string | null; colorCode: string | null; }; patient: { ...; }; }' but required in type 'DashboardAppointment'.

110     const { appointmentCounts, monthlyData } = await processAppointments(normalizedAppointments);

  types/data-types.ts:63:3
    63   time: string;
         ~~~~
    'time' is declared here.
Found 69 errors.
