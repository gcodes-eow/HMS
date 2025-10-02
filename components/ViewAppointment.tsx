import { getAppointmentById } from "@/utils/services/appointment";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Dialog";
import { Button } from "./ui/Button";
import { calculateAge, formatDateTime } from "@/utils";
import { ProfileImage } from "./ProfileImage";
import { Calendar, Phone } from "lucide-react";
import { format } from "date-fns";
import { AppointmentStatusIndicator } from "./AppointmentStatusIndicator";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { AppointmentAction } from "./AppointmentAction";

interface ViewAppointmentProps {
  id?: string;
}

export const ViewAppointment = async ({ id }: ViewAppointmentProps) => {
  if (!id) return null;

  const { data } = await getAppointmentById(Number(id));
  if (!data) return null;

  const { userId } = await auth();

  const appointmentDate = data.appointment_date ? new Date(data.appointment_date) : undefined;
  const createdAt = data.created_at ? new Date(data.created_at) : undefined;
  const createdAtStr = createdAt ? createdAt.toISOString() : undefined;

  const patientDob = data.patient.date_of_birth
    ? new Date(data.patient.date_of_birth)
    : undefined;

  const canPerformAction = (await checkRole("ADMIN")) || data.doctor_id === userId;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-center rounded-full bg-primary/10 hover:underline text-primary px-1.5 py-1 text-xs md:text-sm"
        >
          View
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[425px] max-h-[95%] md:max-w-2xl 2xl:max-w-3xl p-8 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Patient Appointment</DialogTitle>
          <DialogDescription>
            Booked on: {createdAtStr ? formatDateTime(createdAtStr) : "N/A"}
          </DialogDescription>
        </DialogHeader>

        {data.status === "CANCELLED" && (
          <div className="bg-destructive/10 p-4 mt-4 rounded-md">
            <span className="font-semibold text-sm text-destructive">
              This appointment has been cancelled
            </span>
            <p className="text-sm text-muted-foreground">
              <strong>Reason</strong>: {data.reason ?? "N/A"}
            </p>
          </div>
        )}

        {/* Personal Information */}
        <div className="grid gap-4 py-4">
          <p className="w-fit bg-primary/10 text-primary py-1 rounded text-xs md:text-sm">
            Personal Information
          </p>

          <div className="flex flex-col md:flex-row gap-6 mb-16">
            <div className="flex gap-1 w-full md:w-1/2">
              <ProfileImage
                url={data.patient.img ?? undefined}
                name={`${data.patient.first_name} ${data.patient.last_name}`}
                className="size-20 bg-primary"
                textClassName="text-2xl"
              />
              <div className="space-y-0.5">
                <h2 className="text-lg md:text-xl font-semibold uppercase text-foreground">
                  {data.patient.first_name} {data.patient.last_name}
                </h2>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={20} className="text-muted-foreground" />
                  {patientDob ? calculateAge(patientDob) : "N/A"}
                </p>
                <span className="flex items-center text-sm gap-2 text-muted-foreground">
                  <Phone size={16} className="text-muted-foreground" />
                  {data.patient.phone ?? "N/A"}
                </span>
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Address</span>
              <p className="text-foreground capitalize">{data.patient.address ?? "N/A"}</p>
            </div>
          </div>

          {/* Appointment Information */}
          <p className="w-fit bg-primary/10 text-primary py-1 rounded text-xs md:text-sm">
            Appointment Information
          </p>
          <div className="grid grid-cols-3 gap-10">
            <div>
              <span className="text-sm text-muted-foreground">Date</span>
              <p className="text-sm text-foreground">
                {appointmentDate ? format(appointmentDate, "MMM dd, yyyy") : "N/A"}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Time</span>
              <p className="text-foreground">{data.time ?? "N/A"}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <AppointmentStatusIndicator status={data.status} />
            </div>
          </div>

          {data.note && (
            <div>
              <span className="text-sm text-muted-foreground">Note from Patient</span>
              <p className="text-foreground">{data.note}</p>
            </div>
          )}

          {/* Physician Information */}
          <p className="w-fit bg-primary/10 text-primary py-1 px-2 rounded text-xs md:text-sm mt-16">
            Physician Information
          </p>
          <div className="w-full flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex gap-3">
              <ProfileImage
                url={data.doctor.img ?? undefined}
                name={data.doctor.name}
                className="xl:size-20 bg-secondary"
                textClassName="xl:text-2xl"
              />
              <div>
                <h2 className="text-lg uppercase font-medium text-foreground">
                  {data.doctor.name}
                </h2>
                <p className="flex items-center gap-2 text-muted-foreground capitalize">
                  {data.doctor.specialization}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {canPerformAction && (
            <>
              <p className="w-fit bg-primary/10 text-primary py-1 px-2 rounded text-xs md:text-sm mt-4">
                Perform Action
              </p>
              <AppointmentAction id={data.id} status={data.status} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
