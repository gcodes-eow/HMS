// components/dialogs/ViewAnnouncement.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Event, Announcement } from "@/types/events";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Event | Announcement | null;
  role?: string; // optional role prop to check permissions
}

export default function ViewEventAnnouncement({ open, onOpenChange, data, role }: Props) {
  if (!data) return null;

  const isEvent = "start_date" in data;
  const canEdit = role && ["admin", "manager"].includes(role.toLowerCase());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View {isEvent ? "Event" : "Announcement"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-semibold">{data.title}</p>
          </div>
          {isEvent ? (
            <>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p>{(data as Event).description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p>{data.start_date ? format(new Date(data.start_date), "PPpp") : "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p>{data.end_date ? format(new Date(data.end_date), "PPpp") : "-"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p>{(data as Event).location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{data.status}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500">Message</p>
                <p>{(data as Announcement).message}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p>{data.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Published At</p>
                <p>{(data as Announcement).published_at ? format(new Date((data as Announcement).published_at!), "PPpp") : "-"}</p>
              </div>
            </>
          )}

          {canEdit && (
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Edit</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
