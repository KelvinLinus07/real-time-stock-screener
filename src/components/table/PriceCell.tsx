"use client";

import { memo } from "react";
import { useStockStore } from "@/store/stockStore";
import { formatCurrency, formatPercent, cn } from "@/lib/formatters";

interface PriceCellProps {
  stockId: string;
  price: number;
  change: number;
  changePercent: number;
}

function PriceCellInner({ stockId, price, change, changePercent }: PriceCellProps) {
  const flash = useStockStore((s) => s.flashMap[stockId]);
  const isPositive = changePercent >= 0;

  return (
    <div
      className={cn(
        "flex flex-col items-end leading-tight px-1 rounded transition-colors",
        flash === "up" && "flash-up",
        flash === "down" && "flash-down"
      )}
    >
      <span className="font-mono text-sm font-medium">{formatCurrency(price)}</span>
      <span
        className={cn(
          "font-mono text-xs",
          isPositive ? "text-bullish" : "text-bearish"
        )}
      >
        {formatPercent(changePercent)} ({change >= 0 ? "+" : ""}
        {change.toFixed(2)})
      </span>
    </div>
  );
}

export const PriceCell = memo(PriceCellInner);
