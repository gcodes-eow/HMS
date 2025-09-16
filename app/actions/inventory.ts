// app/actions/inventory.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InventorySchema, InventorySchemaType } from "@/lib/schema";
import { ZodError } from "zod";
import { InventoryItem } from "@/types/dataTypes";

/**
 * Map Prisma Inventory to InventoryItem
 */
function mapInventory(prismaItem: any): InventoryItem {
  return {
    id: prismaItem.id,
    name: prismaItem.name,
    category: prismaItem.category,
    quantity: prismaItem.quantity,
    unit: prismaItem.unit,
    reorder_level: prismaItem.reorder_level,
    cost_price: prismaItem.cost_price,
    selling_price: prismaItem.selling_price ?? 0,
    price: prismaItem.selling_price ?? 0, // match InventoryItem required field
    batch_number: prismaItem.batch_number ?? "",
    expiry_date: prismaItem.expiry_date ?? null,
    supplier: prismaItem.supplier ?? "",
    last_restocked: prismaItem.last_restocked ?? new Date(),
    status: prismaItem.status,
    created_at: prismaItem.created_at,
    updated_at: prismaItem.updated_at,
  };
}

/**
 * Helper: pick only valid Prisma fields from InventorySchemaType
 */
function toPrismaInventoryInput(data: InventorySchemaType) {
  return {
    name: data.name,
    category: data.category,
    description: data.description ?? null,
    quantity: data.quantity,
    unit: data.unit,
    reorder_level: data.reorder_level,
    cost_price: data.cost_price,
    selling_price: data.selling_price ?? null,
    batch_number: data.batch_number ?? null,
    expiry_date: data.expiry_date ? new Date(data.expiry_date) : null,
    last_restocked: data.last_restocked ? new Date(data.last_restocked) : new Date(),
    supplier: data.supplier ?? null,
  };
}

/**
 * Fetch all inventory items
 */
export async function getInventory(): Promise<InventoryItem[]> {
  const items = await prisma.inventory.findMany({
    orderBy: { name: "asc" },
  });
  return items.map(mapInventory);
}

/**
 * Fetch single inventory item by ID
 */
export async function getInventoryItem(id: number): Promise<InventoryItem | null> {
  const item = await prisma.inventory.findUnique({ where: { id } });
  return item ? mapInventory(item) : null;
}

/**
 * Create a new inventory item
 */
export async function createInventoryItem(data: InventorySchemaType) {
  try {
    const validated = InventorySchema.parse(data);
    const newItem = await prisma.inventory.create({
      data: toPrismaInventoryInput(validated),
    });
    revalidatePath("/admin/inventory");
    return mapInventory(newItem);
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
      data: toPrismaInventoryInput(validated as InventorySchemaType),
    });
    revalidatePath("/admin/inventory");
    return mapInventory(updatedItem);
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
 */
export async function getStockAlerts() {
  const now = new Date();
  const items = await prisma.inventory.findMany({
    where: {
      OR: [
        { quantity: { lte: 0 } },
        { expiry_date: { lt: now } },
      ],
    },
    orderBy: [{ quantity: "asc" }, { expiry_date: "asc" }],
  });
  return items.map(mapInventory);
}
