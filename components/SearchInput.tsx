"use client";

import { Search } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchInput = ({
  placeholder = "Search...",
  value,
  onChange,
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState(value || "");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-600 px-2 py-2 rounded-md focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300 dark:focus-within:ring-blue-500 dark:focus-within:border-blue-500 bg-white dark:bg-gray-800">
      <Search size={18} className="text-gray-400 dark:text-gray-300" />
      <input
        type="text"
        className="outline-none px-2 text-sm w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchInput;
