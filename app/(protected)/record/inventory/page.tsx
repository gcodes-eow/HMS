// app/(protected)/record/inventory/page.tsx
import { Pagination } from "@/components/Pagination";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryStats from "@/components/inventory/InventoryStats";
import { InventoryListTable } from "@/components/tables/InventoryListTable";
import InventoryForm from "@/components/forms/InventoryForm";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { Prisma, InventoryCategory } from "@prisma/client";
import { checkRole } from "@/utils/roles";

interface Props {
  searchParams: {
    p?: string;
    search?: string;
    category?: string;
    sort?: string;
  };
}

const limit = 10;

const InventoryPage = async ({ searchParams }: Props) => {
  const page = parseInt(searchParams.p || "1", 10);
  if (isNaN(page) || page < 1) redirect("/record/inventory?p=1");
  const offset = (page - 1) * limit;

  const query = searchParams.search?.trim() || "";
  const categoryFilter = searchParams.category && searchParams.category !== "all" ? searchParams.category : "";
  const sort = searchParams.sort && searchParams.sort !== "newest" ? searchParams.sort : "";

  const andConditions: Prisma.InventoryWhereInput[] = [];

  if (query) {
    andConditions.push({
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { supplier: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  if (categoryFilter) {
    andConditions.push({ category: categoryFilter as InventoryCategory });
  }

  const where: Prisma.InventoryWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const orderBy: Prisma.InventoryOrderByWithRelationInput[] = [];
  if (sort === "name_asc") orderBy.push({ name: "asc" });
  else if (sort === "name_desc") orderBy.push({ name: "desc" });
  else orderBy.push({ created_at: "desc" });

  const [items, totalRecords] = await Promise.all([
    db.inventory.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        category: true,
        quantity: true,
        unit: true,
        supplier: true,
        reorder_level: true,
        last_restocked: true,
        description: true,
        cost_price: true,
        selling_price: true,
        batch_number: true,
        expiry_date: true,
        status: true,
      },
    }),
    db.inventory.count({ where }),
  ]);

  const totalPages = Math.ceil(totalRecords / limit);

  const lowStockCountResult = await db.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) AS count
    FROM "Inventory"
    WHERE quantity <= COALESCE(reorder_level, 0);
  `;
  const lowStockCount = lowStockCountResult[0]?.count ?? 0;

  const isAdmin = await checkRole("ADMIN"); // server-side boolean

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        {isAdmin && <InventoryForm useSheet={true} />}
      </div>

      <InventoryStats totalItems={totalRecords} lowStockCount={lowStockCount} />

      <InventoryFilters defaultSearch={query} defaultCategory={categoryFilter} defaultSort={sort} />

      <InventoryListTable
        initialData={items}
        isAdmin={isAdmin ?? false} // ensure boolean
        search={query}
        category={categoryFilter}
      />

      <Pagination currentPage={page} totalRecords={totalRecords} totalPages={totalPages} limit={limit} />
    </div>
  );
};

export default InventoryPage;
