"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InventorySchema, InventorySchemaType } from "@/lib/schema";
import { ZodError } from "zod";
import { InventoryItem } from "@/types/dataTypes";

/**
 * Fetch all inventory items
 */
export async function getInventory(): Promise<InventoryItem[]> {
  return prisma.inventory.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Fetch single inventory item by ID
 */
export async function getInventoryItem(id: number): Promise<InventoryItem | null> {
  return prisma.inventory.findUnique({
    where: { id },
  });
}

/**
 * Create a new inventory item
 */
export async function createInventoryItem(data: InventorySchemaType) {
  try {
    const validated = InventorySchema.parse(data);
    const newItem = await prisma.inventory.create({ data: validated });
    revalidatePath("/admin/inventory");
    return newItem;
  } catch (error) {
    if (error instanceof ZodError) {
      return { errors: error.flatten().fieldErrors };
    }
    throw error;
  }
}

/**
 * Update an inventory item
 */
export async function updateInventoryItem(id: number, data: Partial<InventorySchemaType>) {
  try {
    const validated = InventorySchema.partial().parse(data);
    const updatedItem = await prisma.inventory.update({
      where: { id },
      data: validated,
    });
    revalidatePath("/admin/inventory");
    return updatedItem;
  } catch (error) {
    if (error instanceof ZodError) {
      return { errors: error.flatten().fieldErrors };
    }
    throw error;
  }
}

/**
 * Delete an inventory item
 */
export async function deleteInventoryItem(id: number) {
  await prisma.inventory.delete({ where: { id } });
  revalidatePath("/admin/inventory");
  return { success: true };
}

/**
 * Get low stock and expired items
 * Prisma does not support quantity <= reorder_level directly, so this fetches
 * items where quantity <= 0 or expiry_date < now, you may need to filter client-side for reorder_level condition.
 */
export async function getStockAlerts() {
  const now = new Date();

  return prisma.inventory.findMany({
    where: {
      OR: [
        { quantity: { lte: 0 } }, // Out of stock approximation
        { expiry_date: { lt: now } },
      ],
    },
    orderBy: [{ quantity: "asc" }, { expiry_date: "asc" }],
  });
}
