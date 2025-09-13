// components/RatingList.tsx
"use client";

import React from "react";
import { Star } from "lucide-react";
import { Rating } from "@/utils/services/doctor";

interface RatingListProps {
  data: Rating[];
}

export const RatingList = ({ data }: RatingListProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 text-gray-600">
        <h1 className="text-xl font-semibold mb-2">Patient Reviews</h1>
        <p>No Reviews</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold">Patient Reviews</h1>
      </div>

      <div className="space-y-2 p-2">
        {data.map((rate) => (
          <div key={rate.id} className="even:bg-gray-50 p-3 rounded">
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <p className="text-base font-medium">
                  {rate.patient.first_name} {rate.patient.last_name}
                </p>
                <span className="text-sm text-gray-500">
                  {new Date(rate.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center text-yellow-600">
                  {Array.from({ length: rate.rating }, (_, index) => (
                    <Star key={index} className="text-lg" />
                  ))}
                </div>
                <span>{rate.rating.toFixed(1)}</span>
              </div>
            </div>

            {rate.comment && (
              <p className="text-gray-700 mt-1 text-sm">{rate.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
