// types/events.ts
import { z } from "zod";
import {
  EventSchema,
  AnnouncementSchema,
  RSVPSchema,
  EventTypeEnum,
  EventStatusEnum,
} from "@/lib/schema";

// ==========================
// Types
// ==========================
export type Event = z.infer<typeof EventSchema>;
export type Announcement = z.infer<typeof AnnouncementSchema>;
export type RSVP = z.infer<typeof RSVPSchema>;

// ==========================
// Enums
// ==========================
export type EventType = z.infer<typeof EventTypeEnum>;
export type EventStatus = z.infer<typeof EventStatusEnum>;

// ==========================
// Filters & Pagination
// ==========================
export interface EventFilters {
  type?: EventType;
  status?: EventStatus;
  created_by_id?: string;
  from?: Date;
  to?: Date;
}

export interface AnnouncementFilters {
  status?: "DRAFT" | "PUBLISHED";
  created_by_id?: string;
  from?: Date;
  to?: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
