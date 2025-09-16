// components/inventory/inventory-filters.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface InventoryFiltersProps {
  defaultSearch?: string;
  defaultCategory?: string;
  defaultSort?: string;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  defaultSearch = "",
  defaultCategory = "",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(defaultSearch);

  const currentCategory = searchParams.get("category") || defaultCategory;

  // Sync input with query param
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("p", "1"); // reset page
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 items-center mb-4">
      <input
        type="text"
        placeholder="Search inventory..."
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          updateParam("search", value);
        }}
        className="border rounded px-3 py-2 w-64"
      />

      <select
        value={currentCategory}
        onChange={(e) => updateParam("category", e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="">All Categories</option>
        <option value="MEDICATION">Medication</option>
        <option value="CONSUMABLE">Consumable</option>
        <option value="EQUIPMENT">Equipment</option>
        <option value="OTHER">Other</option>
      </select>
    </div>
  );
};

export default InventoryFilters;
