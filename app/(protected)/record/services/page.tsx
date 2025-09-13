// app/(protected)/record/services/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Services } from "@prisma/client";
import { toast } from "sonner";

import { Table } from "@/components/tables/Table";
import { AddService } from "@/components/dialogs/AddService";
import { EditService } from "@/components/dialogs/EditService";
import { ViewService } from "@/components/dialogs/ViewService";
import { ActionDialog } from "@/components/ActionDialog";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

import { fetchServices } from "@/app/actions/medicalServices";
import { Eye, Pencil, Trash2 } from "lucide-react";

const columns = [
  { header: "ID", key: "id", className: "hidden md:table-cell" },
  { header: "Service Name", key: "service_name", className: "hidden md:table-cell" },
  { header: "Price", key: "price", className: "hidden md:table-cell" },
  { header: "Description", key: "description", className: "hidden xl:table-cell" },
  { header: "Actions", key: "action" },
];

const ServiceListPage = () => {
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = async () => {
    setLoading(true);
    const res = await fetchServices();
    if (res.success && res.data) {
      setServices(res.data);
    } else {
      toast.error(res.message || "Failed to fetch services");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const ServiceActions = ({ serviceId }: { serviceId: number }) => (
    <div className="flex gap-2">
      {/* View */}
      <ViewService serviceId={serviceId}>
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600">
          <Eye size={16} />
        </button>
      </ViewService>

      {/* Edit */}
      <EditService serviceId={serviceId} onServiceUpdated={loadServices}>
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-yellow-500 text-white hover:bg-yellow-600">
          <Pencil size={16} />
        </button>
      </EditService>

      {/* Delete */}
      <ActionDialog
        type="delete"
        id={String(serviceId)}
        deleteType="service"
        onDeleted={loadServices}
      >
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600">
          <Trash2 size={16} />
        </button>
      </ActionDialog>
    </div>
  );

  /** Desktop row — wrap all <td> in a <tr> */
  const renderRow = (item: Services) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
    >
      <td className="hidden md:table-cell py-2">{item.id}</td>
      <td className="hidden md:table-cell py-2">{item.service_name}</td>
      <td className="hidden md:table-cell py-2">{item.price.toFixed(2)}</td>
      <td className="hidden xl:table-cell py-2 w-[50%] line-clamp-1">
        {item.description}
      </td>
      <td className="py-2">
        <ServiceActions serviceId={item.id} />
      </td>
    </tr>
  );

  /** Mobile row (tds only, full width) */
  const mobileRenderRow = (item: Services) => (
    <td colSpan={columns.length} className="p-4">
      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <span>
          <strong>ID:</strong> {item.id}
        </span>
        <span>
          <strong>Name:</strong> {item.service_name}
        </span>
        <span>
          <strong>Price:</strong> {item.price.toFixed(2)}
        </span>
        <span>
          <strong>Description:</strong> {item.description}
        </span>
        <ServiceActions serviceId={item.id} />
      </div>
    </td>
  );

  return (
    <div className="bg-white rounded-xl p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="capitalize">Services</CardTitle>
          <CardDescription>
            Manage all services directly from this section.
          </CardDescription>
        </div>
        <AddService onServiceAdded={loadServices} />
      </CardHeader>

      <CardContent>
        <Table
          columns={columns}
          renderRow={renderRow}
          mobileRenderRow={mobileRenderRow}
          data={services}
          isLoading={loading}
        />
      </CardContent>
    </div>
  );
};

export default ServiceListPage;
