import Link from "next/link";
import { getRole } from "@/utils/roles";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreditCard, ReceiptText } from "lucide-react";

const CashierDashboard = async () => {
  const role = await getRole();
  if (role !== "cashier") return redirect("/unauthorized");

  const user = await currentUser();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">
          Welcome, {user?.firstName}
        </h1>
        <p className="text-muted-foreground">
          Handle billing, payments, and financial reporting.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/record/billing"
          className="p-4 border rounded-lg shadow hover:shadow-md transition flex items-center gap-4"
        >
          <ReceiptText className="text-gray-600" size={28} />
          <div>
            <h3 className="font-semibold text-lg">Billing Records</h3>
            <p className="text-sm text-muted-foreground">
              View and manage patient bills.
            </p>
          </div>
        </Link>

        {/* Add more links as needed */}
        <Link
          href="/reports/payments"
          className="p-4 border rounded-lg shadow hover:shadow-md transition flex items-center gap-4"
        >
          <CreditCard className="text-gray-600" size={28} />
          <div>
            <h3 className="font-semibold text-lg">Payment Reports</h3>
            <p className="text-sm text-muted-foreground">
              Analyze income and payment history.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CashierDashboard;
