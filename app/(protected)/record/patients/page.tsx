// app/(protected)/record/patients/page.tsx
import { NewPatientFormSheet } from "@/components/forms/NewPatientFormSheet";
import { PatientListTable } from "@/components/tables/PatientListTable";
import { Pagination } from "@/components/Pagination";
import { PatientListToolbar } from "@/components/filters/PatientListToolbar";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { Prisma, Gender } from "@prisma/client";

interface Props {
  searchParams: Promise<{
    p?: string;
    search?: string;
    gender?: string;
    sort?: string;
  }>;
}

const limit = 10;

const PatientListPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const page = parseInt(params.p || "1", 10);
  if (isNaN(page) || page < 1) redirect("/record/patients?p=1");

  const offset = (page - 1) * limit;
  const query = params.search?.trim() || "";
  const genderFilter = params.gender && params.gender !== "all" ? params.gender : "";
  const sort = params.sort && params.sort !== "newest" ? params.sort : "";

  // Build filters
  const andConditions: Prisma.PatientWhereInput[] = [];

  if (query) {
    andConditions.push({
      OR: [
        { first_name: { contains: query, mode: "insensitive" } },
        { last_name: { contains: query, mode: "insensitive" } },
        { phone: { contains: query } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (genderFilter) {
    andConditions.push({ gender: genderFilter as Gender });
  }

  const where: Prisma.PatientWhereInput = {
    AND: andConditions.length > 0 ? andConditions : undefined,
  };

  // Sorting
  const orderBy: Prisma.PatientOrderByWithRelationInput[] = [];

  if (sort === "name_asc") {
    orderBy.push({ first_name: "asc" }, { last_name: "asc" });
  } else if (sort === "name_desc") {
    orderBy.push({ first_name: "desc" }, { last_name: "desc" });
  } else {
    orderBy.push({ created_at: "desc" }); // default / newest
  }

  // Fetch data
  const [patients, totalRecords] = await Promise.all([
    db.patient.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        gender: true,
        img: true,
      },
    }),
    db.patient.count({ where }),
  ]);

  // Fix nullability for TS expectations
  const patientsWithEmailFixed = patients.map((p) => ({
    ...p,
    email: p.email ?? undefined,
    img: p.img ?? undefined,
  }));

  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-semibold">Patient Records</h1>
        <NewPatientFormSheet />
      </div>

      <PatientListToolbar />

      <PatientListTable data={patientsWithEmailFixed} />

      <Pagination
        currentPage={page}
        totalRecords={totalRecords}
        totalPages={totalPages}
        limit={limit}
      />
    </div>
  );
};

export default PatientListPage;

