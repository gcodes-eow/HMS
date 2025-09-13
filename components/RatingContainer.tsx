// components/RatingContainer.tsx
"use client";

import React from "react";
import { getRatingById, RatingData } from "@/utils/services/doctor";
import { RatingList } from "./RatingList";
import { RatingChart } from "./charts/RatingChart";

interface RatingContainerProps {
  id: string;
}

export const RatingContainer = async ({ id }: RatingContainerProps) => {
  const res = await getRatingById(id);
  const ratingsData: RatingData | null | undefined = res.data;

  if (!ratingsData) {
    return <p className="text-gray-600">No ratings found.</p>;
  }

  const { ratings, totalRatings, averageRating } = ratingsData;

  return (
    <div className="space-y-4">
      <RatingChart
        totalRatings={totalRatings}
        averageRating={Number(averageRating)}
      />
      <RatingList data={ratings} />
    </div>
  );
};
