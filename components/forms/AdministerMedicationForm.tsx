// components/forms/AdministerMedicationForm.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createMedicationAdministration } from "@/app/actions/medicalServices";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";
import { ProfileImage } from "../ProfileImage";

const schema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  staffId: z.string().min(1, "Staff is required"),
  medication: z.string().min(1, "Medication is required"),
  dosage: z.string().min(1, "Dosage is required"),
  administeredAt: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  patients: {
    id: string;
    first_name: string;
    last_name: string;
    gender?: string;
    img?: string;
    colorCode?: string;
  }[];
  staff: { id: string; name: string; role: string }[];
  currentStaffId?: string; // ✅ logged-in staff
  onSuccess: (record: any) => void;
}

export function AdministerMedicationForm({
  patients,
  staff,
  currentStaffId,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      staffId: currentStaffId || "", // ✅ pre-select current staff
    },
  });

  // ✅ Reorder staff: logged-in staff first, others follow
  const orderedStaff = useMemo(() => {
    if (!currentStaffId) return staff;
    const current = staff.find((s) => s.id === currentStaffId);
    const others = staff.filter((s) => s.id !== currentStaffId);
    return current ? [current, ...others] : staff;
  }, [staff, currentStaffId]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter((p) =>
      `${p.first_name} ${p.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

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
      if (selected) {
        setValue("patientId", selected.id);
        setSearchTerm(""); // reset search after selection
      }
    }
  };

  useEffect(() => setHighlightedIndex(0), [searchTerm]);

  useEffect(() => {
    const el = listRef.current?.children[highlightedIndex + 1] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const payload = { ...data, administeredAt: new Date(data.administeredAt) };
      const result = await createMedicationAdministration(payload);

      if (result.success) {
        onSuccess(result.data);
        reset({ staffId: currentStaffId || "" }); // keep staff pre-selected
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-4 rounded-lg shadow"
    >
      {/* Patient */}
      <div>
        <label className="block mb-1 font-medium">Patient</label>
        <Select
          value={getValues("patientId") || ""}
          onValueChange={(val) => setValue("patientId", val)}
        >
          <SelectTrigger className="w-full">
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
                      url={p.img}
                      name={`${p.first_name} ${p.last_name}`}
                      bgColor={p.colorCode}
                    />
                    <div>
                      <p>
                        {p.first_name} {p.last_name}
                      </p>
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
        {errors.patientId && (
          <p className="text-red-500 text-sm">{errors.patientId.message}</p>
        )}
      </div>

      {/* Staff */}
      <div>
        <label className="block mb-1 font-medium">
          Staff (Doctor, Nurse, Pharmacist)
        </label>
        <Select
          value={getValues("staffId") || ""}
          onValueChange={(val) => setValue("staffId", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select staff" />
          </SelectTrigger>
          <SelectContent>
            {orderedStaff.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name} ({s.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.staffId && (
          <p className="text-red-500 text-sm">{errors.staffId.message}</p>
        )}
      </div>

      {/* Medication */}
      <div>
        <label className="block mb-1 font-medium">Medication</label>
        <Input {...register("medication")} placeholder="Medication name" />
        {errors.medication && (
          <p className="text-red-500 text-sm">{errors.medication.message}</p>
        )}
      </div>

      {/* Dosage */}
      <div>
        <label className="block mb-1 font-medium">Dosage</label>
        <Input {...register("dosage")} placeholder="Dosage (e.g., 500mg)" />
        {errors.dosage && (
          <p className="text-red-500 text-sm">{errors.dosage.message}</p>
        )}
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
