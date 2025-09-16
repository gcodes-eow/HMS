// app/actions/admin.ts
"use server";

import db from "@/lib/db";
import {
  DoctorSchema,
  ServicesSchema,
  StaffSchema,
  WorkingDaysSchema,
  InventorySchema,
} from "@/lib/schema";
import { generateRandomColor } from "@/utils";
import { checkRole } from "@/utils/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";

function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

// ---------------- STAFF ----------------
export async function createNewStaff(data: any) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, msg: "Unauthorized" };

    const isAdmin = await checkRole("ADMIN");
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    const values = StaffSchema.safeParse(data);
    if (!values.success) {
      return {
        success: false,
        errors: true,
        message: "Please provide all required info",
      };
    }
    const validatedValues = values.data;

    const allowedRoles = [
      "NURSE",
      "LABORATORY",
      "RECEPTIONIST",
      "CASHIER",
      "PHARMACIST",
    ];
    if (!allowedRoles.includes(validatedValues.role)) {
      return { success: false, error: true, message: "Invalid role type" };
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: validatedValues.email.split("@")[0],
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      publicMetadata: { role: validatedValues.role.toLowerCase() },
    });

    delete validatedValues["password"];
    await db.staff.create({
      data: {
        ...validatedValues,
        colorCode: generateRandomColor(),
        id: user.id,
        status: "ACTIVE",
      },
    });

    return {
      success: true,
      message: "Staff added successfully",
      error: false,
    };
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      success: false,
      message:
        error?.errors?.[0]?.message ||
        "Something went wrong creating staff",
    };
  }
}

// ---------------- DOCTOR ----------------
export async function createNewDoctor(data: any) {
  try {
    const values = DoctorSchema.safeParse(data);
    const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

    if (!values.success || !workingDaysValues.success) {
      return {
        success: false,
        errors: true,
        message: "Please provide all required info",
      };
    }

    const validatedValues = values.data;
    const workingDayData = workingDaysValues.data!;

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: validatedValues.email.split("@")[0],
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      publicMetadata: { role: "doctor" },
    });

    delete validatedValues["password"];
    const doctor = await db.doctor.create({
      data: { ...validatedValues, id: user.id },
    });

    await Promise.all(
      workingDayData.map((el) =>
        db.workingDays.create({
          data: { ...el, doctor_id: doctor.id },
        })
      )
    );

    return {
      success: true,
      message: "Doctor added successfully",
      error: false,
    };
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      success: false,
      message:
        error?.errors?.[0]?.message ||
        "Something went wrong creating doctor",
    };
  }
}

// ---------------- SERVICE ----------------
export async function addNewService(data: any) {
  try {
    const isValidData = ServicesSchema.safeParse(data);
    if (!isValidData.success)
      return { success: false, msg: "Invalid service data" };

    const validatedData = isValidData.data;
    await db.services.create({
      data: { ...validatedData, price: Number(validatedData.price) },
    });

    return { success: true, error: false, msg: "Service added successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

// ---------------- INVENTORY ----------------
export async function createNewInventory(data: any) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, msg: "Unauthorized" };

    const isAdmin = await checkRole("ADMIN");
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    const values = InventorySchema.safeParse(data);
    if (!values.success) {
      return { success: false, errors: true, message: "Please provide all required inventory info" };
    }
    const validatedValues = values.data;

    // Convert expiry_date safely
    let expiryDate: Date | null = null;
    if (validatedValues.expiry_date) {
      const parsed = new Date(validatedValues.expiry_date);
      expiryDate = isValidDate(parsed) ? parsed : null;
    }

    // Ensure the staff exists before inserting
    const staff = await db.staff.findUnique({ where: { id: userId } });
    if (!staff) {
      return { success: false, message: "Staff record not found for this user" };
    }

    await db.inventory.create({
      data: {
        ...validatedValues,
        expiry_date: expiryDate,
        last_restocked: new Date(),
        status: "ACTIVE",
        added_by_id: userId, // ✅ enforce foreign key reference
      },
    });

    return { success: true, message: "Inventory item added successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: "Failed to create inventory" };
  }
}

export async function updateInventory(id: string, data: any) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, msg: "Unauthorized" };

    const isAdmin = await checkRole("ADMIN");
    if (!isAdmin) return { success: false, msg: "Unauthorized" };

    const values = InventorySchema.partial().safeParse(data); // allow partial updates
    if (!values.success) {
      return {
        success: false,
        errors: true,
        message: "Invalid inventory update data",
      };
    }
    const validatedValues = values.data;

    // Convert expiry_date and last_restocked
    const expiryDate = validatedValues.expiry_date
      ? new Date(validatedValues.expiry_date)
      : null;
    const lastRestocked = validatedValues.last_restocked
      ? new Date(validatedValues.last_restocked)
      : undefined;

    await db.inventory.update({
      where: { id: Number(id) },
      data: {
        ...validatedValues,
        quantity: validatedValues.quantity
          ? Number(validatedValues.quantity)
          : undefined,
        reorder_level: validatedValues.reorder_level
          ? Number(validatedValues.reorder_level)
          : undefined,
        cost_price: validatedValues.cost_price
          ? Number(validatedValues.cost_price)
          : undefined,
        selling_price: validatedValues.selling_price
          ? Number(validatedValues.selling_price)
          : undefined,
        expiry_date: expiryDate,
        last_restocked: lastRestocked,
        updated_at: new Date(),
        added_by_id: userId, // ✅ track editor
      },
    });

    return { success: true, message: "Inventory item updated successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, message: "Failed to update inventory" };
  }
}
