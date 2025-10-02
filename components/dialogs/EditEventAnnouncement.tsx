// components/dialogs/EditAnnouncement.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import EventAnnouncementForm from "../events/EventAnnouncementForm";
import { Event, Announcement } from "@/types/events";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Event | Announcement | null;
}

export default function EditEventAnnouncement({ open, onOpenChange, data }: Props) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {("start_date" in data ? "Event" : "Announcement")}</DialogTitle>
        </DialogHeader>
        <EventAnnouncementForm initialData={data} mode="edit" onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
