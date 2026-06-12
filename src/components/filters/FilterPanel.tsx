"use client";

import { useState } from "react";
import { useFilterStore } from "@/store/filterStore";
import { cn } from "@/lib/formatters";

interface RangeInputProps {
  label: string;
  minValue: number | null;
  maxValue: number | null;
  onChange: (min: number | null, max: number | null) => void;
  step?: number;
  placeholder?: [string, string];
}

function RangeInput({ label, minValue, maxValue, onChange, step = 1, placeholder }: RangeInputProps) {
  return (
    <div>
      <label className="text-xs text-textSecondary mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step={step}
          value={minValue ?? ""}
          placeholder={placeholder?.[0] ?? "Min"}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value), maxValue)
          }
          className="w-full bg-surfaceLight border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
        />
        <span className="text-textSecondary text-xs">to</span>
        <input
          type="number"
          step={step}
          value={maxValue ?? ""}
          placeholder={placeholder?.[1] ?? "Max"}
          onChange={(e) =>
            onChange(minValue, e.target.value === "" ? null : Number(e.target.value))
          }
          className="w-full bg-surfaceLight border border-border rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}

export default function FilterPanel() {
  const [collapsed, setCollapsed] = useState(false);

  const search = useFilterStore((s) => s.search);
  const setSearch = useFilterStore((s) => s.setSearch);

  const priceMin = useFilterStore((s) => s.priceMin);
  const priceMax = useFilterStore((s) => s.priceMax);
  const setPriceRange = useFilterStore((s) => s.setPriceRange);

  const marketCapMin = useFilterStore((s) => s.marketCapMin);
  const marketCapMax = useFilterStore((s) => s.marketCapMax);
  const setMarketCapRange = useFilterStore((s) => s.setMarketCapRange);

  const volumeMin = useFilterStore((s) => s.volumeMin);
  const volumeMax = useFilterStore((s) => s.volumeMax);
  const setVolumeRange = useFilterStore((s) => s.setVolumeRange);

  const peMin = useFilterStore((s) => s.peMin);
  const peMax = useFilterStore((s) => s.peMax);
  const setPERange = useFilterStore((s) => s.setPERange);

  const rsiMin = useFilterStore((s) => s.rsiMin);
  const rsiMax = useFilterStore((s) => s.rsiMax);
  const setRSIRange = useFilterStore((s) => s.setRSIRange);

  const resetFilters = useFilterStore((s) => s.resetFilters);
  const sectors = useFilterStore((s) => s.sectors);

  const activeFilterCount =
    sectors.length +
    (priceMin !== null || priceMax !== null ? 1 : 0) +
    (marketCapMin !== null || marketCapMax !== null ? 1 : 0) +
    (volumeMin !== null || volumeMax !== null ? 1 : 0) +
    (peMin !== null || peMax !== null ? 1 : 0) +
    (rsiMin !== null || rsiMax !== null ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="bg-surface border border-border rounded-lg mx-4 mb-4">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <span className="text-xs bg-primary/20 text-accent px-2 py-0.5 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <span className="text-textSecondary text-xs">{collapsed ? "Show ▾" : "Hide ▴"}</span>
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 border-t border-border pt-4">
          <div className="mb-4">
            <label className="text-xs text-textSecondary mb-1 block">Search Symbol / Name</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. AAPL or Apple Industries"
              className="w-full bg-surfaceLight border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <RangeInput
              label="Price ($)"
              minValue={priceMin}
              maxValue={priceMax}
              onChange={setPriceRange}
              step={0.01}
            />
            <RangeInput
              label="Market Cap ($)"
              minValue={marketCapMin}
              maxValue={marketCapMax}
              onChange={setMarketCapRange}
              step={1000000}
              placeholder={["e.g. 1000000", "e.g. 1000000000"]}
            />
            <RangeInput
              label="Volume"
              minValue={volumeMin}
              maxValue={volumeMax}
              onChange={setVolumeRange}
              step={1000}
            />
            <RangeInput
              label="P/E Ratio"
              minValue={peMin}
              maxValue={peMax}
              onChange={setPERange}
              step={0.1}
            />
            <RangeInput
              label="RSI"
              minValue={rsiMin}
              maxValue={rsiMax}
              onChange={setRSIRange}
              step={1}
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            {sectors.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sectors.map((sector) => (
                  <span
                    key={sector}
                    className="text-xs bg-primary/15 text-accent px-2 py-1 rounded-md"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={resetFilters}
              className={cn(
                "text-xs px-3 py-1.5 rounded-md border border-border bg-surfaceLight hover:bg-border transition-colors ml-auto",
                activeFilterCount === 0 && "opacity-50 cursor-not-allowed"
              )}
              disabled={activeFilterCount === 0}
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
