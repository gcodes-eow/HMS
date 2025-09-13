"use client";

import { ActionDialog } from "@/components/ActionDialog";
import { ViewAction } from "@/components/ActionOptions";
import { Table } from "@/components/tables/Table";
import { format } from "date-fns";
import React from "react";
import InventoryForm from "@/components/forms/InventoryForm";

const columns = [
  { header: "Item Name", key: "name" },
  { header: "Category", key: "category", className: "hidden md:table-cell" },
  { header: "Quantity", key: "quantity", className: "hidden md:table-cell" },
  {
    header: "Last Restocked",
    key: "last_restocked",
    className: "hidden lg:table-cell",
  },
  { header: "Actions", key: "action" },
];

interface InventoryListTableProps {
  initialData: any[];
  currentPage: number;
  isAdmin: boolean;
  search?: string;
  category?: string;
  onRefresh?: () => void;
}

export function InventoryListTable({
  initialData,
  isAdmin,
  search = "",
  category = "",
  onRefresh,
}: InventoryListTableProps) {
  const handleRefresh = () => {
    if (onRefresh) onRefresh();
  };

  const renderRow = (item: any) => (
    <tr
      key={item?.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
    >
      <td className="p-4">{item?.name}</td>
      <td className="hidden md:table-cell capitalize">{item?.category}</td>
      <td className="hidden md:table-cell">{item?.quantity}</td>
      <td className="hidden lg:table-cell">
        {item?.last_restocked
          ? format(new Date(item?.last_restocked), "yyyy-MM-dd")
          : "—"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <ViewAction href={`/record/inventory/${item?.id}`} />
          {isAdmin && (
            <>
              <InventoryForm
                isEdit
                defaultValues={{
                  name: item.name,
                  category: item.category,
                  description: item.description || "",
                  quantity: item.quantity,
                  unit: item.unit || "",
                  reorder_level: item.reorder_level || 0,
                  cost_price: item.cost_price || 0,
                  selling_price: item.selling_price || 0,
                  batch_number: item.batch_number || "",
                  expiry_date: item.expiry_date
                    ? new Date(item.expiry_date).toISOString().substring(0, 10)
                    : undefined,
                  supplier: item.supplier || "",
                  status: item.status || "ACTIVE",
                }}
                onSuccess={handleRefresh}
              />
              <ActionDialog
                type="delete"
                id={item?.id}
                deleteType="inventory"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-xl py-6 px-3 2xl:px-6 mt-4">
      <h2 className="text-lg font-semibold mb-4">Inventory Items</h2>
      <Table
        columns={columns}
        data={initialData}
        renderRow={renderRow}
        search={search}
        category={category}
      />
    </div>
  );
}
