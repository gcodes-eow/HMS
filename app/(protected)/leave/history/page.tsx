// app/approved/(protected)/leave/history/page.tsx
import LeaveHistoryTable from "@/components/leave/LeaveHistoryTable";

export default function LeaveHistoryPage() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">Leave History</h1>
      <LeaveHistoryTable />
    </div>
  );
}
