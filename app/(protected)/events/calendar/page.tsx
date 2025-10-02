// app/(protected)/events/calendar/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getAllEventsPaginated,
  getAllAnnouncementsPaginated,
} from "@/utils/services/events";
import Calendar from "@/components/Calendar";
import { Event, Announcement } from "@/types/events";

interface Props {
  searchParams: Promise<{ p?: string }>;
}

export default async function CalendarPage({ searchParams }: Props) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = (user.publicMetadata?.role as string | undefined)?.toLowerCase();

  // Only staff & doctor roles (and other allowed roles) can view
  if (!["admin", "manager", "doctor", "nurse", "laboratory", "receptionist", "pharmacist", "cashier", "staff"].includes(role ?? "")) {
    redirect("/");
  }

  const params = await searchParams;
  const page = params?.p ? parseInt(params.p) : 1;
  const limit = 100;

  let events: Event[] = [];
  let announcements: Announcement[] = [];

  try {
    const [eventData, announcementData] = await Promise.all([
      getAllEventsPaginated(page, limit, {}),
      getAllAnnouncementsPaginated(page, limit, {}),
    ]);
    events = eventData.data;
    announcements = announcementData.data;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
  }

  const combined = [...events, ...announcements];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Calendar</h1>
      <p className="text-gray-600 mb-6">
        View upcoming events and announcements. Click on an item to see details.
      </p>
      {/* Pass role to the calendar for UI restrictions */}
      <Calendar events={combined} role={role} />
    </div>
  );
}
