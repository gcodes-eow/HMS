// app/(protected)/rosters/view-rosters/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DutyRoster } from "@/types/rosters";
import { getRostersAction } from "@/app/actions/rosters";
import DutyRosterTable from "@/components/rosters/DutyRosterTable";
import { Button } from "@/components/ui/Button";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // side-effect import
import { format } from "date-fns";

// Safe formatter for shift times
function formatShiftTime(time?: string | Date | null) {
  if (!time) return "--:--";
  const date = new Date(time);
  return isNaN(date.getTime()) ? "--:--" : format(date, "HH:mm");
}

export default function ViewDutyRosters() {
  const [rosters, setRosters] = useState<DutyRoster[]>([]);

  const fetchRosters = async () => {
    const data = await getRostersAction();
    // Map shift times safely
    const mapped = data.map((r) => ({
      ...r,
      shift: {
        ...r.shift,
        start_time: formatShiftTime(r.shift?.start_time),
        end_time: formatShiftTime(r.shift?.end_time),
      },
    }));
    setRosters(mapped);
  };

  useEffect(() => {
    fetchRosters();
  }, []);

  // Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      rosters.map((r) => ({
        Date: r.date.toDateString(),
        Shift: `${r.shift.name} (${r.shift.start_time}-${r.shift.end_time})`,
        Department: r.staff?.department ?? r.doctor?.department ?? "-",
        Role: r.staff?.role ?? (r.doctor ? "Doctor" : "-"),
        Name: r.staff?.name ?? r.doctor?.name ?? "-",
        Status: r.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Duty Rosters");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "duty-rosters.xlsx");
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Shift", "Department", "Role", "Name", "Status"];
    const tableRows = rosters.map((r) => [
      r.date.toDateString(),
      `${r.shift.name} (${r.shift.start_time}-${r.shift.end_time})`,
      r.staff?.department ?? r.doctor?.department ?? "-",
      r.staff?.role ?? (r.doctor ? "Doctor" : "-"),
      r.staff?.name ?? r.doctor?.name ?? "-",
      r.status,
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("duty-rosters.pdf");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Duty Rosters</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            Save as Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            Save as PDF
          </Button>
        </div>
      </div>

      <DutyRosterTable rosters={rosters} readOnly /> {/* readOnly disables edit/delete */}
    </div>
  );
}
