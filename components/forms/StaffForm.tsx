// components/forms/StaffForm.tsx
"use client";

import { StaffSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";
import { Form } from "../ui/Form";
import { CustomInput } from "../CustomInput";
import { SPECIALIZATION } from "@/utils/settings";
import { toast } from "sonner";
import { createNewStaff } from "@/app/actions/admin";

const TYPES = [
  { label: "Nurse", value: "NURSE" },
  { label: "Receptionist", value: "RECEPTIONIST" },
  { label: "Cashier", value: "CASHIER" },
  { label: "Pharmacist", value: "PHARMACIST" },
  { label: "Lab Technician", value: "LABORATORY" },
];

export const StaffForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "NURSE",
      address: "",
      department: "",
      img: "",
      password: "",
      license_number: "",
    },
  });

  // ✅ Watch role field
  const selectedRole = form.watch("role");

  const handleSubmit = async (values: z.infer<typeof StaffSchema>) => {
    try {
      setIsLoading(true);
      const resp = await createNewStaff(values);

      if (resp.success) {
        toast.success("Staff added successfully!");
        form.reset();
        router.refresh();
      } else if (resp.error) {
        toast.error(resp.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus size={20} />
          New Staff
        </Button>
      </SheetTrigger>

      <SheetContent className="!w-full !max-w-[90vw] lg:!w-[80vw] xl:!w-[70vw] 2xl:!w-[60vw] overflow-y-scroll md:h-[90%] md:top-[5%] md:right-[1%] rounded-xl rounded-r-xl">
        <SheetHeader>
          <SheetTitle>Add New Staff</SheetTitle>
        </SheetHeader>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 mt-5 2xl:mt-10"
            >
              <CustomInput
                type="radio"
                selectList={TYPES}
                control={form.control}
                name="role"
                label="Type"
                placeholder=""
                defaultValue="NURSE"
              />

              <CustomInput
                type="input"
                control={form.control}
                name="name"
                placeholder="Staff name"
                label="Full Name"
              />

              <div className="flex flex-col md:flex-row items-center gap-2">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="email"
                  placeholder="john@example.com"
                  label="Email Address"
                />

                <CustomInput
                  type="input"
                  control={form.control}
                  name="phone"
                  placeholder="9225600735"
                  label="Contact Number"
                />
              </div>

              <CustomInput
                type="input"
                control={form.control}
                name="license_number"
                placeholder="License Number"
                label="License Number"
              />

              {/* ✅ Show specialization only for medical roles */}
              {["NURSE", "LABORATORY", "PHARMACIST"].includes(selectedRole) && (
                <CustomInput
                  type="select"
                  selectList={SPECIALIZATION}
                  control={form.control}
                  name="department"
                  label="Department / Specialization"
                  placeholder="Select a specialization"
                />
              )}

              <CustomInput
                type="input"
                control={form.control}
                name="address"
                placeholder="1479 Street, Apt 1839-G, NY"
                label="Address"
              />

              <CustomInput
                type="input"
                control={form.control}
                name="password"
                placeholder=""
                label="Password"
                inputType="password"
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};
