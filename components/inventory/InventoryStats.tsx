// components/inventory/inventory-stats.tsx
type Props = {
  totalItems: number;
  lowStockCount: number;
};

export default function InventoryStats({ totalItems, lowStockCount }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-white p-4 rounded shadow">
        <h4 className="text-gray-500 text-sm">Total Items</h4>
        <p className="text-2xl font-bold">{totalItems}</p>
      </div>
      <div className="bg-red-100 p-4 rounded shadow">
        <h4 className="text-gray-500 text-sm">Low Stock</h4>
        <p className="text-2xl font-bold">{lowStockCount}</p>
      </div>
    </div>
  );
}
