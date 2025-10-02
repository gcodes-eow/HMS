// components/events/EventAnnouncementForm.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventSchema, AnnouncementSchema, EventInput, AnnouncementInput } from "@/lib/schema";
import { createEvent, createAnnouncement } from "@/app/actions/events";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/Form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/Select";
import { toast } from "sonner";
import { useState } from "react";

type FormType = "event" | "announcement";

export default function EventAnnouncementForm() {
  const [formType, setFormType] = useState<FormType>("event");

  const eventForm = useForm<EventInput>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "MEETING",
      start_date: new Date(),
      end_date: new Date(),
      location: "",
      status: "CONFIRMED",
      created_by_id: "",
      created_by_role: "ADMIN",
    },
  });

  const announcementForm = useForm<AnnouncementInput>({
    resolver: zodResolver(AnnouncementSchema),
    defaultValues: {
      title: "",
      message: "",
      status: "DRAFT",
      created_by_id: "",
    },
  });

  const handleSubmitEvent: SubmitHandler<EventInput> = async (values) => {
    const res = await createEvent(values);
    if (res.success) {
      toast.success("Event created successfully");
      eventForm.reset();
    } else {
      toast.error(res.message || "Failed to create event");
    }
  };

  const handleSubmitAnnouncement: SubmitHandler<AnnouncementInput> = async (values) => {
    const res = await createAnnouncement(values);
    if (res.success) {
      toast.success("Announcement created successfully");
      announcementForm.reset();
    } else {
      toast.error(res.message || "Failed to create announcement");
    }
  };

  return (
    <div>
      {/* Form Type Switcher */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Form Type</label>
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value as FormType)}
          className="border rounded p-2 w-full"
        >
          <option value="event">Event</option>
          <option value="announcement">Announcement</option>
        </select>
      </div>

      {/* Event Form */}
      {formType === "event" ? (
        <Form {...eventForm}>
          <form onSubmit={eventForm.handleSubmit(handleSubmitEvent)} className="space-y-4">
            <FormField
              control={eventForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={eventForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      value={field.value ?? ""}
                      className="w-full border rounded p-2"
                      placeholder="Enter description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={eventForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEETING">Meeting</SelectItem>
                        <SelectItem value="TRAINING">Training</SelectItem>
                        <SelectItem value="HOLIDAY">Holiday</SelectItem>
                        <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={eventForm.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={eventForm.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={eventForm.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Enter location" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 text-white">
              Submit Event
            </Button>
          </form>
        </Form>
      ) : (
        /* Announcement Form */
        <Form {...announcementForm}>
          <form onSubmit={announcementForm.handleSubmit(handleSubmitAnnouncement)} className="space-y-4">
            <FormField
              control={announcementForm.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={announcementForm.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      value={field.value ?? ""}
                      className="w-full border rounded p-2"
                      placeholder="Enter message"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-blue-600 text-white">
              Submit Announcement
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
