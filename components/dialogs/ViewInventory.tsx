// components/dialogs/ViewInventory.tsx
"use client";

import React, { useRef, useState } from "react";
import { Modal } from "../ui/Modal";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description?: string;
  status: string;
  quantity: number;
  unit?: string;
  reorder_level: number;
  cost_price?: number;
  selling_price?: number;
  batch_number?: string;
  expiry_date?: string | null;
  last_restocked?: string | null;
  supplier?: string;
}

interface ViewInventoryProps {
  item: InventoryItem;
  trigger: React.ReactNode;
}

export const ViewInventory: React.FC<ViewInventoryProps> = ({ item, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Print functionality
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `Inventory_${item.id}`,
    pageStyle: "@media print { body { -webkit-print-color-adjust: exact; } }",
  });

  // Save as PDF
  const handleSavePDF = () => {
    if (!contentRef.current) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    doc.html(contentRef.current, {
      callback: (doc) => doc.save(`Inventory_${item.id}.pdf`),
      x: 20,
      y: 20,
      width: 550,
      windowWidth: 800,
    });
  };

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{trigger}</span>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Inventory Item Details">
        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Print
          </button>
          <button
            onClick={handleSavePDF}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Save as PDF
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={contentRef}
          className="max-h-[70vh] overflow-y-auto space-y-4 p-4 border border-gray-200 rounded text-sm"
        >
          <h2 className="text-lg font-bold mb-4 text-center">
            Inventory Item Details
          </h2>

          <p><strong>Name:</strong> {item.name}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Description:</strong> {item.description ?? "—"}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Unit:</strong> {item.unit ?? "—"}</p>
          <p><strong>Reorder Level:</strong> {item.reorder_level}</p>
          <p><strong>Cost Price:</strong> {item.cost_price != null ? `$${item.cost_price.toFixed(2)}` : "—"}</p>
          <p><strong>Selling Price:</strong> {item.selling_price != null ? `$${item.selling_price.toFixed(2)}` : "—"}</p>
          <p><strong>Batch Number:</strong> {item.batch_number ?? "—"}</p>
          <p><strong>Expiry Date:</strong> {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "—"}</p>
          <p><strong>Last Restocked:</strong> {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : "—"}</p>
          <p><strong>Supplier:</strong> {item.supplier ?? "—"}</p>
        </div>
      </Modal>
    </>
  );
};
