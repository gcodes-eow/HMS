// app/(protected)/nurse/administer-medications/page.tsx
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import AdministerMedicationClient from "./AdministerMedicationClient";

export default async function AdministerMedicationPage(props: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return <div>Unauthorized</div>;

  // ✅ properly await searchParams
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.p || "1", 10);
  const limit = 10;
  const skip = (page - 1) * limit;

  // ✅ fetch all patients (no nurse filter available in schema)
  const patients = await db.patient.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
    orderBy: { first_name: "asc" },
  });

  // ✅ count medications for pagination
  const totalRecords = await db.medicationAdministration.count({
    where: { nurseId: userId },
  });

  // ✅ fetch medications, include nurse + patient details
  const medications = await db.medicationAdministration.findMany({
    where: { nurseId: userId },
    orderBy: { administeredAt: "desc" },
    skip,
    take: limit,
    include: {
      nurse: { select: { name: true } },
      patient: { select: { first_name: true, last_name: true } },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administer Medication</h1>
      <AdministerMedicationClient
        patients={patients}
        medications={medications}
        totalRecords={totalRecords}
        currentPage={page}
        limit={limit}
      />
    </div>
  );
}
