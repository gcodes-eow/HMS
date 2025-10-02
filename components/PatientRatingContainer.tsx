// components/PatientRatingContainer.tsx
import db from "@/lib/db";
import React from "react";
import { RatingList } from "./RatingList";

export interface Rating {
  id: string; // keep as string for frontend consistency
  rating: number;
  comment?: string | null;
  created_at: Date;
  patient: { first_name: string; last_name: string };
}

interface PatientRatingContainerProps {
  entityId: string;              // can be patientId or doctorId
  entityType?: "patient" | "doctor"; // default is "patient"
}

const PatientRatingContainer = async ({
  entityId,
  entityType = "patient",
}: PatientRatingContainerProps) => {
  const whereClause =
    entityType === "patient"
      ? { patient_id: entityId }
      : { doctor_id: entityId };

  const dataFromDb = await db.rating.findMany({
    where: whereClause,
    include: { patient: { select: { first_name: true, last_name: true } } },
    orderBy: { created_at: "desc" },
    take: 10,
  });

  if (!dataFromDb.length) {
    return (
      <div className="bg-white p-4 rounded-md text-gray-500 text-center">
        No reviews available
      </div>
    );
  }

  // Convert Prisma results to frontend Rating type
  const data: Rating[] = dataFromDb.map(r => ({
    ...r,
    id: r.id.toString(),          // convert number to string
  }));

  return (
    <RatingList
      data={data.map(r => ({
        ...r,
        createdAt: r.created_at.toISOString(), // convert Date to string for RatingList
      }))}
    />
  );
};

export default PatientRatingContainer;
