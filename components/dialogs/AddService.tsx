// components/dialogs/AddService.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "../ui/Button";
import { CardHeader, CardDescription } from "../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import { Form } from "../ui/Form";
import { ServicesSchema } from "@/lib/schema";
import { CustomInput } from "../CustomInput";

import { addService } from "@/app/actions/medicalServices";

interface AddServiceProps {
  onServiceAdded?: () => void;
}

export const AddService: React.FC<AddServiceProps> = ({ onServiceAdded }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ServicesSchema>>({
    resolver: zodResolver(ServicesSchema),
    defaultValues: { service_name: "", price: 0, description: "" },
  });

  const handleOnSubmit = async (values: z.infer<typeof ServicesSchema>) => {
    try {
      setIsLoading(true);
      const resp = await addService(values);

      if (resp.success) {
        toast.success("Service added successfully!");
        form.reset();
        onServiceAdded?.();
      } else {
        toast.error(resp.message || "Failed to add service");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="text-sm font-normal flex items-center gap-2">
          <Plus size={22} className="text-gray-500" /> Add New Service
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md w-full">
        <CardHeader className="px-0">
          <DialogTitle>Add New Service</DialogTitle>
          <CardDescription>
            Manage all your health services from here, including adding new service name and price.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6 p-2 sm:p-4">
            <CustomInput type="input" control={form.control} name="service_name" label="Service Name" />
            <CustomInput type="input" control={form.control} name="price" label="Service Price" />
            <CustomInput type="textarea" control={form.control} name="description" label="Service Description" />

            <Button type="submit" disabled={isLoading} className="bg-blue-600 w-full">
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
