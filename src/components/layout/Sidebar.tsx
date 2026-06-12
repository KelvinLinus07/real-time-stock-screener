"use client";

import { SECTORS } from "@/lib/mockEngine";
import { useFilterStore } from "@/store/filterStore";
import { cn } from "@/lib/formatters";

const NAV_ITEMS = [
  { label: "Overview", icon: "📊", active: true },
  { label: "Screener", icon: "🔍", active: false },
  { label: "Watchlist", icon: "⭐", active: false },
  { label: "Portfolio", icon: "💼", active: false },
  { label: "News", icon: "📰", active: false },
  { label: "Alerts", icon: "🔔", active: false },
];

export default function Sidebar() {
  const sectors = useFilterStore((s) => s.sectors);
  const toggleSector = useFilterStore((s) => s.toggleSector);
  const sectorNames = Object.keys(SECTORS);

  return (
    <aside className="hidden md:flex w-56 border-r border-border bg-surface flex-col shrink-0 overflow-y-auto">
      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left",
              item.active
                ? "bg-primary/15 text-accent font-medium"
                : "text-textSecondary hover:bg-surfaceLight hover:text-textPrimary"
            )}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-3 flex-1">
        <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-2 px-1">
          Sectors
        </h3>
        <div className="space-y-0.5">
          {sectorNames.map((sector) => {
            const isActive = sectors.includes(sector);
            return (
              <button
                key={sector}
                onClick={() => toggleSector(sector)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left",
                  isActive
                    ? "bg-primary/15 text-accent font-medium"
                    : "text-textSecondary hover:bg-surfaceLight hover:text-textPrimary"
                )}
              >
                <span className="truncate">{sector}</span>
                {isActive && <span className="text-accent text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border p-3 text-xs text-textSecondary">
        <p>Data simulated for demo purposes.</p>
        <p className="mt-1">© 2026 StockScreener Pro</p>
      </div>
    </aside>
  );
}
