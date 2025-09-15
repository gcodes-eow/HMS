// components/forms/BookAppointment.tsx
"use client";

import { z } from "zod";
import { AppointmentSchema } from "@/lib/schema";
import { generateTimes } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { ProfileImage } from "../ProfileImage";
import { CustomInput } from "../CustomInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { toast } from "sonner";
import { createAppointment } from "@/app/actions/appointment";

// ✅ Type-only import
import type { Patient, Doctor, Status, JOBTYPE } from "@/types/dataTypes";

const TYPES = [
  { label: "General Consultation", value: "General Consultation" },
  { label: "General Check Up", value: "General Check Up" },
  { label: "Pediatrics", value: "Pediatrics" },
  { label: "Antenatal", value: "Antenatal" },
  { label: "Maternity", value: "Maternity" },
  { label: "Gynecology", value: "Gynecology" },
  { label: "Cardiology", value: "Cardiology" },
  { label: "Dermatology", value: "Dermatology" },
  { label: "ENT (Ear, Nose, Throat)", value: "ENT" },
  { label: "Emergency / ER", value: "Emergency" },
  { label: "Ophthalmology", value: "Ophthalmology" },
  { label: "Orthopedics", value: "Orthopedics" },
  { label: "Neurology", value: "Neurology" },
  { label: "Psychiatry", value: "Psychiatry" },
  { label: "Dentistry", value: "Dentistry" },
  { label: "Physiotherapy", value: "Physiotherapy" },
  { label: "Nutrition/Dietician", value: "Nutrition" },
  { label: "Lab Test", value: "Lab Test" },
  { label: "Radiology / Imaging", value: "Radiology" },
  { label: "Vaccination / Immunization", value: "Vaccination" },
  { label: "Surgery / Operation", value: "Surgery" },
];

interface BookAppointmentFormProps {
  patient?: Patient;
  patients?: Patient[];
  doctors: (Doctor & { availability_status: Status; type: JOBTYPE })[];
  role: string;
}

export const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
  patient,
  patients = [],
  doctors,
  role,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const appointmentTimes = generateTimes(8, 17, 30);

  const defaultValues = useMemo(
    () => ({
      doctor_id: "",
      appointment_date: "",
      time: "",
      type: "",
      note: "",
      patient_id: patient?.id ?? "",
    }),
    [patient?.id]
  );

  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof AppointmentSchema>> = async (values) => {
    try {
      setIsSubmitting(true);
      const res = await createAppointment(values);
      if (res.success) {
        form.reset(defaultValues);
        router.refresh();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  useEffect(() => setHighlightedIndex(0), [filteredPatients]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!filteredPatients.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredPatients.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredPatients.length - 1));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredPatients[highlightedIndex];
        if (selected) form.setValue("patient_id", selected.id);
      }
    },
    [filteredPatients, highlightedIndex, form]
  );

  const safeImg = (img?: string | null) => img ?? undefined;
  const safeColor = (color?: string | null) => color ?? undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 2xl:mt-10">
        {/* Patient Info */}
        <div className="md:col-span-2">
          {role === "patient" && patient ? (
            <div className="w-full rounded-md border border-input bg-background px-3 py-1 flex items-center gap-4">
              <ProfileImage url={safeImg(patient.img)} name={`${patient.first_name} ${patient.last_name}`} className="size-16 border border-input" bgColor={safeColor(patient.colorCode)} />
              <div>
                <p className="font-semibold text-lg">{patient.first_name} {patient.last_name}</p>
                <span className="text-sm text-gray-500 capitalize">{patient.gender}</span>
              </div>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" onKeyDown={handleKeyDown} ref={listRef}>
                        <div className="p-2 sticky top-0 bg-white z-10">
                          <Input placeholder="Type to search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full mb-2" />
                        </div>
                        {filteredPatients.length ? (
                          filteredPatients.map((p, idx) => (
                            <SelectItem key={p.id} value={p.id} className={highlightedIndex === idx ? "bg-blue-100" : undefined}>
                              <div className="flex items-center gap-2 p-2">
                                <ProfileImage url={safeImg(p.img)} name={`${p.first_name} ${p.last_name}`} bgColor={safeColor(p.colorCode)} textClassName="text-black" className="size-8" />
                                <div>
                                  <p className="font-medium">{p.first_name} {p.last_name}</p>
                                  <span className="text-sm text-gray-600">{p.gender}</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-4 text-sm text-gray-500">No matching patients</div>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Appointment Type */}
        <CustomInput type="select" selectList={TYPES} control={form.control} name="type" label="Appointment Type" placeholder="Select an appointment type" />

        {/* Doctor Select */}
        <CustomInput type="select" selectList={doctors.map(d => ({ label: d.name, value: d.id }))} control={form.control} name="doctor_id" label="Physician" placeholder="Select a doctor" />

        {/* Date */}
        <CustomInput type="input" control={form.control} name="appointment_date" label="Date" inputType="date" />

        {/* Time */}
        <CustomInput type="select" control={form.control} name="time" label="Time" selectList={appointmentTimes} placeholder="Select time" />

        {/* Note */}
        <div className="md:col-span-2">
          <CustomInput type="textarea" control={form.control} name="note" label="Additional Note" placeholder="Additional note" />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <Button disabled={isSubmitting} type="submit" className="bg-blue-600 w-full">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
