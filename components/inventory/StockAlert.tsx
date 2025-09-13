// components/inventory/stock-alert.tsx
import StockAlertCard from "@/components/inventory/StockAlertCard";
import { getInventoryAlerts } from "@/utils/services/inventory"; // <-- import function directly
import { InventoryItem } from "@/types/dataTypes";

interface StockAlertProps {
  limit?: number; 
  showTitle?: boolean;
}

export default async function StockAlert({ limit, showTitle = true }: StockAlertProps) {
  const alerts: InventoryItem[] = await getInventoryAlerts();

  const visibleAlerts = limit ? alerts.slice(0, limit) : alerts;

  return (
    <div className="space-y-4">
      {showTitle && (
        <h1 className="text-2xl font-bold">
          Stock & Expiry Alerts
          <span className="ml-2 text-sm text-gray-500">({alerts.length})</span>
        </h1>
      )}
      {visibleAlerts.length === 0 ? (
        <p className="text-gray-500">✅ No alerts. All stock levels are good.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleAlerts.map((item) => (
            <StockAlertCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
