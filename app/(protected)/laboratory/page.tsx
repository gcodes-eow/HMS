// app/(protected)/laboratory/page.tsx
import db from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getLabStats,
  getAllLabTestsPaginated,
  LabTestFilters,
} from "@/utils/services/laboratory";
import LabTestForm from "@/components/forms/LabTestForm";
import { Pagination } from "@/components/Pagination";
import ToggleLabFormButton from "@/components/laboratory/ToggleLabFormButton";
import { LabTestTable } from "@/components/tables/LabTestTable";
import { LabTest } from "@/types/dataTypes";

interface Props {
  searchParams: Promise<{
    p?: string;
    status?: string;
    patient_id?: string;
    technician_id?: string;
    service_id?: string;
  }>;
}

const LabTechnicianDashboard = async ({ searchParams }: Props) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const params = await searchParams;
  const page = params?.p ? parseInt(params.p) : 1;
  const limit = 10; // ✅ changed from 5 to 10

  const filters: LabTestFilters = {
    status: params?.status,
    patient_id: params?.patient_id,
    technician_id: params?.technician_id,
    service_id: params?.service_id,
  };

  let stats = { total: 0, completed: 0, pending: 0, inProgress: 0 };
  let paginatedTests: {
    data: LabTest[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } = { data: [], totalRecords: 0, totalPages: 0, currentPage: 1, limit };

  try {
    [stats, paginatedTests] = await Promise.all([
      getLabStats(),
      getAllLabTestsPaginated(page, limit, filters),
    ]);
  } catch (error) {
    console.error("Error fetching lab dashboard data:", error);
  }

  const rawPatients = await db.patient.findMany({
    select: { id: true, first_name: true, last_name: true, gender: true, img: true, colorCode: true },
  });

  const patients = rawPatients.map((p) => ({
    ...p,
    img: p.img ?? undefined,
    colorCode: p.colorCode ?? undefined,
    gender: String(p.gender),
  }));

  const services = await db.services.findMany({
    select: { id: true, service_name: true },
    orderBy: { service_name: "asc" },
  });

  return (
    <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
      {/* LEFT */}
      <div className="w-full xl:w-[70%]">
        {/* Stats */}
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg xl:text-2xl font-semibold">Welcome, {user.firstName}</h1>
            <ToggleLabFormButton />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50">
              <p className="text-sm text-gray-500">Total Tests</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold">{stats.completed}</p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-50">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold">{stats.pending}</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-bold">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        {/* Lab Tests */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Lab Tests</h2>
          {paginatedTests.data.length === 0 ? (
            <p className="text-gray-500">No lab tests found.</p>
          ) : (
            <>
              <LabTestTable
                data={paginatedTests.data}
                showActions
                sortOrder="newest"
              />
              <Pagination
                totalRecords={paginatedTests.totalRecords}
                currentPage={paginatedTests.currentPage}
                totalPages={paginatedTests.totalPages}
                limit={paginatedTests.limit}
              />
            </>
          )}
        </div>
      </div>

      {/* RIGHT — Slide-in Form */}
      <div
        id="lab-form"
        className="fixed top-0 right-0 w-full max-w-xl h-[calc(100vh-4rem)] bg-white shadow-lg transform translate-x-full transition-transform duration-300 overflow-y-auto z-50"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Ensure accurate records are filled</h2>
          <ToggleLabFormButton close />
        </div>
        <div className="p-6">
          <LabTestForm patients={patients} services={services} />
        </div>
      </div>
    </div>
  );
};

export default LabTechnicianDashboard;
