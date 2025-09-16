// components/dialogs/EditInventory.tsx
"use client";

import React, { useState, ReactNode } from "react";
import InventoryForm from "@/components/forms/InventoryForm";
import { Modal } from "@/components/ui/Modal";

interface EditInventoryProps {
  item: any;
  trigger?: ReactNode;  // optional trigger
  onSuccess?: () => void;
}

export const EditInventory: React.FC<EditInventoryProps> = ({ item, trigger, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!item) return null;

  const defaultValues = {
    ...item,
    description: item.description ?? "",
    expiry_date: item.expiry_date
      ? new Date(item.expiry_date).toISOString().substring(0, 10)
      : undefined,
    last_restocked: item.last_restocked
      ? new Date(item.last_restocked).toISOString().substring(0, 10)
      : undefined,
    supplier: item.supplier ?? "",
    batch_number: item.batch_number ?? "",
    unit: item.unit ?? "",
    cost_price: item.cost_price ?? 0,
    selling_price: item.selling_price ?? 0,
    status: item.status ?? "ACTIVE",
  };

  return (
    <>
      {trigger && <span onClick={() => setIsOpen(true)}>{trigger}</span>}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Inventory Item">
        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <InventoryForm
            defaultValues={defaultValues}
            isEdit
            id={String(item.id)}
            useSheet={false} // disable slide-in
            onSuccess={() => {
              onSuccess?.();
              setIsOpen(false);
            }}
          />
        </div>
      </Modal>
    </>
  );
};
