import { useEffect } from "react";
import { useStockStore } from "@/store/stockStore";

export function useRealtimeSimulation(autoStart: boolean = true) {
  const initStocks = useStockStore((s) => s.initStocks);
  const startRealtime = useStockStore((s) => s.startRealtime);
  const stopRealtime = useStockStore((s) => s.stopRealtime);
  const isRealtimeActive = useStockStore((s) => s.isRealtimeActive);

  useEffect(() => {
    initStocks();
    if (autoStart) {
      startRealtime();
    }
    return () => {
      stopRealtime();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isRealtimeActive, startRealtime, stopRealtime };
}
