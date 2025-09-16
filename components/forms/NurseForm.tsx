"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { VitalSigns } from "@/components/appointment/VitalSigns";
import { AddVitalSigns } from "@/components/dialogs/AddVitalSigns";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";

interface NurseFormProps {
  patientId: string;
  doctorId: string;
  appointmentId: string;
}

export default function NurseForm({
  patientId,
  doctorId,
  appointmentId,
}: NurseFormProps) {
  const [reload, setReload] = useState(false);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Patient Vital Signs",
  } as Parameters<typeof useReactToPrint>[0]);

  const handleRefresh = () => setReload(!reload);

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center print:hidden gap-4 sm:gap-0">
        <h2 className="text-2xl font-semibold">Nurse Dashboard – Vital Signs</h2>
        <div className="flex flex-wrap gap-2">
          <AddVitalSigns
            key={reload ? "reload-1" : "reload-2"}
            patientId={patientId}
            doctorId={doctorId}
            appointmentId={appointmentId}
            medicalId=""
            onSuccess={handleRefresh}
          />
          <Button onClick={handlePrint} variant="outline" className="flex items-center">
            <Printer className="w-5 h-5 mr-2" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div ref={componentRef}>
        <VitalSigns
          id={appointmentId}
          patientId={patientId}
          doctorId={doctorId}
        />
      </div>
    </div>
  );
}
