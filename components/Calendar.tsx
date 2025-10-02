// components/Calendar.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Event, Announcement } from "@/types/events";
import { DutyRoster } from "@/types/rosters";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  setMonth,
  getDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ViewEventAnnouncement from "./dialogs/ViewEventAnnouncement";
import ViewDutyRosters from "./dialogs/ViewDutyRosters";
import { Button } from "./ui/Button";
import { getRostersAction } from "@/app/actions/rosters";

type CalendarItem = Event | Announcement | DutyRoster;

interface Props {
  events: CalendarItem[];
  role?: string;
}

export default function Calendar({ events: initialEvents, role }: Props) {
  const [events, setEvents] = useState<CalendarItem[]>(initialEvents);
  const [selected, setSelected] = useState<CalendarItem | null>(null);
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch latest rosters
  const refreshRosters = useCallback(async () => {
    try {
      const rosters = await getRostersAction();
      setEvents((prev) => {
        // Keep existing events but replace all DutyRosters
        const nonRosters = prev.filter((e) => !("date" in e));
        return [...nonRosters, ...rosters];
      });
    } catch (err) {
      console.error("Failed to refresh rosters", err);
    }
  }, []);

  useEffect(() => {
    refreshRosters();
  }, [refreshRosters]);

  const handlePrev = () => setCurrentDate((prev) => addMonths(prev, -1));
  const handleNext = () => setCurrentDate((prev) => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());
  const handleJumpToMonth = (monthIndex: number) =>
    setCurrentDate((prev) => setMonth(prev, monthIndex));

  const renderMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthStart);
    const start = startOfWeek(monthStart, { weekStartsOn: 0 });
    const end = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start, end });

    return (
      <div
        key={monthStart.toISOString()}
        className="border rounded-lg shadow-sm bg-white overflow-hidden"
      >
        <h3 className="text-center font-semibold py-2 text-sm md:text-base bg-gray-50 border-b">
          {format(monthStart, "MMMM yyyy")}
        </h3>

        <div className="grid grid-cols-7 text-[10px] md:text-sm font-medium text-gray-500 border-b">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={d}
              className={`p-1 text-center ${i === 0 || i === 6 ? "text-red-500" : ""}`}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayItems = events.filter((it) => {
              let date: Date;
              if ("start_date" in it) date = new Date(it.start_date);
              else if ("published_at" in it) date = new Date(it.published_at!);
              else if ("date" in it) date = new Date(it.date);
              else return false;
              return isSameDay(date, day);
            });

            const isToday = isSameDay(day, new Date());
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;

            return (
              <div
                key={day.toISOString()}
                className={`h-24 md:h-32 p-1 border text-[9px] md:text-[11px] relative
                  ${isSameMonth(day, monthStart) ? "bg-white" : "bg-gray-50"}
                  ${isWeekend ? "bg-gray-50 md:bg-gray-100" : ""} hover:shadow-md hover:bg-gray-100 transition`}
              >
                <p
                  className={`text-[10px] md:text-sm mb-0.5 ${
                    isToday
                      ? "bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto"
                      : "text-gray-600"
                  }`}
                >
                  {format(day, "d")}
                </p>

                <div className="space-y-0.5 overflow-hidden">
                  {dayItems.map((it) => {
                    let colorClass = "bg-gray-400";
                    let title = "Untitled";

                    if ("start_date" in it) {
                      colorClass = "bg-blue-500";
                      title = it.title;
                    } else if ("published_at" in it) {
                      colorClass = "bg-green-500";
                      title = it.title;
                    } else if ("date" in it && "shift" in it) {
                      colorClass = "bg-purple-500";
                      const staffOrDoctor = it.staff?.name || it.doctor?.name || "Unknown";
                      title = `${it.shift?.name ?? "Shift"} - ${staffOrDoctor}`;
                    }

                    return (
                      <button
                        key={it.id}
                        onClick={() => {
                          setSelected(it);
                          setOpen(true);
                        }}
                        className={`block w-full truncate rounded px-1 py-0.5 text-[8px] md:text-[10px] text-white ${colorClass} hover:scale-105 transform transition`}
                        title={title}
                      >
                        {title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const year = currentDate.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => format(new Date(year, i, 1), "MMMM"));

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-3 text-xs md:text-sm">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Event
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span> Announcement
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span> Duty Roster
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrev}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <select
            value={currentDate.getMonth()}
            onChange={(e) => handleJumpToMonth(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <span className="font-semibold">{year}</span>
      </div>

      <div className="max-w-full overflow-x-auto">{renderMonth(currentDate)}</div>

      {/* Modals */}
      {selected && "date" in selected ? (
        <ViewDutyRosters
          open={open}
          onClose={() => setOpen(false)}
          roster={selected as DutyRoster}
        />
      ) : selected ? (
        <ViewEventAnnouncement
          open={open}
          onOpenChange={setOpen}
          data={selected as Event | Announcement}
          role={role}
        />
      ) : null}
    </div>
  );
}
