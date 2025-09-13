// components/filters/DoctorsToolbar.tsx
"use client";

import React from "react";
import SearchInput from "@/components/SearchInput";
import { DoctorForm } from "@/components/forms/DoctorForm";

interface Props {
  isAdmin: boolean;
}

export const DoctorsToolbar: React.FC<Props> = ({ isAdmin }) => {
  return (
    <div className="w-full lg:w-fit flex items-center justify-between lg:justify-start gap-2">
      <SearchInput />
      {isAdmin && <DoctorForm />}
    </div>
  );
};
