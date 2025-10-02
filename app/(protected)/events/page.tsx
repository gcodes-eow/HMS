// app/(protected)/events/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getEventStats,
  getAllEventsPaginated,
  getAllAnnouncementsPaginated,
} from "@/utils/services/events";
import { Pagination } from "@/components/Pagination";
import ToggleEventsFormButton from "@/components/ToggleEventsFormButton";
import { EventsAnnouncementTable } from "@/components/tables/EventsAnnouncementTable";
import { Event, Announcement } from "@/types/events";

// ✅ Import directly, it's a Client Component
import EventAnnouncementForm from "@/components/events/EventAnnouncementForm";

interface Props {
  searchParams: Promise<{ p?: string; type?: string; status?: string }>;
}

const EventsDashboard = async ({ searchParams }: Props) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = (user.publicMetadata?.role as string | undefined)?.toLowerCase();
  if (!["admin", "manager"].includes(role ?? "")) redirect("/");

  const params = await searchParams;
  const page = params?.p ? parseInt(params.p) : 1;
  const limit = 10;

  let stats = { total: 0, confirmed: 0, cancelled: 0, draft: 0 };
  let paginatedEvents = { data: [] as Event[], totalRecords: 0, totalPages: 0, currentPage: 1, limit };
  let paginatedAnnouncements = { data: [] as Announcement[], totalRecords: 0, totalPages: 0, currentPage: 1, limit };

  try {
    [stats, paginatedEvents, paginatedAnnouncements] = await Promise.all([
      getEventStats(),
      getAllEventsPaginated(page, limit, {}),
      getAllAnnouncementsPaginated(page, limit, {}),
    ]);
  } catch (error) {
    console.error("Error fetching events dashboard:", error);
  }

  const combined = [...paginatedEvents.data, ...paginatedAnnouncements.data].sort((a, b) => {
    const getTime = (item: Event | Announcement) => {
      const date = "start_date" in item ? item.start_date : item.published_at;
      return date ? new Date(date).getTime() : -Infinity;
    };
    return getTime(b) - getTime(a);
  });

  return (
    <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
      <div className="w-full xl:w-[70%]">
        {/* Stats */}
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg xl:text-2xl font-semibold">Events & Announcements</h1>
            <ToggleEventsFormButton />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
            <div className="p-4 rounded-xl bg-green-50">
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-xl font-bold">{stats.confirmed}</p>
            </div>
            <div className="p-4 rounded-xl bg-red-50">
              <p className="text-sm text-gray-500">Cancelled</p>
              <p className="text-xl font-bold">{stats.cancelled}</p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-50">
              <p className="text-sm text-gray-500">Draft</p>
              <p className="text-xl font-bold">{stats.draft}</p>
            </div>
          </div>
        </div>

        {/* Combined Table */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Items</h2>
          {combined.length === 0 ? (
            <p className="text-gray-500">No events or announcements found.</p>
          ) : (
            <>
              <EventsAnnouncementTable data={combined} showActions />
              <Pagination
                totalRecords={combined.length}
                currentPage={page}
                totalPages={Math.max(paginatedEvents.totalPages, paginatedAnnouncements.totalPages)}
                limit={limit}
              />
            </>
          )}
        </div>
      </div>

      {/* RIGHT — Slide-in Form */}
      <div
        id="events-form"
        className="fixed top-0 right-0 w-full max-w-xl h-[calc(100vh-4rem)] bg-white shadow-lg transform translate-x-full transition-transform duration-300 overflow-y-auto z-50"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add Event or Announcement</h2>
          <ToggleEventsFormButton close />
        </div>
        <div className="p-6">
          {/* Client Component rendered directly */}
          <EventAnnouncementForm />
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard;
