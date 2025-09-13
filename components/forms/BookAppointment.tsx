"use client";

import { AppointmentSchema } from "@/lib/schema";
import { generateTimes } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Doctor, Patient } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { z } from "zod";
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
  doctors: Doctor[];
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

  // Memoize default values so they don't trigger re-renders
  const defaultValues = useMemo(() => ({
    doctor_id: "",
    appointment_date: "",
    time: "",
    type: "",
    note: "",
    patient_id: patient?.id ?? "",
  }), [patient?.id]);

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

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter(p =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  // Reset highlighted index whenever the filtered list changes
  useEffect(() => setHighlightedIndex(0), [filteredPatients]);

  // Keyboard navigation for patient dropdown
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!filteredPatients.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredPatients.length - 1 ? prev + 1 : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredPatients.length - 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredPatients[highlightedIndex];
      if (selected) form.setValue("patient_id", selected.id);
    }
  }, [filteredPatients, highlightedIndex, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 2xl:mt-10">
        {/* Patient Info / Select */}
        <div className="md:col-span-2">
          {role === "patient" && patient ? (
            <div className="w-full rounded-md border border-input bg-background px-3 py-1 flex items-center gap-4">
              <ProfileImage
                url={patient.img ?? undefined}
                name={`${patient.first_name} ${patient.last_name}`}
                className="size-16 border border-input"
                bgColor={patient.colorCode ?? undefined}
              />
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
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting} // No controlled open state
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent
                        className="max-h-60 overflow-y-auto"
                        onKeyDown={handleKeyDown}
                        ref={listRef}
                      >
                        <div className="p-2 sticky top-0 bg-white z-10">
                          <Input
                            placeholder="Type to search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mb-2"
                          />
                        </div>

                        {filteredPatients.length ? (
                          filteredPatients.map((p, idx) => (
                            <SelectItem
                              key={p.id}
                              value={p.id}
                              className={highlightedIndex === idx ? "bg-blue-100" : undefined}
                            >
                              <div className="flex items-center gap-2 p-2">
                                <ProfileImage
                                  url={p.img ?? undefined}
                                  name={`${p.first_name} ${p.last_name}`}
                                  bgColor={p.colorCode ?? undefined}
                                  textClassName="text-black"
                                  className="size-8"
                                />
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
        <CustomInput
          type="select"
          selectList={TYPES}
          control={form.control}
          name="type"
          label="Appointment Type"
          placeholder="Select an appointment type"
        />

        {/* Physician */}
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>

                  <SelectContent className="max-h-60 overflow-y-auto">
                    {/* Search input */}
                    <div className="p-2 sticky top-0 bg-white z-10">
                      <Input
                        placeholder="Type to search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full mb-2"
                      />
                    </div>

                    {patients
                      .filter((p) =>
                        `${p.first_name} ${p.last_name}`
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <div className="flex items-center gap-2 p-2">
                            <ProfileImage
                              url={p.img ?? undefined}
                              name={`${p.first_name} ${p.last_name}`}
                              bgColor={p.colorCode ?? undefined}
                              textClassName="text-black"
                              className="size-8"
                            />
                            <div>
                              <p className="font-medium">{p.first_name} {p.last_name}</p>
                              <span className="text-sm text-gray-600">{p.gender}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}

                    {patients.filter((p) =>
                      `${p.first_name} ${p.last_name}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                      <div className="px-2 py-4 text-sm text-gray-500">No matching patients</div>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Date */}
        <CustomInput
          type="input"
          control={form.control}
          name="appointment_date"
          placeholder=""
          label="Date"
          inputType="date"
        />

        {/* Time */}
        <CustomInput
          type="select"
          control={form.control}
          name="time"
          placeholder="Select time"
          label="Time"
          selectList={appointmentTimes}
        />

        {/* Note */}
        <div className="md:col-span-2">
          <CustomInput
            type="textarea"
            control={form.control}
            name="note"
            placeholder="Additional note"
            label="Additional Note"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="bg-blue-600 w-full"
          >
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
