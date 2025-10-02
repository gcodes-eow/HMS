"use client";

import React from "react";
import { Star } from "lucide-react";

export interface Rating {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  patient: { first_name: string; last_name: string };
}

interface RatingListProps {
  data: Rating[];
}

export const RatingList = ({ data }: RatingListProps) => {
  if (!data.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-gray-600 dark:text-gray-300">
        <h1 className="text-xl font-semibold mb-2">Patient Reviews</h1>
        <p>No Reviews</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Patient Reviews
        </h1>
      </div>

      <div className="space-y-2 p-2">
        {data.map((rate) => (
          <div
            key={rate.id}
            className="even:bg-gray-50 dark:even:bg-gray-800 p-3 rounded"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {rate.patient.first_name} {rate.patient.last_name}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(rate.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center text-yellow-600">
                  {Array.from({ length: rate.rating }, (_, i) => (
                    <Star key={i} className="text-lg" />
                  ))}
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  {rate.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {rate.comment && (
              <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">
                {rate.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
