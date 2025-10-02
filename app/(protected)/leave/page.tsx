// app/approved/(protected)/leave/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { getLeaveBalances } from "@/utils/services/leave";
import { getLeaveTypes } from "@/app/actions/leave";
import LeaveRequestForm from "@/components/leave/LeaveRequestForm";
import LeaveBalanceCard from "@/components/leave/LeaveBalanceCard";

export default async function LeavePage() {
  // Get logged-in user from Clerk
  const user = await currentUser();

  if (!user?.id) {
    return <p className="text-red-500">You must be logged in to view this page.</p>;
  }

  const [balances, leaveTypes] = await Promise.all([
    getLeaveBalances(user.id),
    getLeaveTypes(),
  ]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-foreground">Request Leave</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <LeaveRequestForm />
        <LeaveBalanceCard balances={balances} />
      </div>
    </div>
  );
}
