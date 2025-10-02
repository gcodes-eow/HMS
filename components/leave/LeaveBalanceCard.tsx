// components/leave/LeaveBalanceCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface Props {
  balances: {
    type: string;
    used: number;
    remaining: number | null;
    max: number | null;
  }[];
}

export default function LeaveBalanceCard({ balances }: Props) {
  return (
    <Card className="bg-card shadow-md rounded-2xl border border-border">
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Leave Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {balances.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leave types available</p>
        ) : (
          balances.map((b) => (
            <div key={b.type} className="flex justify-between text-sm">
              <span>{b.type}</span>
              <span className="font-semibold">
                {b.remaining !== null ? `${b.remaining} days` : "Unlimited"}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
