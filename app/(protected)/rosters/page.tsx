// app/(protected)/rosters/page.tsx
// app/(protected)/rosters/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getRostersPaginated } from "@/utils/services/rosters";
import DutyRosterTable from "@/components/rosters/DutyRosterTable";
import ToggleRostersButton from "@/components/ToggleDutyRosterFormButton";
import DutyRosterForm from "@/components/rosters/DutyRosterForm";
import { DutyRoster } from "@/types/rosters";
import { Pagination } from "@/components/Pagination";

interface Props {
  searchParams: Promise<{ p?: string }>;
}

const DutyRosterDashboard = async ({ searchParams }: Props) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = (user.publicMetadata?.role as string | undefined)?.toLowerCase();
  if (!["admin", "manager"].includes(role ?? "")) redirect("/");

  const params = await searchParams;
  const page = params?.p ? parseInt(params.p) : 1;
  const limit = 10;

  let rosters: DutyRoster[] = [];
  let totalRecords = 0;
  let totalPages = 1;

  try {
    const paginated = await getRostersPaginated(page, limit);
    rosters = paginated.data; // ✅ already formatted by service
    totalRecords = paginated.totalRecords;
    totalPages = paginated.totalPages;
  } catch (error) {
    console.error("Error fetching duty rosters:", error);
  }

  return (
    <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
      <div className="w-full xl:w-[70%]">
        {/* Header + Toggle Button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Duty Rosters</h1>
          <ToggleRostersButton />
        </div>

        {/* Roster Table */}
        <DutyRosterTable rosters={rosters} />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            totalRecords={totalRecords}
            currentPage={page}
            totalPages={totalPages}
            limit={limit}
          />
        )}
      </div>

      {/* RIGHT — Slide-in Form (client rendered) */}
      <div
        id="rosters-form"
        className="fixed top-0 right-0 w-full max-w-xl h-[calc(100vh-4rem)] bg-white shadow-lg transform translate-x-full transition-transform duration-300 overflow-y-auto z-50"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Create Duty Roster</h2>
          <ToggleRostersButton close />
        </div>
        <div className="p-6">
          <DutyRosterForm />
        </div>
      </div>
    </div>
  );
};

export default DutyRosterDashboard;
