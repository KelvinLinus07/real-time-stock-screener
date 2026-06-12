import { useMemo } from "react";
import { useStockStore } from "@/store/stockStore";
import { useFilterStore } from "@/store/filterStore";
import { Stock } from "@/types/stock";

export function useFilteredStocks(): Stock[] {
  const stocks = useStockStore((s) => s.stocks);

  const search = useFilterStore((s) => s.search);
  const sectors = useFilterStore((s) => s.sectors);
  const priceMin = useFilterStore((s) => s.priceMin);
  const priceMax = useFilterStore((s) => s.priceMax);
  const marketCapMin = useFilterStore((s) => s.marketCapMin);
  const marketCapMax = useFilterStore((s) => s.marketCapMax);
  const volumeMin = useFilterStore((s) => s.volumeMin);
  const volumeMax = useFilterStore((s) => s.volumeMax);
  const peMin = useFilterStore((s) => s.peMin);
  const peMax = useFilterStore((s) => s.peMax);
  const rsiMin = useFilterStore((s) => s.rsiMin);
  const rsiMax = useFilterStore((s) => s.rsiMax);

  return useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    return stocks.filter((stock) => {
      if (searchLower) {
        const matchesSearch =
          stock.symbol.toLowerCase().includes(searchLower) ||
          stock.name.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (sectors.length > 0 && !sectors.includes(stock.sector)) return false;

      if (priceMin !== null && stock.price < priceMin) return false;
      if (priceMax !== null && stock.price > priceMax) return false;

      if (marketCapMin !== null && stock.marketCap < marketCapMin) return false;
      if (marketCapMax !== null && stock.marketCap > marketCapMax) return false;

      if (volumeMin !== null && stock.volume < volumeMin) return false;
      if (volumeMax !== null && stock.volume > volumeMax) return false;

      if (peMin !== null && stock.pe < peMin) return false;
      if (peMax !== null && stock.pe > peMax) return false;

      if (rsiMin !== null && stock.rsi < rsiMin) return false;
      if (rsiMax !== null && stock.rsi > rsiMax) return false;

      return true;
    });
  }, [
    stocks,
    search,
    sectors,
    priceMin,
    priceMax,
    marketCapMin,
    marketCapMax,
    volumeMin,
    volumeMax,
    peMin,
    peMax,
    rsiMin,
    rsiMax,
  ]);
}
