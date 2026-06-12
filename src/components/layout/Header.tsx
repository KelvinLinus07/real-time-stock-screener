"use client";

import { useStockStore } from "@/store/stockStore";

export default function Header() {
  const isRealtimeActive = useStockStore((s) => s.isRealtimeActive);
  const startRealtime = useStockStore((s) => s.startRealtime);
  const stopRealtime = useStockStore((s) => s.stopRealtime);

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20 text-primary font-bold text-sm">
          SP
        </div>
        <div>
          <h1 className="text-sm font-semibold leading-tight">StockScreener Pro</h1>
          <p className="text-xs text-textSecondary leading-tight">Real-Time Market Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isRealtimeActive ? "bg-bullish animate-pulse" : "bg-textSecondary"
            }`}
          />
          <span className="text-textSecondary">
            {isRealtimeActive ? "Live" : "Paused"}
          </span>
        </div>

        <button
          onClick={() => (isRealtimeActive ? stopRealtime() : startRealtime())}
          className="text-xs px-3 py-1.5 rounded-md border border-border bg-surfaceLight hover:bg-border transition-colors"
        >
          {isRealtimeActive ? "Pause Feed" : "Resume Feed"}
        </button>
      </div>
    </header>
  );
}
