// components/forms/LabTestForm.tsx
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLabTestSchema, CreateLabTestInput } from "@/lib/schema";
import { createLabTest } from "@/app/actions/laboratory";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/Form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/Select";
import { ProfileImage } from "../ProfileImage";
import { useUser } from "@clerk/nextjs";

interface LabTestFormProps {
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    gender: string;
    img?: string;
    colorCode?: string;
  }[];
  services: {
    id: number;
    service_name: string;
  }[];
}

const LabTestForm: React.FC<LabTestFormProps> = ({ patients, services }) => {
  const { user } = useUser();
  const technicianId = user?.id ?? "";

  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const form = useForm<CreateLabTestInput>({
    resolver: zodResolver(CreateLabTestSchema),
    defaultValues: {
      technician_id: technicianId,
      patient_id: "",
      service_id: "",
      test_date: new Date(),
      result: "",
      units: "",
      reference_range: "",
      notes: "",
      status: "COMPLETED", // ✅ default status is now COMPLETED
    },
  });

  useEffect(() => {
    if (technicianId) {
      form.setValue("technician_id", technicianId);
    }
  }, [technicianId, form]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const onSubmit: SubmitHandler<CreateLabTestInput> = async (values) => {
    const res = await createLabTest(values);
    if (res.success) {
      toast.success("Lab test recorded successfully!");
      form.reset({ ...form.getValues(), patient_id: "", service_id: "" });
    } else {
      toast.error(res.message || "Failed to create lab test");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!filteredPatients.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredPatients.length - 1 ? prev + 1 : 0
      );
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredPatients.length - 1
      );
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredPatients[highlightedIndex];
      if (selected) form.setValue("patient_id", selected.id);
    }
  };

  useEffect(() => setHighlightedIndex(0), [searchTerm]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Patient selection */}
        <FormField
          control={form.control}
          name="patient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <FormControl>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
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
                        autoFocus
                      />
                    </div>
                    {filteredPatients.length > 0 ? (
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
                            />
                            <div>
                              <p>{p.first_name} {p.last_name}</p>
                              <span className="text-sm text-gray-500">{p.gender}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-gray-500">No matching patients</div>
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service selection */}
        <FormField
          control={form.control}
          name="service_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <FormControl>
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.service_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Test Date */}
        <FormField
          control={form.control}
          name="test_date"
          render={({ field }) => {
            const value =
              field.value instanceof Date
                ? field.value.toISOString().split("T")[0]
                : field.value;
            return (
              <FormItem>
                <FormLabel>Test Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={value ?? ""}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Result */}
        <FormField
          control={form.control}
          name="result"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Result</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter result" value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Units */}
        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Units</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Units (optional)" value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reference Range */}
        <FormField
          control={form.control}
          name="reference_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Range</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. 4.0 - 5.5" value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="w-full border rounded p-2"
                  placeholder="Additional notes"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-blue-600 text-white">
          Submit Lab Test
        </Button>
      </form>
    </Form>
  );
};

export default LabTestForm;
