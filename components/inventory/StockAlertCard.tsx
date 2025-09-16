// components/inventory/stock-alert-card.tsx
import { InventoryItem } from "@/types/dataTypes";

type Props = {
  item: InventoryItem;
};

export default function StockAlertCard({ item }: Props) {
  const isExpired = item.expiry_date ? new Date(item.expiry_date) < new Date() : false;
  const isLowStock = item.quantity <= (item.reorder_level ?? 0);

  const expiryDateStr = item.expiry_date
    ? new Date(item.expiry_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="border rounded p-4 bg-white shadow">
      <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
      <p className="text-sm text-gray-600 mb-1">{item.category}</p>
      {item.description && <p className="text-sm mb-2">{item.description}</p>}
      {isLowStock && (
        <p className="text-red-600 font-semibold">Low Stock: {item.quantity}</p>
      )}
      {isExpired && (
        <p className="text-red-600 font-semibold">Expired: {expiryDateStr}</p>
      )}
      {!isLowStock && !isExpired && (
        <p className="text-green-600 font-semibold">Stock is sufficient</p>
      )}
    </div>
  );
}
