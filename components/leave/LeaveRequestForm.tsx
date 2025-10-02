// components/leave/LeaveRequestForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { createLeaveRequest, getLeaveTypes } from "@/app/actions/leave";
import { LeaveRequestInput } from "@/types/leave";
import { useUser } from "@clerk/nextjs";

export default function LeaveRequestForm() {
  const { user } = useUser();
  const [form, setForm] = useState<Partial<LeaveRequestInput>>({});
  const [leaveTypes, setLeaveTypes] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch leave types from backend
  useEffect(() => {
    getLeaveTypes()
      .then((types) => setLeaveTypes(types))
      .catch(console.error);
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return alert("You must be logged in to submit a leave request");

    setLoading(true);
    try {
      await createLeaveRequest({
        ...(form as LeaveRequestInput),
        staff_id: user.id,
      });
      alert("Leave request submitted!");
      setForm({});
    } catch (err) {
      console.error(err);
      alert("Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-2xl shadow-md border border-border space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Leave Request Form</h2>

      <div className="space-y-2">
        <Label>Leave Type</Label>
        <Select onValueChange={(val) => handleChange("type_id", parseInt(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Select leave type" />
          </SelectTrigger>
          <SelectContent>
            {leaveTypes.map((lt) => (
              <SelectItem key={lt.id} value={lt.id.toString()}>
                {lt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Start Date</Label>
        <Input
          type="date"
          value={form.start_date ? new Date(form.start_date).toISOString().split("T")[0] : ""}
          onChange={(e) => handleChange("start_date", new Date(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>End Date</Label>
        <Input
          type="date"
          value={form.end_date ? new Date(form.end_date).toISOString().split("T")[0] : ""}
          onChange={(e) => handleChange("end_date", new Date(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Reason</Label>
        <Textarea
          value={form.reason || ""}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Provide a reason"
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading || !user} className="w-full">
        {loading ? "Submitting..." : "Submit Leave Request"}
      </Button>
    </div>
  );
}
