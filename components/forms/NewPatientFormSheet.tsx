// components/forms/NewPatientFormSheet.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { PatientForm } from "@/components/forms/PatientForm";

export const NewPatientFormSheet = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus size={20} />
          New Patient
        </Button>
      </SheetTrigger>

      <SheetContent
        className="!w-full !max-w-[90vw] lg:!w-[80vw] xl:!w-[70vw] 2xl:!w-[60vw] overflow-y-scroll md:h-[90%] md:top-[5%] md:right-[1%] rounded-xl rounded-r-xl"
      >
        <SheetHeader>
          <SheetTitle>Register New Patient</SheetTitle>
        </SheetHeader>

        <div className="pt-4">
          <PatientForm onSubmitSuccess={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
