// app/(protected)/nurse/administer-medications/page.tsx
import { getAllMedicationAdministrationsPaginated } from "@/utils/services/medicalServices";
import { getAllPatients } from "@/app/actions/patient";
import { getAllStaff } from "@/utils/services/staff";
import MedicationsClient from "@/components/MedicationsClient"; // client wrapper

const AdministerMedicationsPage = async () => {
  // Fetch first page (page 1) with 10 rows per page
  const [medsRes, patRes, staffRes] = await Promise.all([
    getAllMedicationAdministrationsPaginated(1, 10),
    getAllPatients(),
    getAllStaff({ page: 1, limit: 100 }),
  ]);

  const records = medsRes.data ?? [];
  const totalRecords = medsRes.totalRecords ?? 0;
  const totalPages = medsRes.totalPages ?? 1;
  const patients = patRes.data ?? [];
  const staff = staffRes.data ?? [];

  return (
    <MedicationsClient
      initialRecords={records}
      totalRecords={totalRecords}
      totalPages={totalPages}
      initialPage={1}
      patients={patients}
      staff={staff}
    />
  );
};

export default AdministerMedicationsPage;
