"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PharmacistSchema } from "@/lib/schema";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type PharmacistFormData = z.infer<typeof PharmacistSchema>;

interface PharmacistFormProps {
  patientId: string;
}

export default function PharmacistForm({ patientId }: PharmacistFormProps) {
  const form = useForm<PharmacistFormData>({
    resolver: zodResolver(PharmacistSchema),
    defaultValues: {
      medication_name: "",
      dosage: "",
      quantity: 1,
      patient_id: patientId,
      prescription_date: new Date(),
      pharmacist_notes: "",
    },
  });

  const onSubmit = (data: PharmacistFormData) => {
    console.log("Pharmacist form data:", data);
    alert("Medication dispensed successfully!");
    // TODO: API call to submit form data
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl p-8 border rounded-lg shadow-md bg-white"
      >
        <FormField
          control={form.control}
          name="medication_name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1 font-semibold text-gray-700">
                Medication Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dosage"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1 font-semibold text-gray-700">
                Dosage
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., 500mg"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1 font-semibold text-gray-700">
                Quantity
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prescription_date"
          render={({ field }) => {
            const value =
              field.value instanceof Date
                ? field.value.toISOString().split("T")[0]
                : "";

            return (
              <FormItem className="flex flex-col">
                <FormLabel className="mb-1 font-semibold text-gray-700">
                  Prescription Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={value}
                    onChange={(e) => {
                      const dateValue = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      field.onChange(dateValue);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-600 mt-1" />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="pharmacist_notes"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="mb-1 font-semibold text-gray-700">
                Pharmacist Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Optional notes"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  rows={4}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-600 mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md transition-colors"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
