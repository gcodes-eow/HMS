import db from "@/lib/db";
import { DATA_LIMIT } from "@/utils/settings";
import type { Prisma } from "@prisma/client";
import { InventoryCategory } from "@prisma/client";

const inventoryCategories = Object.values(InventoryCategory);

function isInventoryCategory(value: string): value is InventoryCategory {
  return inventoryCategories.includes(value as InventoryCategory);
}

export async function getAllInventory({
  page = "1",
  search = "",
  category = "",
}: {
  page?: string;
  search?: string;
  category?: string;
}) {
  const pageNum = parseInt(page, 10);
  const skip = (pageNum - 1) * DATA_LIMIT;
  const upperSearch = search.toUpperCase();
  const upperCategory = category.toUpperCase();

  const andConditions: Prisma.InventoryWhereInput[] = [];

  // Search conditions
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { supplier: { contains: search, mode: "insensitive" } },
        ...(isInventoryCategory(upperSearch) ? [{ category: { equals: upperSearch } }] : []),
      ],
    });
  }

  // Category filter condition (if provided and valid)
  if (category && isInventoryCategory(upperCategory)) {
    andConditions.push({
      category: upperCategory,
    });
  }

  const where: Prisma.InventoryWhereInput = andConditions.length > 0
    ? { AND: andConditions }
    : {};

  const [items, totalRecords] = await Promise.all([
    db.inventory.findMany({
      where,
      skip,
      take: DATA_LIMIT,
      orderBy: { created_at: "desc" },
    }),
    db.inventory.count({ where }),
  ]);

  return {
    data: items,
    totalRecords,
    totalPages: Math.ceil(totalRecords / DATA_LIMIT),
    currentPage: pageNum,
  };
}

export async function getInventoryAlerts() {
  const now = new Date();

  const alerts = await db.inventory.findMany({
    where: {
      OR: [
        { quantity: { lte: 0 } },
        {
          AND: [
            { reorder_level: { not: undefined } },
            { quantity: { lte: 0 } },
          ],
        },
        {
          expiry_date: { not: null, lt: now },
        },
      ],
    },
    orderBy: [
      { quantity: "asc" },
      { expiry_date: "asc" },
    ],
  });

  return alerts;
}

/**
 * Get a single inventory item by ID
 */
export async function get(id: number) {
  return db.inventory.findUnique({
    where: { id },
  });
}

/**
 * Delete a single inventory item by ID
 */
export async function deleteItem(id: number) {
  return db.inventory.delete({
    where: { id },
  });
}
