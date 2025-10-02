// app/actions/events.ts
"use server";

import { revalidatePath } from "next/cache";
import db from "@/lib/db";
import { EventSchema, AnnouncementSchema, RSVPSchema } from "@/lib/schema";
import { z } from "zod";

// ==========================
// Event Actions
// ==========================
export async function createEvent(input: unknown) {
  try {
    const data = EventSchema.parse(input);
    const event = await db.event.create({ data });
    revalidatePath("/events");
    return { success: true, data: event };
  } catch (error: any) {
    console.error("Error creating event:", error);
    return { success: false, message: error.message };
  }
}

export async function updateEvent(id: number, input: unknown) {
  try {
    const data = EventSchema.partial().parse(input);
    const event = await db.event.update({ where: { id }, data });
    revalidatePath("/events");
    return { success: true, data: event };
  } catch (error: any) {
    console.error("Error updating event:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteEvent(id: number) {
  try {
    await db.event.delete({ where: { id } });
    revalidatePath("/events");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return { success: false, message: error.message };
  }
}

// ==========================
// Announcement Actions
// ==========================
export async function createAnnouncement(input: unknown) {
  try {
    const data = AnnouncementSchema.parse(input);
    const announcement = await db.announcement.create({ data });
    revalidatePath("/events");
    return { success: true, data: announcement };
  } catch (error: any) {
    console.error("Error creating announcement:", error);
    return { success: false, message: error.message };
  }
}

export async function updateAnnouncement(id: number, input: unknown) {
  try {
    const data = AnnouncementSchema.partial().parse(input);
    const announcement = await db.announcement.update({ where: { id }, data });
    revalidatePath("/events");
    return { success: true, data: announcement };
  } catch (error: any) {
    console.error("Error updating announcement:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteAnnouncement(id: number) {
  try {
    await db.announcement.delete({ where: { id } });
    revalidatePath("/events");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting announcement:", error);
    return { success: false, message: error.message };
  }
}

// ==========================
// RSVP Actions
// ==========================
export async function respondToEvent(input: unknown) {
  try {
    const data = RSVPSchema.parse(input);

    // Upsert ensures unique staff/event RSVP
    const rsvp = await db.rSVP.upsert({
      where: {
        event_id_staff_id: { event_id: data.event_id, staff_id: data.staff_id },
      },
      update: { response: data.response },
      create: data,
    });

    revalidatePath("/events");
    return { success: true, data: rsvp };
  } catch (error: any) {
    console.error("Error responding to event:", error);
    return { success: false, message: error.message };
  }
}
