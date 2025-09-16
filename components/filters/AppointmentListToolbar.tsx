// components/filters/AppointmentListToolbar.tsx
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useCallback, useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { AppointmentStatus, Doctor, Patient } from "@prisma/client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Plus, X } from "lucide-react";
import { BookAppointmentForm } from "@/components/forms/BookAppointment";
import type { ServiceResponse } from "@/utils/services/patient";

interface AppointmentListToolbarProps {
  searchParamKey?: string;
  filterParamKey?: string;
  filterPlaceholder?: string;
  sortParamKey?: string;
  sortOptions?: { value: string; label: string }[];
  patientResponse?: ServiceResponse<any>;
  patientsResponse?: ServiceResponse<Patient[]>;
  doctorsResponse?: ServiceResponse<Doctor[]>;
  role?: string;
}

export const AppointmentListToolbar: React.FC<AppointmentListToolbarProps> = ({
  searchParamKey = "q",
  filterParamKey = "status",
  filterPlaceholder = "Filter by status",
  sortParamKey = "sort",
  sortOptions = [],
  patientResponse,
  patientsResponse,
  doctorsResponse,
  role,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const ALL_VALUE = "all";

  const searchValue = searchParams.get(searchParamKey) || "";
  const filterValue = searchParams.get(filterParamKey) || ALL_VALUE;
  const sortValue = searchParams.get(sortParamKey) || "";

  const [search, setSearch] = useState(searchValue);

  const updateQueryString = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === ALL_VALUE || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      params.set("p", "1"); // reset to page 1
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?${updateQueryString(searchParamKey, search)}`);
  };

  const handleFilterChange = (value: string) => {
    router.push(`${pathname}?${updateQueryString(filterParamKey, value)}`);
  };

  const handleSortChange = (value: string) => {
    router.push(`${pathname}?${updateQueryString(sortParamKey, value)}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  useEffect(() => {
    setSearch(searchValue);
  }, [searchValue]);

  const patient = patientResponse?.success ? patientResponse.data : undefined;
  const patients = patientsResponse?.success ? patientsResponse.data ?? [] : [];
  const doctors = doctorsResponse?.success ? doctorsResponse.data ?? [] : [];

  const showBookButton =
    doctors.length > 0 && (role?.toLowerCase() !== "patient" || patient);

  return (
    <div className="flex flex-wrap gap-2 items-center w-full lg:w-fit">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search appointments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-48"
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Filter Select */}
      <Select onValueChange={handleFilterChange} defaultValue={filterValue}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={filterPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All</SelectItem>
          {Object.values(AppointmentStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Select */}
      {sortOptions.length > 0 && (
        <Select onValueChange={handleSortChange} defaultValue={sortValue}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Clear Filters */}
      {(searchValue !== "" ||
        (filterValue !== ALL_VALUE && filterValue !== "") ||
        (sortValue !== "" && sortValue !== "newest")) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-red-600"
        >
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </Button>
      )}

      {/* Book Appointment Sheet */}
      {showBookButton && (
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90">
              <Plus size={20} className="mr-1" />
              Book Appointment
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-full !max-w-[90vw] lg:!w-[80vw] xl:!w-[70vw] 2xl:!w-[60vw] overflow-y-scroll md:h-[90%] md:top-[5%] md:right-[1%] rounded-xl">
            <SheetHeader>
              <SheetTitle>
                Book an appointment with our health care professional
              </SheetTitle>
            </SheetHeader>
            <BookAppointmentForm
              patient={role?.toLowerCase() === "patient" ? patient : undefined}
              patients={
                role?.toLowerCase() !== "patient" ? patients : undefined
              }
              doctors={doctors}
              role={role || ""}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
