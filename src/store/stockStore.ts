import { create } from "zustand";
import { Stock } from "@/types/stock";
import { generateStockUniverse, mulberry32 } from "@/lib/mockEngine";

interface StockStore {
  stocks: Stock[];
  flashMap: Record<string, "up" | "down" | null>;
  isRealtimeActive: boolean;
  lastUpdate: number;
  initStocks: () => void;
  startRealtime: () => void;
  stopRealtime: () => void;
  applyTick: () => void;
}

let realtimeInterval: ReturnType<typeof setInterval> | null = null;
let tickSeed = 1;

export const useStockStore = create<StockStore>((set, get) => ({
  stocks: [],
  flashMap: {},
  isRealtimeActive: false,
  lastUpdate: 0,

  initStocks: () => {
    if (get().stocks.length > 0) return;
    const stocks = generateStockUniverse();
    set({ stocks, lastUpdate: Date.now() });
  },

  startRealtime: () => {
    if (realtimeInterval) return;
    set({ isRealtimeActive: true });
    realtimeInterval = setInterval(() => {
      get().applyTick();
    }, 1000);
  },

  stopRealtime: () => {
    if (realtimeInterval) {
      clearInterval(realtimeInterval);
      realtimeInterval = null;
    }
    set({ isRealtimeActive: false });
  },

  applyTick: () => {
    const { stocks } = get();
    if (stocks.length === 0) return;

    const rand = mulberry32(Date.now() % 2147483647 + tickSeed++);

    // Update a random subset of stocks (~3-6%) per tick for performance
    const updateCount = Math.floor(stocks.length * (0.03 + rand() * 0.03));
    const newFlashMap: Record<string, "up" | "down" | null> = {};
    const updatedStocks = stocks.slice();

    for (let i = 0; i < updateCount; i++) {
      const idx = Math.floor(rand() * stocks.length);
      const stock = updatedStocks[idx];

      const pctChange = (rand() - 0.5) * 0.6; // up to +/-0.3%
      const newPrice = Math.max(0.01, stock.price * (1 + pctChange / 100));
      const roundedPrice = Math.round(newPrice * 100) / 100;

      if (roundedPrice === stock.price) continue;

      const direction: "up" | "down" = roundedPrice > stock.price ? "up" : "down";
      const newChange = Math.round((roundedPrice - stock.previousClose) * 100) / 100;
      const newChangePercent =
        Math.round(((roundedPrice - stock.previousClose) / stock.previousClose) * 10000) / 100;

      updatedStocks[idx] = {
        ...stock,
        price: roundedPrice,
        change: newChange,
        changePercent: newChangePercent,
        volume: stock.volume + Math.floor(rand() * 5000),
        dayHigh: Math.max(stock.dayHigh, roundedPrice),
        dayLow: Math.min(stock.dayLow, roundedPrice),
        marketCap: Math.floor(
          (stock.marketCap / stock.price) * roundedPrice
        ),
      };

      newFlashMap[stock.id] = direction;
    }

    set({ stocks: updatedStocks, flashMap: newFlashMap, lastUpdate: Date.now() });

    // clear flash after short delay
    setTimeout(() => {
      const current = get().flashMap;
      const cleared: Record<string, "up" | "down" | null> = { ...current };
      let changed = false;
      for (const id of Object.keys(newFlashMap)) {
        if (cleared[id]) {
          cleared[id] = null;
          changed = true;
        }
      }
      if (changed) set({ flashMap: cleared });
    }, 800);
  },
}));
