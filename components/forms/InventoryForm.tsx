"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Plus } from "lucide-react";
import { Form } from "../ui/Form";
import { CustomInput } from "../CustomInput";
import { toast } from "sonner";
import { createNewInventory, updateInventory } from "@/app/actions/admin";
import { InventorySchema, InventorySchemaType } from "@/lib/schema";
import { useForm } from "react-hook-form";

interface InventoryFormProps {
  defaultValues?: InventorySchemaType;
  isEdit?: boolean;
  id?: string;
  onSuccess?: () => void;
  triggerButton?: ReactNode;
  useSheet?: boolean; // <-- new: optional, default true
}

export default function InventoryForm({
  defaultValues,
  isEdit = false,
  id,
  onSuccess,
  triggerButton,
  useSheet = true, // default true
}: InventoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const processedDefaultValues = defaultValues
    ? {
        ...defaultValues,
        expiry_date: defaultValues.expiry_date
          ? new Date(defaultValues.expiry_date).toISOString().substring(0, 10)
          : undefined,
        last_restocked: defaultValues.last_restocked
          ? new Date(defaultValues.last_restocked).toISOString().substring(0, 10)
          : undefined,
        description: defaultValues.description ?? "",
        batch_number: defaultValues.batch_number ?? "",
        supplier: defaultValues.supplier ?? "",
        unit: defaultValues.unit ?? "",
      }
    : undefined;

  const form = useForm<InventorySchemaType>({
    resolver: zodResolver(InventorySchema),
    defaultValues: processedDefaultValues || {
      name: "",
      category: "MEDICATION",
      description: "",
      quantity: 0,
      unit: "",
      reorder_level: 0,
      cost_price: 0,
      selling_price: 0,
      batch_number: "",
      expiry_date: undefined,
      last_restocked: undefined,
      supplier: "",
      status: "ACTIVE",
      added_by_id: "",
    },
  });

  const handleSubmit = async (values: InventorySchemaType) => {
    try {
      setIsLoading(true);

      if (!values.expiry_date) values.expiry_date = undefined;
      if (!values.last_restocked) values.last_restocked = undefined;

      let resp;
      if (isEdit && id) {
        resp = await updateInventory(id, values);
      } else {
        resp = await createNewInventory(values);
      }

      if (resp.success) {
        toast.success(isEdit ? "Item updated successfully!" : "Item added successfully!");
        form.reset();
        setOpen(false);
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(resp.message || "Error saving item");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const FormContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 mt-5 2xl:mt-10"
      >
        <CustomInput type="input" control={form.control} name="name" label="Name" />
        <CustomInput
          type="select"
          control={form.control}
          name="category"
          label="Category"
          selectList={[
            { label: "Medication", value: "MEDICATION" },
            { label: "Consumable", value: "CONSUMABLE" },
            { label: "Equipment", value: "EQUIPMENT" },
            { label: "Other", value: "OTHER" },
          ]}
        />
        <CustomInput type="textarea" control={form.control} name="description" label="Description" />
        <CustomInput type="input" control={form.control} name="quantity" label="Quantity" inputType="number" />
        <CustomInput type="input" control={form.control} name="unit" label="Unit" />
        <CustomInput type="input" control={form.control} name="reorder_level" label="Reorder Level" inputType="number" />
        <CustomInput type="input" control={form.control} name="cost_price" label="Cost Price" inputType="number" />
        <CustomInput type="input" control={form.control} name="selling_price" label="Selling Price" inputType="number" />
        <CustomInput type="input" control={form.control} name="batch_number" label="Batch Number" />
        <CustomInput type="input" control={form.control} name="expiry_date" label="Expiry Date" inputType="date" />
        <CustomInput type="input" control={form.control} name="last_restocked" label="Last Restocked" inputType="date" />
        <CustomInput type="input" control={form.control} name="supplier" label="Supplier" />
        <CustomInput type="switch" control={form.control} name="status" label="Active" placeholder="Inactive" />

        <Button type="submit" disabled={isLoading} className="mt-4 w-full">
          {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Add Item"}
        </Button>
      </form>
    </Form>
  );

  // If useSheet is true, wrap in Sheet for Add Inventory; else render directly (for modal)
  if (useSheet) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {isEdit ? (
            triggerButton ? (
              <div onClick={() => setOpen(true)}>{triggerButton}</div>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                Edit
              </Button>
            )
          ) : (
            <Button onClick={() => setOpen(true)}>
              <Plus size={20} />
              Add Inventory
            </Button>
          )}
        </SheetTrigger>
        <SheetContent className="rounded-xl md:h-[90%] md:top-[5%] w-full overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>{isEdit ? "Edit Inventory Item" : "Add New Inventory Item"}</SheetTitle>
          </SheetHeader>
          {FormContent}
        </SheetContent>
      </Sheet>
    );
  }

  return FormContent; // Render directly for modal
}
