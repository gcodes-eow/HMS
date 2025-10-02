// components/dialogs/ViewMedication.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { getMedicationById } from "@/app/actions/medicalServices";
import { MedicationAdministration } from "@/types/dataTypes";
import { Button } from "@/components/ui/Button";
import { Printer, FileDown } from "lucide-react";
import jsPDF from "jspdf";

interface Props {
  medicationId: string;
  trigger: React.ReactNode;
}

export function ViewMedication({ medicationId, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState<MedicationAdministration | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      getMedicationById(medicationId).then((res) => {
        if (res.success) setRecord(res.data ?? null);
      });
    }
  }, [isOpen, medicationId]);

  const handlePrint = () => {
    if (!contentRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Medication Record</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            h2 { margin-bottom: 16px; }
            p { margin: 4px 0; }
          </style>
        </head>
        <body>
          ${contentRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSavePDF = () => {
    if (!record) return;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Medication Record", 10, 15);

    doc.setFontSize(12);
    doc.text(`Patient: ${record.patientName}`, 10, 30);
    doc.text(`Medication: ${record.medication}`, 10, 40);
    doc.text(`Dosage: ${record.dosage}`, 10, 50);
    doc.text(
      `Administered At: ${new Date(record.administeredAt).toLocaleString()}`,
      10,
      60
    );
    doc.text(`Notes: ${record.notes ?? "—"}`, 10, 70);

    doc.save(`medication-${record.id}.pdf`);
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{trigger}</span>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Medication Details"
      >
        {record ? (
          <div className="space-y-4" ref={contentRef}>
            <h2 className="text-lg font-semibold">Medication Record</h2>
            <p>
              <strong>Patient:</strong> {record.patientName}
            </p>
            <p>
              <strong>Medication:</strong> {record.medication}
            </p>
            <p>
              <strong>Dosage:</strong> {record.dosage}
            </p>
            <p>
              <strong>Administered At:</strong>{" "}
              {new Date(record.administeredAt).toLocaleString()}
            </p>
            <p>
              <strong>Notes:</strong> {record.notes ?? "—"}
            </p>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handlePrint}
                className="bg-blue-600 text-white flex items-center"
              >
                <Printer size={16} className="mr-1" /> Print
              </Button>
              <Button
                onClick={handleSavePDF}
                className="bg-gray-600 text-white flex items-center"
              >
                <FileDown size={16} className="mr-1" /> Save as PDF
              </Button>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
}
