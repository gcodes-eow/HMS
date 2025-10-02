import { Diagnosis, LabTest, MedicalRecords, Patient } from "@prisma/client";
import { BriefcaseBusiness } from "lucide-react";
import React from "react";
import { Table } from "./tables/Table";
import { ProfileImage } from "./ProfileImage";
import { formatDateTime } from "@/utils";
import { ViewAction } from "./ActionOptions";
import { MedicalHistoryDialog } from "./MedicalHistoryDialog";

export interface ExtendedMedicalHistory extends MedicalRecords {
  patient?: Pick<Patient, "first_name" | "last_name" | "img" | "gender">;
  diagnosis: Diagnosis[];
  lab_test: LabTest[];
}

interface MedicalHistoryProps {
  data: ExtendedMedicalHistory[];
  isShowProfile?: boolean;
}

export const MedicalHistory = ({ data, isShowProfile = false }: MedicalHistoryProps) => {
  const columns = [
    { header: "No", key: "no" },
    { header: "Info", key: "name", className: isShowProfile ? "table-cell" : "hidden" },
    { header: "Date & Time", key: "medical_date" },
    { header: "Doctor", key: "doctor", className: "hidden xl:table-cell" },
    { header: "Diagnosis", key: "diagnosis", className: "hidden md:table-cell" },
    { header: "Lab Test", key: "lab_test", className: "hidden 2xl:table-cell" },
  ];

  const renderRow = (item: ExtendedMedicalHistory) => (
    <tr
      key={item.id}
      className="border-b border-border even:bg-muted/50 text-sm hover:bg-accent"
    >
      <td className="py-2 xl:py-6 text-foreground"># {item.id}</td>

      {isShowProfile && item.patient && (
        <td className="flex items-center gap-2 2xl:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item.patient.img ?? undefined}
            name={`${item.patient.first_name} ${item.patient.last_name}`}
          />
          <div>
            <h3 className="font-semibold text-foreground">
              {item.patient.first_name} {item.patient.last_name}
            </h3>
            <span className="text-xs capitalize hidden md:flex text-muted-foreground">
              {item.patient.gender?.toLowerCase()}
            </span>
          </div>
        </td>
      )}

      <td className="text-foreground">{formatDateTime(item.created_at.toString())}</td>
      <td className="hidden xl:table-cell text-foreground">{item.doctor_id}</td>

      <td className="hidden lg:table-cell">
        {item.diagnosis.length === 0 ? (
          <span className="text-sm italic text-muted-foreground">No diagnosis found</span>
        ) : (
          <MedicalHistoryDialog
            id={item.appointment_id}
            patientId={item.patient_id}
            doctor_id={item.doctor_id}
            label={
              <div className="flex gap-x-2 items-center text-lg text-foreground">
                {item.diagnosis.length} <span className="text-sm">Found</span>
              </div>
            }
          />
        )}
      </td>

      <td className="hidden 2xl:table-cell">
        {item.lab_test.length === 0 ? (
          <span className="text-sm italic text-muted-foreground">No lab test found</span>
        ) : (
          <div className="flex gap-x-2 items-center text-lg text-foreground">
            {item.lab_test.length} <span className="text-sm">Found</span>
          </div>
        )}
      </td>

      <td>
        <ViewAction href={`/record/appointments/${item.appointment_id}`} />
      </td>
    </tr>
  );

  return (
    <div className="bg-card text-card-foreground rounded-xl p-2 2xl:p-6">
      <div>
        <h1 className="font-semibold text-xl text-foreground">Medical History (All)</h1>
        <div className="hidden lg:flex items-center gap-1 text-muted-foreground">
          <BriefcaseBusiness size={20} />
          <p className="text-2xl font-semibold text-foreground">{data.length}</p>
          <span className="text-sm xl:text-base">total records</span>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};
