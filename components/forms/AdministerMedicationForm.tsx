// components/forms/AdministerMedicationForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { administerMedication } from "@/app/actions/nurse";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/Select";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  medication: z.string().min(1, "Medication is required"),
  dosage: z.string().min(1, "Dosage is required"),
  administeredAt: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  patients: { id: string; first_name: string; last_name: string }[];
  onSuccess: (record: any) => void; // pass new record back to parent
}

export function AdministerMedicationForm({ patients, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        administeredAt: new Date(data.administeredAt),
      };
      const result = await administerMedication(payload);

      if (result.success) {
        // ✅ Pass the new record back to parent
        onSuccess(result.data);
        reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Failed to record medication:", error);
      alert("Failed to record medication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-lg shadow">
      {/* Patient */}
      <div>
        <label className="block mb-1 font-medium">Patient</label>
        <Select {...register("patientId")}>
          <SelectTrigger className="w-full">
            <span>Select a patient</span>
          </SelectTrigger>
          <SelectContent>
            {patients.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.first_name} {p.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.patientId && <p className="text-red-500 text-sm">{errors.patientId.message}</p>}
      </div>

      {/* Medication */}
      <div>
        <label className="block mb-1 font-medium">Medication</label>
        <Input {...register("medication")} placeholder="Medication name" />
        {errors.medication && <p className="text-red-500 text-sm">{errors.medication.message}</p>}
      </div>

      {/* Dosage */}
      <div>
        <label className="block mb-1 font-medium">Dosage</label>
        <Input {...register("dosage")} placeholder="Dosage (e.g., 500mg)" />
        {errors.dosage && <p className="text-red-500 text-sm">{errors.dosage.message}</p>}
      </div>

      {/* Time */}
      <div>
        <label className="block mb-1 font-medium">Time</label>
        <Input type="datetime-local" {...register("administeredAt")} />
        {errors.administeredAt && (
          <p className="text-red-500 text-sm">{errors.administeredAt.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-1 font-medium">Notes</label>
        <Input {...register("notes")} placeholder="Optional notes" />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Record Medication"}
      </Button>
    </form>
  );
}
