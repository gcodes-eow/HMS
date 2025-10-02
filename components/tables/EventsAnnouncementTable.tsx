// components/tables/EventsAnnouncementTable.tsx
"use client";

import React from "react";
import { Table } from "./Table";
import { Button } from "../ui/Button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Event, Announcement } from "@/types/events";
import { format } from "date-fns";
import { ActionDialog } from "../ActionDialog";

interface Props {
  data: (Event | Announcement)[];
  showActions?: boolean;
  onRefresh?: () => void;
}

const columns = [
  { header: "Type", key: "type" },
  { header: "Title", key: "title" },
  { header: "Date", key: "date" },
  { header: "Status", key: "status" },
  { header: "Actions", key: "action" },
];

export const EventsAnnouncementTable: React.FC<Props> = ({ data, showActions = true, onRefresh }) => {
  const renderRow = (item: Event | Announcement) => {
    const isEvent = "start_date" in item;
    const date = isEvent ? item.start_date : item.published_at;
    const status = isEvent ? item.status : item.status;

    return (
      <tr key={item.id} className="border-b border-border even:bg-muted text-sm hover:bg-accent">
        <td className="capitalize">{isEvent ? "Event" : "Announcement"}</td>
        <td className="font-semibold">{item.title}</td>
        <td>{date ? format(new Date(date), "yyyy-MM-dd") : ""}</td>
        <td>
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{status}</span>
        </td>
        <td>
          {showActions && (
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm">
                <Eye size={16} />
              </Button>
              <Button variant="warning" size="sm">
                <Pencil size={16} />
              </Button>
              <ActionDialog type="delete" id={String(item.id)} deleteType={isEvent ? "event" : "announcement"} onDeleted={onRefresh}>
                <Button variant="destructive" size="sm">
                  <Trash2 size={16} />
                </Button>
              </ActionDialog>
            </div>
          )}
        </td>
      </tr>
    );
  };

  return <Table columns={columns} renderRow={renderRow} data={data} />;
};
