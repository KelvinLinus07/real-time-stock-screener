"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MarketSummary from "@/components/layout/MarketSummary";
import FilterPanel from "@/components/filters/FilterPanel";
import StockTable from "@/components/table/StockTable";
import StockDetailPanel from "@/components/charts/StockDetailPanel";
import { useRealtimeSimulation } from "@/hooks/useRealtimeSimulation";
import { useFilteredStocks } from "@/hooks/useFilteredStocks";
import { Stock } from "@/types/stock";

export default function Dashboard() {
  useRealtimeSimulation(true);
  const filteredStocks = useFilteredStocks();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <MarketSummary />
          <FilterPanel />
          <StockTable
            data={filteredStocks}
            onRowClick={(stock) => setSelectedStock(stock)}
            selectedSymbol={selectedStock?.symbol ?? null}
          />
        </main>
      </div>

      {selectedStock && (
        <StockDetailPanel stock={selectedStock} onClose={() => setSelectedStock(null)} />
      )}
    </div>
  );
}
