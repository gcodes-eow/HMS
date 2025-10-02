// utils/services/events.ts
import db from "@/lib/db";
import {
  EventFilters,
  AnnouncementFilters,
  PaginatedResponse,
  Event,
  Announcement,
} from "@/types/events";

// ==========================
// Event Services
// ==========================
export async function getAllEventsPaginated(
  page: number,
  limit: number,
  filters: EventFilters
): Promise<PaginatedResponse<Event>> {
  const where: any = {};
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.created_by_id) where.created_by_id = filters.created_by_id;
  if (filters.from && filters.to) {
    where.start_date = { gte: filters.from };
    where.end_date = { lte: filters.to };
  }

  const totalRecords = await db.event.count({ where });
  const totalPages = Math.ceil(totalRecords / limit);

  const events = await db.event.findMany({
    where,
    orderBy: { start_date: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      rsvps: true,
      created_by: { select: { id: true, name: true, role: true } },
    },
  });

  return {
    data: events as unknown as Event[],
    totalRecords,
    totalPages,
    currentPage: page,
    limit,
  };
}

// ==========================
// Announcement Services
// ==========================
export async function getAllAnnouncementsPaginated(
  page: number,
  limit: number,
  filters: AnnouncementFilters
): Promise<PaginatedResponse<Announcement>> {
  const where: any = {};
  if (filters.status) where.status = filters.status;
  if (filters.created_by_id) where.created_by_id = filters.created_by_id;
  if (filters.from && filters.to) {
    where.published_at = { gte: filters.from, lte: filters.to };
  }

  const totalRecords = await db.announcement.count({ where });
  const totalPages = Math.ceil(totalRecords / limit);

  const announcements = await db.announcement.findMany({
    where,
    orderBy: { published_at: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      created_by: { select: { id: true, name: true, role: true } },
    },
  });

  return {
    data: announcements as unknown as Announcement[],
    totalRecords,
    totalPages,
    currentPage: page,
    limit,
  };
}

// ==========================
// Stats
// ==========================
export async function getEventStats() {
  const [total, confirmed, cancelled, draft] = await Promise.all([
    db.event.count(),
    db.event.count({ where: { status: "CONFIRMED" } }),
    db.event.count({ where: { status: "CANCELLED" } }),
    db.event.count({ where: { status: "DRAFT" } }),
  ]);

  return { total, confirmed, cancelled, draft };
}
