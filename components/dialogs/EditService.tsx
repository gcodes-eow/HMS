// components/dialogs/EditService.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Button } from "../ui/Button";
import { fetchServiceById, editService } from "@/app/actions/medicalServices";

interface EditServiceProps {
  serviceId: number;
  onServiceUpdated?: () => void;
  children?: ReactNode;
}

export const EditService: React.FC<EditServiceProps> = ({
  serviceId,
  onServiceUpdated,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ServicesSchema>>({
    resolver: zodResolver(ServicesSchema),
    defaultValues: { service_name: "", price: 0, description: "" },
  });

  useEffect(() => {
    const loadService = async () => {
      const res = await fetchServiceById(serviceId);
      if (res.success && res.data) {
        form.reset({
          service_name: res.data.service_name,
          price: res.data.price,
          description: res.data.description,
        });
      } else {
        toast.error(res.message || "Failed to load service");
      }
    };
    loadService();
  }, [serviceId]);

  const handleOnSubmit = async (values: z.infer<typeof ServicesSchema>) => {
    try {
      setIsLoading(true);
      const res = await editService(serviceId, values);

      if (res.success) {
        toast.success("Service updated successfully!");
        onServiceUpdated?.();
      } else {
        toast.error(res.message || "Failed to update service");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-md w-full">
        <CardHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <CardDescription>Update the service details below.</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOnSubmit)}
            className="space-y-6 p-2 sm:p-4"
          >
            <CustomInput
              type="input"
              control={form.control}
              name="service_name"
              label="Service Name"
            />
            <CustomInput
              type="input"
              control={form.control}
              name="price"
              label="Price"
            />
            <CustomInput
              type="textarea"
              control={form.control}
              name="description"
              label="Description"
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 w-full"
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
