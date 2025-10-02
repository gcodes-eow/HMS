"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/Button";

interface PaginationProps {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  totalRecords,
  limit,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("p", page.toString());
      return params.toString();
    },
    [searchParams]
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(`${pathname}?${createQueryString(currentPage - 1)}`);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      router.push(`${pathname}?${createQueryString(currentPage + 1)}`);
    }
  };

  if (totalRecords === 0) return null;

  return (
    <div className="p-4 flex items-center justify-between text-gray-600 dark:text-gray-300 mt-5">
      <Button
        size="sm"
        variant="outline"
        disabled={currentPage === 1}
        onClick={handlePrevious}
        className="py-2 px-4 rounded-md bg-slate-200 dark:bg-slate-700 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </Button>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-xs lg:text-sm">
          Showing {currentPage * limit - (limit - 1)} to{" "}
          {currentPage * limit <= totalRecords
            ? currentPage * limit
            : totalRecords}{" "}
          of {totalRecords}
        </span>
      </div>

      <Button
        size="sm"
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className="py-2 px-4 rounded-md bg-slate-200 dark:bg-slate-700 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
};
