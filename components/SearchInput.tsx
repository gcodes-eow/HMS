// components/SearchInput.tsx
"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string; // for controlled input
  onChange?: (value: string) => void; // to update parent (react-hook-form or parent state)
}

const SearchInput = ({ placeholder = "Search...", value, onChange }: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="flex items-center border border-gray-300 px-2 py-2 rounded-md focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300">
      <Search size={18} className="text-gray-400" />
      <input
        type="text"
        className="outline-none px-2 text-sm w-full bg-transparent"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchInput;
