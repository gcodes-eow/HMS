// components/NewPatient.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { Patient } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Form } from "./ui/Form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormSchema } from "@/lib/schema";
import { z } from "zod";
import { CustomInput } from "./CustomInput";
import { GENDER, MARITAL_STATUS, RELATION } from "@/lib";
import { Button } from "./ui/Button";
import { createNewPatient, updatePatient } from "@/app/actions/patient";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";

interface DataProps {
  data?: Patient;
  type: "create" | "update";
  isReceptionist?: boolean;
}

// Fix: Extend form data type with correct unions for marital_status and relation
type PatientFormValues = z.infer<typeof PatientFormSchema> & {
  marital_status: typeof MARITAL_STATUS[number]["value"]; // e.g. "married" | "single" | ...
  relation: typeof RELATION[number]["value"]; // e.g. "mother" | "father" | ...
};

export const NewPatient = ({
  data,
  type,
  isReceptionist = false,
}: DataProps) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const userId = user?.id;

  const userData = !isReceptionist
    ? {
        first_name: user?.firstName || "",
        last_name: user?.lastName || "",
        email: user?.emailAddresses[0]?.emailAddress || "",
        phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
      }
    : {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      };

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      ...userData,
      address: "",
      date_of_birth: new Date(),
      gender: "MALE",
      marital_status: "single", // matches union type now
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "mother", // matches union type now
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      insurance_number: "",
      insurance_provider: "",
      medical_history: "",
      privacy_consent: false,
      service_consent: false,
      medical_consent: false,
    },
  });

  const onSubmit: SubmitHandler<PatientFormValues> = async (values) => {
    setLoading(true);

    // Fix: userId might be undefined, handle properly by passing undefined explicitly
    const actualUserId = isReceptionist ? undefined : userId;

    if (actualUserId === undefined && !isReceptionist) {
      toast.error("User ID not available");
      setLoading(false);
      return;
    }

    const res =
      type === "create"
        ? await createNewPatient(values, actualUserId!)
        : await updatePatient(values, actualUserId!);

    setLoading(false);

    if (res?.success) {
      toast.success(res.msg);
      form.reset();
      router.push(isReceptionist ? "/records/patients" : "/patient");
    } else {
      toast.error(res?.msg || "Failed to submit form");
    }
  };

  useEffect(() => {
  if (type === "create" && user) {
    form.reset({
      ...userData,
      address: "",
      date_of_birth: new Date(),
      gender: "MALE",
      marital_status: "single",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "mother",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      medical_history: "",
      insurance_number: "",
      insurance_provider: "",
      privacy_consent: false,
      service_consent: false,
      medical_consent: false,
    });
  } else if (type === "update" && data) {
    form.reset({
      first_name: data.first_name ?? "",
      last_name: data.last_name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      date_of_birth: data.date_of_birth ? new Date(data.date_of_birth) : new Date(),
      gender: data.gender ?? "MALE",
      marital_status: data.marital_status as PatientFormValues["marital_status"],
      address: data.address ?? "",
      emergency_contact_name: data.emergency_contact_name ?? "",
      emergency_contact_number: data.emergency_contact_number ?? "",
      relation: data.relation as PatientFormValues["relation"],
      blood_group: data.blood_group ?? "",
      allergies: data.allergies ?? "",
      medical_conditions: data.medical_conditions ?? "",
      medical_history: data.medical_history ?? "",
      insurance_number: data.insurance_number ?? "",
      insurance_provider: data.insurance_provider ?? "",
      medical_consent: data.medical_consent ?? false,
      privacy_consent: data.privacy_consent ?? false,
      service_consent: data.service_consent ?? false,
    });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [type, data]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    if (!printRef.current) return;
    doc.html(printRef.current, {
      callback: (pdf) => {
        pdf.save("patient_registration.pdf");
      },
      x: 10,
      y: 10,
    });
  };

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Patient Registration",
  } as Parameters<typeof useReactToPrint>[0]);

  return (
    <Card className="max-w-6xl w-full p-4" ref={printRef}>
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
        <CardDescription>
          Please provide all the information below to help us understand you
          better and provide quality service.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-5"
          >
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="flex flex-col lg:flex-row gap-4">
              <CustomInput
                type="input"
                control={form.control}
                name="first_name"
                placeholder="John"
                label="First Name"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="last_name"
                placeholder="Doe"
                label="Last Name"
              />
            </div>

            <CustomInput
              type="input"
              control={form.control}
              name="email"
              placeholder="john@example.com"
              label="Email Address"
            />

            <div className="flex flex-col lg:flex-row gap-4">
              <CustomInput
                type="select"
                control={form.control}
                name="gender"
                placeholder="Select gender"
                label="Gender"
                selectList={GENDER!}
              />
              <CustomInput
                type="input"
                control={form.control}
                name="date_of_birth"
                label="Date of Birth"
                inputType="date"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <CustomInput
                type="input"
                control={form.control}
                name="phone"
                placeholder="9225600735"
                label="Contact Number"
              />
              <CustomInput
                type="select"
                control={form.control}
                name="marital_status"
                placeholder="Select marital status"
                label="Marital Status"
                selectList={MARITAL_STATUS!}
              />
            </div>

            <CustomInput
              type="input"
              control={form.control}
              name="address"
              placeholder="1479 Street, Apt 1839-G, NY"
              label="Address"
            />

            <h3 className="text-lg font-semibold">Family Information</h3>

            <CustomInput
              type="input"
              control={form.control}
              name="emergency_contact_name"
              label="Emergency Contact Name"
            />
            <CustomInput
              type="input"
              control={form.control}
              name="emergency_contact_number"
              label="Emergency Contact Number"
            />
            <CustomInput
              type="select"
              control={form.control}
              name="relation"
              placeholder="Select relation"
              label="Relation"
              selectList={RELATION}
            />

            <h3 className="text-lg font-semibold">Medical Information</h3>

            <CustomInput
              type="input"
              control={form.control}
              name="blood_group"
              placeholder="A+"
              label="Blood Group"
            />
            <CustomInput
              type="input"
              control={form.control}
              name="allergies"
              placeholder="Peanuts"
              label="Allergies"
            />
            <CustomInput
              type="input"
              control={form.control}
              name="medical_conditions"
              placeholder="Asthma"
              label="Medical Conditions"
            />
            <CustomInput
              type="input"
              control={form.control}
              name="medical_history"
              placeholder="Medical history"
              label="Medical History"
            />

            <div className="flex flex-col lg:flex-row gap-4">
              <CustomInput
                type="input"
                control={form.control}
                name="insurance_provider"
                placeholder="Aetna"
                label="Insurance Provider"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="insurance_number"
                placeholder="1234567890"
                label="Insurance Number"
              />
            </div>

            {type !== "update" && (
              <>
                <h3 className="text-lg font-semibold">Consent</h3>
                <CustomInput
                  control={form.control}
                  type="checkbox"
                  name="privacy_consent"
                  label="Privacy Policy Consent"
                />
                <CustomInput
                  control={form.control}
                  type="checkbox"
                  name="service_consent"
                  label="Service Terms Consent"
                />
                <CustomInput
                  control={form.control}
                  type="checkbox"
                  name="medical_consent"
                  label="Medical Treatment Consent"
                />
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {type === "create" ? "Submit" : "Update"}
              </Button>

              {isReceptionist && (
                <>
                  <Button type="button" variant="outline" onClick={handleDownloadPDF}>
                    Download PDF
                  </Button>
                  <Button type="button" variant="outline" onClick={handlePrint}>
                    Print Form
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
