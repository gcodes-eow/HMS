// components/dialogs/EditMedication.tsx
"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  getMedicationById,
  updateMedicationAdministration,
} from "@/app/actions/medicalServices";
import { MedicationAdministration } from "@/types/dataTypes";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MedicationAdministrationSchema,
  MedicationAdministrationInput,
} from "@/lib/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/Form";
import { toast } from "sonner";

interface Props {
  medicationId: string;
  onUpdated?: () => void;
  trigger: React.ReactNode;
}

export function EditMedication({ medicationId, onUpdated, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState<string>("");

  const form = useForm<MedicationAdministrationInput>({
    resolver: zodResolver(MedicationAdministrationSchema),
    defaultValues: {
      patientId: "",
      staffId: "",
      doctorId: undefined,
      medication: "",
      dosage: "",
      administeredAt: new Date(),
      notes: "",
    },
  });

  const openModal = async () => {
    setIsOpen(true);
    setLoading(true);
    const res = await getMedicationById(medicationId);
    if (res.success && res.data) {
      const med: MedicationAdministration = res.data;
      setPatientName(med.patientName);
      form.reset({
        patientId: med.patientId,
        staffId: med.staffId,
        doctorId: med.doctorId,
        medication: med.medication,
        dosage: med.dosage,
        administeredAt: new Date(med.administeredAt),
        notes: med.notes ?? "",
      });
    } else {
      toast.error("Failed to fetch medication record");
    }
    setLoading(false);
  };

  const onSubmit: SubmitHandler<MedicationAdministrationInput> = async (
    values
  ) => {
    const res = await updateMedicationAdministration(medicationId, values);
    if (res.success) {
      toast.success("Medication record updated!");
      setIsOpen(false);
      onUpdated?.();
    } else {
      toast.error(res.message || "Failed to update medication");
    }
  };

  return (
    <>
      <span onClick={openModal}>{trigger}</span>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Medication Record"
      >
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Patient (read-only) */}
              <div>
                <FormLabel>Patient</FormLabel>
                <Input value={patientName} readOnly className="bg-gray-100" />
              </div>

              <FormField
                control={form.control}
                name="medication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="administeredAt"
                render={({ field }) => {
                  const value =
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : "";
                  return (
                    <FormItem>
                      <FormLabel>Administered At</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={value}
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

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
          </Form>
        )}
      </Modal>
    </>
  );
}
