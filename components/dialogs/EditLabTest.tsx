// components/dialogs/EditLabTest.tsx
"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { getLabTestById, updateLabTest } from "@/app/actions/laboratory";
import { LabTest } from "@/types/dataTypes";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateLabTestSchema, UpdateLabTestInput } from "@/lib/schema";
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
import { toast } from "sonner";

interface EditLabTestProps {
  labTestId: number;
  onUpdated?: () => void;
  trigger: React.ReactNode;
  services: { id: number; service_name: string }[];
}

export const EditLabTest: React.FC<EditLabTestProps> = ({
  labTestId,
  onUpdated,
  trigger,
  services,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState<string>("");

  const form = useForm<UpdateLabTestInput>({
    resolver: zodResolver(UpdateLabTestSchema),
    defaultValues: {
      technician_id: "",
      service_id: "",
      test_date: new Date(),
      result: "",
      units: "",
      reference_range: "",
      notes: "",
      status: "PENDING",
    },
  });

  const openModal = async () => {
    setIsOpen(true);
    setLoading(true);

    const res = await getLabTestById(labTestId);
    if (res.success && res.data) {
      const test: LabTest = res.data;

      setPatientName(
        `${test.medical_record.patient.first_name} ${test.medical_record.patient.last_name}`
      );

      form.reset({
        technician_id: test.technician?.id ?? "",
        service_id: test.services?.id ? String(test.services.id) : "",
        test_date: new Date(test.test_date),
        result: test.result ?? "",
        units: test.units ?? "",
        reference_range: test.reference_range ?? "",
        notes: test.notes ?? "",
        status: test.status ?? "PENDING",
      });
    } else {
      toast.error("Failed to fetch lab test data");
    }

    setLoading(false);
  };

  const onSubmit: SubmitHandler<UpdateLabTestInput> = async (values) => {
    const res = await updateLabTest(labTestId, values);
    if (res.success) {
      toast.success("Lab test updated!");
      setIsOpen(false);
      onUpdated?.();
    } else {
      toast.error(res.message || "Failed to update lab test");
    }
  };

  return (
    <>
      <span onClick={openModal}>{trigger}</span>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Lab Test">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <Form {...form}>
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Patient Name (read-only) */}
                <div>
                  <FormLabel>Patient</FormLabel>
                  <Input value={patientName} readOnly className="bg-gray-100" />
                </div>

                {/* Service */}
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

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
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
                        : field.value ?? "";
                    return (
                      <FormItem>
                        <FormLabel>Test Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={value}
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
                        <Input {...field} value={field.value ?? ""} placeholder="Enter result" />
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
                        <Input {...field} value={field.value ?? ""} placeholder="e.g. mg/dL" />
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
                        <Input {...field} value={field.value ?? ""} placeholder="e.g. 4.0 - 5.5" />
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
                          value={field.value ?? ""}
                          className="w-full border rounded p-2"
                          placeholder="Additional notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-blue-600 text-white">
                  Save Changes
                </Button>
              </form>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};
