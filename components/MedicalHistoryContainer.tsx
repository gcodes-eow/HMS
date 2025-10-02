// components/MedicalHistoryContainer.tsx
import db from "@/lib/db";
import React from "react";
import { MedicalHistory } from "./MedicalHistory";

interface MedicalHistoryContainerProps {
  patientId: string;
}

export const MedicalHistoryContainer = async ({ patientId }: MedicalHistoryContainerProps) => {
  const records = await db.medicalRecords.findMany({
    where: { patient_id: patientId },
    include: {
      diagnosis: { include: { doctor: true } },
      lab_test: true,
    },
    orderBy: { created_at: "desc" },
  });

  return <MedicalHistory data={records} isShowProfile={false} />;
};
