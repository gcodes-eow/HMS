"use client";

import React from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { ActionDialog } from "@/components/ActionDialog";
import { Table } from "@/components/tables/Table";
import { ViewInventory } from "@/components/dialogs/ViewInventory";
import { EditInventory } from "@/components/dialogs/EditInventory";
import { Button } from "@/components/ui/Button";

interface InventoryListTableProps {
  initialData: any[];
  isAdmin: boolean;
  search?: string;
  category?: string;
  onRefresh?: () => void;
}

const columns = [
  { header: "Item Name", key: "name" },
  { header: "Category", key: "category", className: "hidden md:table-cell" },
  { header: "Quantity", key: "quantity", className: "hidden md:table-cell" },
  { header: "Last Restocked", key: "last_restocked", className: "hidden lg:table-cell" },
  { header: "Actions", key: "action" },
];

export function InventoryListTable({
  initialData,
  isAdmin,
  search = "",
  category = "",
  onRefresh,
}: InventoryListTableProps) {
  const handleRefresh = () => onRefresh?.();

  const InventoryActions = ({ item }: { item: any }) => (
    <div className="flex gap-2">
      <ViewInventory
        item={item}
        trigger={
          <Button variant="secondary" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0c0 5-5 9-12 9S3 17 3 12 8 3 15 3s12 4 12 9z" />
            </svg>
          </Button>
        }
      />
      {isAdmin && (
        <>
          <EditInventory
            item={item}
            onSuccess={handleRefresh}
            trigger={<Button variant="warning" size="sm">✏️</Button>}
          />
          <ActionDialog type="delete" id={String(item.id)} deleteType="inventory" onDeleted={handleRefresh}>
            <Button variant="destructive" size="sm"><Trash2 size={16} /></Button>
          </ActionDialog>
        </>
      )}
    </div>
  );

  const renderRow = (item: any) => (
    <tr key={item.id} className="border-b border-border even:bg-muted text-foreground hover:bg-accent dark:border-border-dark dark:even:bg-muted-dark dark:text-foreground-dark dark:hover:bg-accent-dark text-sm">
      <td className="p-4">{item.name}</td>
      <td className="hidden md:table-cell capitalize">{item.category}</td>
      <td className="hidden md:table-cell">{item.quantity}</td>
      <td className="hidden lg:table-cell">{item.last_restocked ? format(new Date(item.last_restocked), "yyyy-MM-dd") : "—"}</td>
      <td className="py-2"><InventoryActions item={item} /></td>
    </tr>
  );

  const mobileRenderRow = (item: any) => (
    <tr key={item.id}>
      <td colSpan={columns.length} className="p-4">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground dark:text-muted-foreground-dark">
          <span><strong>Name:</strong> {item.name}</span>
          <span><strong>Category:</strong> {item.category}</span>
          <span><strong>Quantity:</strong> {item.quantity}</span>
          <span><strong>Last Restocked:</strong> {item.last_restocked ? format(new Date(item.last_restocked), "yyyy-MM-dd") : "—"}</span>
          <InventoryActions item={item} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-card rounded-xl py-6 px-3 2xl:px-6 mt-4 dark:bg-card-dark">
      <h2 className="text-lg font-semibold mb-4 text-foreground dark:text-foreground-dark">Inventory Items</h2>
      <Table
        columns={columns}
        data={initialData}
        renderRow={renderRow}
        mobileRenderRow={mobileRenderRow}
        search={search}
        category={category}
      />
    </div>
  );
}
