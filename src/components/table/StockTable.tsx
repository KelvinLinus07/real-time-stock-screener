"use client";

import { useRef, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Stock } from "@/types/stock";
import { stockColumns } from "@/components/table/columns";
import { cn } from "@/lib/formatters";

interface StockTableProps {
  data: Stock[];
  onRowClick?: (stock: Stock) => void;
  selectedSymbol?: string | null;
}

const ROW_HEIGHT = 52;

export default function StockTable({ data, onRowClick, selectedSymbol }: StockTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => stockColumns, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0;

  return (
    <div className="bg-surface border border-border rounded-lg mx-4 mb-4 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-sm font-semibold">Stock Screener</h2>
        <span className="text-xs text-textSecondary">
          Showing {rows.length.toLocaleString()} stocks
        </span>
      </div>

      <div ref={tableContainerRef} className="overflow-auto" style={{ height: "640px" }}>
        <table className="w-full text-sm border-collapse" style={{ tableLayout: "fixed" }}>
          <thead className="sticky top-0 z-10 bg-surfaceLight">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="text-left px-3 py-2.5 text-xs font-semibold text-textSecondary uppercase tracking-wide border-b border-border select-none cursor-pointer hover:text-textPrimary transition-colors whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && <span>▲</span>}
                      {header.column.getIsSorted() === "desc" && <span>▼</span>}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} colSpan={columns.length} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const stock = row.original;
              const isSelected = selectedSymbol === stock.symbol;
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(stock)}
                  className={cn(
                    "border-b border-border/50 hover:bg-surfaceLight/60 cursor-pointer transition-colors",
                    isSelected && "bg-primary/10"
                  )}
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 align-middle overflow-hidden">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} colSpan={columns.length} />
              </tr>
            )}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-textSecondary text-sm"
                >
                  No stocks match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
