"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillingFormSchema } from "@/lib/schema";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";

type BillingFormData = z.infer<typeof BillingFormSchema>;

const CashierBillingForm = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  const form = useForm<BillingFormData>({
    resolver: zodResolver(BillingFormSchema),
    defaultValues: {
      payment_method: "CASH",
    },
  });

  const onSubmit = async (data: BillingFormData) => {
    console.log("Billing submitted:", data);
    alert("Billing record saved!");
    // TODO: Send to backend / persist
  };

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Billing Receipt",
  } as Parameters<typeof useReactToPrint>[0]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.html(pdfRef.current!, {
      callback: (pdf) => {
        pdf.save("billing_receipt.pdf");
      },
      x: 10,
      y: 10,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-2xl mx-auto p-6 border rounded-md shadow-sm"
      >
        <div ref={formRef}>
          <h2 className="text-xl font-semibold mb-4">Patient Billing</h2>

          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient ID</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter patient ID or number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="patient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter full name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Rendered</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="e.g., X-ray, blood test, etc." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (₦)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} placeholder="e.g., 5000" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <FormControl>
                  <select {...field} className="w-full border rounded px-2 py-1">
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="INSURANCE">Insurance</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Optional remarks..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={handlePrint}>
            Print Receipt
          </Button>
          <Button type="button" variant="ghost" onClick={handleDownloadPdf}>
            Download PDF
          </Button>
        </div>
      </form>

      <div ref={pdfRef} className="hidden">
        <h2>Billing Summary</h2>
        <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      </div>

      <div ref={componentRef} className="hidden">
        <h2>Billing Receipt</h2>
        <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      </div>
    </Form>
  );
};

export default CashierBillingForm;
