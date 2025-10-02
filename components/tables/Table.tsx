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
    <table className="w-full mt-4 border-collapse bg-card text-card-foreground">
      {/* Desktop header */}
      <thead className="hidden md:table-header-group bg-muted text-muted-foreground">
        <tr className="text-left text-sm lg:uppercase">
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
              className="text-muted-foreground text-base py-10 text-center"
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
              className="text-muted-foreground text-base py-10 text-center"
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
                      <div className="flex flex-col gap-2 rounded-xl border bg-muted/30 p-3 text-sm">
                        {columns.map((col) => (
                          <div
                            key={col.key}
                            className="flex justify-between gap-2 border-b last:border-0 py-1"
                          >
                            <span className="font-medium text-muted-foreground">
                              {col.header}
                            </span>
                            <span className="text-foreground">
                              {String((item as any)[col.key] ?? "-")}
                            </span>
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
