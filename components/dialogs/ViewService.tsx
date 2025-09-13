// components/dialogs/ViewService.tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { getServiceById } from "@/app/actions/medicalServices";
import { CardHeader, CardDescription } from "../ui/Card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";

interface ViewServiceProps {
  serviceId: number;
  children?: ReactNode;
}

export const ViewService: React.FC<ViewServiceProps> = ({ serviceId, children }) => {
  const [serviceData, setServiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      const res = await getServiceById(serviceId);
      if (res.success && res.data) {
        setServiceData(res.data);
      }
      setLoading(false);
    };
    fetchService();
  }, [serviceId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-md w-full">
        <CardHeader>
          <DialogTitle>Service Details</DialogTitle>
          <CardDescription>View the complete service information.</CardDescription>
        </CardHeader>

        {loading ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <div className="space-y-3 p-2 sm:p-4 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-semibold">ID:</span>
              <span>{serviceData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Service Name:</span>
              <span>{serviceData.service_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Price:</span>
              <span>{serviceData.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Description:</span>
              <span>{serviceData.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Created At:</span>
              <span>{new Date(serviceData.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Updated At:</span>
              <span>{new Date(serviceData.updated_at).toLocaleString()}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
