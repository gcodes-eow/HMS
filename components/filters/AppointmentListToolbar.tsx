// components/filters/AppointmentListToolbar.tsx
"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/Sheet";
import { BookAppointmentForm } from "@/components/forms/BookAppointment";
import { AppointmentStatus } from "@/types/dataTypes"; // value import
import type { Doctor, Patient } from "@/types/dataTypes";

interface AppointmentListToolbarProps {
  searchParamKey?: string;
  filterParamKey?: string;
  filterPlaceholder?: string;
  sortParamKey?: string;
  sortOptions?: { value: string; label: string }[];
  patient?: Patient;
  patients?: Patient[];
  doctors?: Doctor[];
  role?: string;
}

export const AppointmentListToolbar: React.FC<AppointmentListToolbarProps> = ({
  searchParamKey = "q",
  filterParamKey = "status",
  filterPlaceholder = "Filter by status",
  sortParamKey = "sort",
  sortOptions = [],
  patient,
  patients = [],
  doctors = [],
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
      if (value === ALL_VALUE || value === "") params.delete(key);
      else params.set(key, value);
      params.set("p", "1"); // reset page
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?${updateQueryString(searchParamKey, search)}`);
  };

  const handleChange = (key: string) => (value: string) => {
    router.push(`${pathname}?${updateQueryString(key, value)}`);
  };

  const clearFilters = () => router.push(pathname);

  useEffect(() => setSearch(searchValue), [searchValue]);

  const showBookButton = doctors.length > 0 && (role?.toLowerCase() !== "user" || patient);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!patient && inputRef.current) inputRef.current.focus();
  }, [patient]);

  // --- Reusable Select Dropdown Component ---
  const Dropdown: React.FC<{
    value: string;
    placeholder: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }> = ({ value, placeholder, options, onChange }) => (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  // Prepare options
  const statusOptions = [
    { value: ALL_VALUE, label: "All" },
    ...Object.values(AppointmentStatus).map((status) => ({
      value: status,
      label: status.charAt(0) + status.slice(1).toLowerCase(),
    })),
  ];

  const sortDropdownOptions = sortOptions.length
    ? sortOptions
    : [];

  return (
    <div className="flex flex-wrap gap-2 items-center w-full lg:w-fit">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search appointments..."
          className="w-48"
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Filter by status */}
      <Dropdown
        value={filterValue}
        placeholder={filterPlaceholder}
        options={statusOptions}
        onChange={handleChange(filterParamKey)}
      />

      {/* Sort */}
      {sortDropdownOptions.length > 0 && (
        <Dropdown
          value={sortValue}
          placeholder="Sort by"
          options={sortDropdownOptions}
          onChange={handleChange(sortParamKey)}
        />
      )}

      {/* Clear filters */}
      {(searchValue || filterValue !== ALL_VALUE || (sortValue && sortValue !== "newest")) && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
          <X className="w-4 h-4 mr-1" /> Clear Filters
        </Button>
      )}

      {/* Book Appointment */}
      {showBookButton && (
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-black text-white hover:bg-black/90">
              <Plus size={20} className="mr-1" /> Book Appointment
            </Button>
          </SheetTrigger>
          <SheetContent className="!w-full !max-w-[90vw] lg:!w-[80vw] xl:!w-[70vw] 2xl:!w-[60vw] overflow-y-scroll md:h-[90%] md:top-[5%] md:right-[1%] rounded-xl">
            <SheetHeader>
              <SheetTitle>Book an appointment with our health care professional</SheetTitle>
            </SheetHeader>
            <BookAppointmentForm
              patient={role?.toLowerCase() === "user" ? patient : undefined}
              patients={role?.toLowerCase() !== "user" ? patients || [] : []}
              doctors={doctors}
              role={role || ""}
            />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};
