"use client";

import { useMemo } from "react";
import { useStockStore } from "@/store/stockStore";
import { formatMarketCap, formatVolume, formatPercent, cn } from "@/lib/formatters";

interface SummaryCardProps {
  label: string;
  value: string;
  sub?: string;
  subPositive?: boolean | null;
}

function SummaryCard({ label, value, sub, subPositive }: SummaryCardProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-3 flex flex-col gap-1 min-w-0">
      <span className="text-xs text-textSecondary">{label}</span>
      <span className="text-lg font-semibold font-mono truncate">{value}</span>
      {sub !== undefined && (
        <span
          className={cn(
            "text-xs font-mono",
            subPositive === null || subPositive === undefined
              ? "text-textSecondary"
              : subPositive
              ? "text-bullish"
              : "text-bearish"
          )}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

export default function MarketSummary() {
  const stocks = useStockStore((s) => s.stocks);
  const lastUpdate = useStockStore((s) => s.lastUpdate);

  const stats = useMemo(() => {
    if (stocks.length === 0) {
      return {
        total: 0,
        advancing: 0,
        declining: 0,
        unchanged: 0,
        totalMarketCap: 0,
        totalVolume: 0,
        avgChange: 0,
      };
    }

    let advancing = 0;
    let declining = 0;
    let unchanged = 0;
    let totalMarketCap = 0;
    let totalVolume = 0;
    let sumChangePercent = 0;

    for (const stock of stocks) {
      if (stock.changePercent > 0) advancing++;
      else if (stock.changePercent < 0) declining++;
      else unchanged++;

      totalMarketCap += stock.marketCap;
      totalVolume += stock.volume;
      sumChangePercent += stock.changePercent;
    }

    return {
      total: stocks.length,
      advancing,
      declining,
      unchanged,
      totalMarketCap,
      totalVolume,
      avgChange: sumChangePercent / stocks.length,
    };
    // lastUpdate dependency forces periodic recompute during realtime ticks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stocks, lastUpdate]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4">
      <SummaryCard label="Total Stocks" value={stats.total.toLocaleString()} />
      <SummaryCard
        label="Advancing"
        value={stats.advancing.toLocaleString()}
        sub={`${((stats.advancing / Math.max(stats.total, 1)) * 100).toFixed(1)}%`}
        subPositive={true}
      />
      <SummaryCard
        label="Declining"
        value={stats.declining.toLocaleString()}
        sub={`${((stats.declining / Math.max(stats.total, 1)) * 100).toFixed(1)}%`}
        subPositive={false}
      />
      <SummaryCard label="Total Market Cap" value={formatMarketCap(stats.totalMarketCap)} />
      <SummaryCard label="Total Volume" value={formatVolume(stats.totalVolume)} />
      <SummaryCard
        label="Avg Change"
        value={formatPercent(stats.avgChange)}
        sub={stats.avgChange >= 0 ? "Market Up" : "Market Down"}
        subPositive={stats.avgChange >= 0}
      />
    </div>
  );
}
