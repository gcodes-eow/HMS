// components/filters/PatientListToolbar.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { X } from "lucide-react";

interface PatientListToolbarProps {
  searchParamKey?: string;  // default "search"
  filterParamKey?: string;  // default "gender"
  sortParamKey?: string;    // default "sort"
  filterOptions?: { value: string; label: string }[]; // optional, default gender options
  filterPlaceholder?: string; // e.g. "Filter Status"
  sortOptions?: { value: string; label: string }[];   // optional, default sort options
}

export const PatientListToolbar = ({
  searchParamKey = "search",
  filterParamKey = "gender",
  sortParamKey = "sort",
  filterOptions,
  filterPlaceholder,
  sortOptions,
}: PatientListToolbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchValue = searchParams.get(searchParamKey) || "";
  const filterValue = searchParams.get(filterParamKey) || "all";
  const sortValue = searchParams.get(sortParamKey) || "newest";

  const [search, setSearch] = useState(searchValue);

  const updateQueryString = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all" || value === "newest") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("p", "1"); // Always reset to page 1
    return params.toString();
  }, [searchParams]);

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

  // Default filter options (gender) if none provided
  const defaultFilterOptions = [
    { value: "all", label: "All" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  // Default sort options
  const defaultSortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "name_asc", label: "Name A → Z" },
    { value: "name_desc", label: "Name Z → A" },
  ];

  const currentFilterOptions = filterOptions || defaultFilterOptions;
  const currentSortOptions = sortOptions || defaultSortOptions;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-md shadow-sm border">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex w-full md:w-1/3 items-center gap-2">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or phone"
        />
        <Button type="submit">Search</Button>
      </form>

      {/* Filter */}
      <Select onValueChange={handleFilterChange} defaultValue={filterValue}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={filterPlaceholder || "Filter"} />
        </SelectTrigger>
        <SelectContent>
          {currentFilterOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select onValueChange={handleSortChange} defaultValue={sortValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {currentSortOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {(searchValue !== "" || (filterValue !== "all" && filterValue !== "") || (sortValue !== "newest" && sortValue !== "")) && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600">
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};
