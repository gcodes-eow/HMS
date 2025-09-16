// components/ActionDialog.tsx
"use client";

import React, { useState, ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "./ui/Dialog";
import { Button } from "./ui/Button";
import { toast } from "sonner";
import { deleteDataById } from "@/app/actions/general";
import { Loader2 } from "lucide-react"; // ✅ Spinner

// Only include types that match deleteDataById
export type DeleteType =
  | "doctor"
  | "staff"
  | "patient"
  | "payment"
  | "bill"
  | "inventory"
  | "service"
  | "appointment"
  | "medicalRecord"
  | "labTest";

interface ActionDialogProps {
  type: "delete"; // currently only using delete for now
  id: string;
  deleteType: DeleteType;
  onDeleted?: () => void; // optional callback to refresh parent
  children: ReactNode;
}

export const ActionDialog = ({
  id,
  deleteType,
  onDeleted,
  children,
}: ActionDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await deleteDataById(id, deleteType);
      if (res.success) {
        toast.success(res.message || "Deleted successfully");
        onDeleted?.();

        // ✅ Close dialog after success
        const closeBtn = document.querySelector<HTMLButtonElement>(
          "[data-dialog-close]"
        );
        closeBtn?.click();
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center justify-center py-6">
          <DialogTitle>Delete Confirmation</DialogTitle>
          <p>Are you sure you want to delete this record?</p>
          <div className="flex gap-2 mt-4">
            {/* Cancel now has data-dialog-close */}
            <DialogClose asChild>
              <Button data-dialog-close>Cancel</Button>
            </DialogClose>

            <Button
              disabled={loading}
              onClick={handleDelete}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                "Yes, Delete"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
