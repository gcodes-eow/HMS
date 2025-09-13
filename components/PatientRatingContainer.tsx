// components/PatientRatingContainer.tsx
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { RatingList } from "./RatingList";
import React from "react";

// Accept patientId as prop to fetch the ratings data
interface PatientRatingContainerProps {
  patientId: string; // Use patientId to fetch data
  data: any[]; // Ratings data passed from getServerSideProps
}

// Server-Side Fetching for Patient Ratings
export async function getServerSideProps(context: { params: { patientId: string } }) {
  const { patientId } = context.params;

  const { userId } = await auth();

  // Fetch ratings data for the given patient
  const data = await db.rating.findMany({
    where: { patient_id: patientId || userId! },
    include: { patient: { select: { last_name: true, first_name: true } } },
    orderBy: { created_at: "desc" },
    take: 10,
  });

  if (!data) {
    return { notFound: true }; // Optional: Return 404 if no ratings found
  }

  return {
    props: {
      patientId,
      data,
    },
  };
}

const PatientRatingContainer = ({ data }: PatientRatingContainerProps) => {
  if (!data.length) return <div>No reviews available</div>;

  return (
    <div>
      <RatingList data={data} />
    </div>
  );
};

export default PatientRatingContainer;
