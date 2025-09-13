// app/actions/general.ts
"use server";

import {
  ReviewFormValues,
  reviewSchema,
} from "@/components/dialogs/ReviewForm";
import db from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server"; // Clerk SDK

export async function deleteDataById(
  id: string,
  deleteType:
    | "doctor"
    | "staff"
    | "patient"
    | "payment"
    | "bill"
    | "inventory"
    | "service"
    | "appointment"
    | "medicalRecord"
    | "labTest"
) {
  try {
    switch (deleteType) {
      case "doctor":
        await db.doctor.delete({ where: { id } });
        break;

      case "staff":
        await db.staff.delete({ where: { id } });
        break;

      case "patient":
        // delete from Prisma first
        await db.patient.delete({ where: { id } });

        // then delete Clerk user
        {
          const client = await clerkClient();
          await client.users.deleteUser(id);
        }
        break;

      case "payment":
        await db.payment.delete({ where: { id: Number(id) } });
        break;

      case "bill":
        await db.patientBills.delete({ where: { id: Number(id) } });
        break;

      case "inventory":
        await db.inventory.delete({ where: { id: Number(id) } });
        break;

      case "service":
        await db.services.delete({ where: { id: Number(id) } });
        break;

      case "appointment":
        await db.appointment.delete({ where: { id: Number(id) } });
        break;

      case "medicalRecord":
        await db.medicalRecords.delete({ where: { id: Number(id) } });
        break;

      case "labTest":
        await db.labTest.delete({ where: { id: Number(id) } });
        break;

      default:
        throw new Error("Invalid delete type");
    }

    // ✅ Generic Clerk cleanup for staff/doctor too
    if (["staff", "doctor"].includes(deleteType)) {
      const client = await clerkClient();
      await client.users.deleteUser(id);
    }

    return {
      success: true,
      message: `${deleteType} deleted successfully`,
      status: 200,
    };
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      return {
        success: false,
        message: "Record not found",
        status: 404,
      };
    }

    if (error.code === "P2003") {
      return {
        success: false,
        message: `Cannot delete ${deleteType}: record is still referenced by other data`,
        status: 409,
      };
    }

    return {
      success: false,
      message: error?.message || "Internal Server Error",
      status: 500,
    };
  }
}

export async function createReview(values: ReviewFormValues) {
  try {
    const validatedFields = reviewSchema.parse(values);

    await db.rating.create({
      data: {
        ...validatedFields,
      },
    });

    return {
      success: true,
      message: "Review created successfully",
      status: 200,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}
