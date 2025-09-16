// components/tables/Table.tsx
import React from "react";

export interface TableColumn {
  header: string;
  key: string;
  className?: string;
}

export interface TableProps<T extends { id?: string | number }> {
  columns: TableColumn[];
  renderRow: (item: T & { index: number }) => React.ReactNode; // should return <tr>
  data: T[];
  search?: string;
  category?: string;
  currentPage?: number;
  totalPages?: number;
  isLoading?: boolean;
  /** Optional mobile row renderer — must return <td>[] or custom layout */
  mobileRenderRow?: (item: T & { index: number }) => React.ReactNode;
}

export function Table<T extends { id?: string | number }>({
  columns,
  renderRow,
  data,
  search = "",
  category = "",
  isLoading = false,
  mobileRenderRow,
}: TableProps<T>) {
  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch = search
      ? Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      : true;

    const matchesCategory =
      category && category !== "all"
        ? String((item as any).category).toLowerCase() ===
          category.toLowerCase()
        : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <table className="w-full mt-4 border-collapse">
      {/* Desktop header */}
      <thead className="bg-gray-100 hidden md:table-header-group">
        <tr className="text-left text-gray-500 text-sm lg:uppercase">
          {columns.map(({ header, key, className }) => (
            <th key={key} className={`p-2 ${className ?? ""}`}>
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {/* Loading state */}
        {isLoading && (
          <tr>
            <td
              colSpan={columns.length}
              className="text-gray-400 text-base py-10 text-center"
            >
              Loading...
            </td>
          </tr>
        )}

        {/* No data state */}
        {!isLoading && filteredData.length < 1 && (
          <tr>
            <td
              colSpan={columns.length}
              className="text-gray-400 text-base py-10 text-center"
            >
              No Data Found
            </td>
          </tr>
        )}

        {/* Table rows */}
        {!isLoading &&
          filteredData.length > 0 &&
          filteredData.map((item, idx) => {
            const rowData = { ...item, index: idx };

            return (
              <React.Fragment key={item.id ?? idx}>
                {/* Mobile row */}
                <tr className="md:hidden">
                  <td colSpan={columns.length} className="p-3">
                    {mobileRenderRow ? (
                      <table className="w-full">
                        <tbody>
                          <tr>{mobileRenderRow(rowData)}</tr>
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex flex-col gap-1 text-sm text-gray-700">
                        {columns.map((col) => (
                          <div key={col.key} className="flex justify-between">
                            <span className="font-medium">{col.header}:</span>
                            <span>{String((item as any)[col.key] ?? "")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>

                {/* Desktop row — render as-is, must return <tr> */}
                {renderRow(rowData)}
              </React.Fragment>
            );
          })}
      </tbody>
    </table>
  );
}
