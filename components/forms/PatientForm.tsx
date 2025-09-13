// components/forms/PatientForm.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatientFormSchema, PatientFormData } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { CustomInput } from "@/components/CustomInput";
import { createNewPatient } from "@/app/actions/patient";
import { Form } from "@/components/ui/Form"; // ✅ Added import

const defaultValues: Partial<PatientFormData> = {
  first_name: "",
  last_name: "",
  date_of_birth: undefined,
  gender: "MALE",
  phone: "",
  email: "",
  address: "",
  marital_status: "single",
  emergency_contact_name: "",
  emergency_contact_number: "",
  relation: undefined,
  blood_group: "",
  allergies: "",
  medical_conditions: "",
  medical_history: "",
  insurance_provider: "",
  insurance_number: "",
  privacy_consent: false,
  service_consent: false,
  medical_consent: false,
  img: "",
};

export const PatientForm: React.FC<{ onSubmitSuccess?: () => void }> = ({
  onSubmitSuccess,
}) => {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = form;

  const onSubmit = async (data: PatientFormData) => {
    await createNewPatient(data, "new-patient");
    if (onSubmitSuccess) onSubmitSuccess();
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(defaultValues);
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Required Fields */}
          <CustomInput type="input" control={control} name="first_name" label="First Name" placeholder="First Name" />
          <CustomInput type="input" control={control} name="last_name" label="Last Name" placeholder="Last Name" />
          <CustomInput type="input" inputType="date" control={control} name="date_of_birth" label="Date of Birth" placeholder="Select birth date" />
          <CustomInput type="select" control={control} name="gender" label="Gender" placeholder="Select gender" selectList={[
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
          ]} />
          <CustomInput type="input" control={control} name="phone" label="Contact Number" placeholder="10-digit phone number" />
          <CustomInput type="input" control={control} name="address" label="Address" placeholder="Enter full address" />

          {/* Optional Fields */}
          <CustomInput type="input" control={control} name="email" label="Email (Optional)" placeholder="you@example.com (Optional)" />
          <CustomInput type="select" control={control} name="marital_status" label="Marital Status (Optional)" placeholder="Select status" selectList={[
            { label: "Married", value: "married" },
            { label: "Single", value: "single" },
            { label: "Divorced", value: "divorced" },
            { label: "Widowed", value: "widowed" },
            { label: "Separated", value: "separated" },
          ]} />
          <CustomInput type="input" control={control} name="emergency_contact_name" label="Emergency Contact Name (Optional)" placeholder="Contact name (Optional)" />
          <CustomInput type="input" control={control} name="emergency_contact_number" label="Emergency Number (Optional)" placeholder="10-digit number (Optional)" />
          <CustomInput type="select" control={control} name="relation" label="Relation to Patient (Optional)" placeholder="Select relation" selectList={[
            { label: "Mother", value: "mother" },
            { label: "Father", value: "father" },
            { label: "Husband", value: "husband" },
            { label: "Wife", value: "wife" },
            { label: "Other", value: "other" },
          ]} />
          <CustomInput type="input" control={control} name="blood_group" label="Blood Group (Optional)" placeholder="e.g., A+, O- (Optional)" />
          <CustomInput type="input" control={control} name="allergies" label="Allergies (Optional)" placeholder="e.g., Penicillin (Optional)" />
          <CustomInput type="input" control={control} name="medical_conditions" label="Medical Conditions (Optional)" placeholder="e.g., Diabetes (Optional)" />
          <CustomInput type="input" control={control} name="medical_history" label="Medical History (Optional)" placeholder="e.g., Asthma (Optional)" />
          <CustomInput type="input" control={control} name="insurance_provider" label="Insurance Provider (Optional)" placeholder="Provider name (Optional)" />
          <CustomInput type="input" control={control} name="insurance_number" label="Insurance Number (Optional)" placeholder="Policy number (Optional)" />

          {/* Consent Checkboxes */}
          <CustomInput type="checkbox" control={control} name="privacy_consent" label="I agree to the privacy policy" />
          <CustomInput type="checkbox" control={control} name="service_consent" label="I agree to the terms of service" />
          <CustomInput type="checkbox" control={control} name="medical_consent" label="I agree to the medical treatment terms" />
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full">
            Register New Patient
          </Button>
        </div>
      </form>
    </Form>
  );
};
