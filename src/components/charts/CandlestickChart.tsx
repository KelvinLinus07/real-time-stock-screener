"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  LineData,
  ColorType,
} from "lightweight-charts";
import { OHLCBar } from "@/types/stock";
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
} from "@/lib/mockEngine";

interface CandlestickChartProps {
  data: OHLCBar[];
  showSMA?: boolean;
  showEMA?: boolean;
  showBollinger?: boolean;
}

export default function CandlestickChart({
  data,
  showSMA = true,
  showEMA = true,
  showBollinger = true,
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const seriesRefs = useRef<ISeriesApi<"Line">[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#9ca3af",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#1f2430" },
        horzLines: { color: "#1f2430" },
      },
      width: containerRef.current.clientWidth,
      height: 380,
      timeScale: {
        borderColor: "#252b38",
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: "#252b38",
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#16c784",
      downColor: "#ea3943",
      borderVisible: false,
      wickUpColor: "#16c784",
      wickDownColor: "#ea3943",
    });
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      seriesRefs.current = [];
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    const candleSeries = candleSeriesRef.current;
    if (!chart || !candleSeries || data.length === 0) return;

    const candleData: CandlestickData[] = data.map((bar) => ({
      time: bar.time,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
    }));
    candleSeries.setData(candleData);

    // Remove previous overlay series
    for (const s of seriesRefs.current) {
      chart.removeSeries(s);
    }
    seriesRefs.current = [];

    if (showSMA) {
      const sma20 = calculateSMA(data, 20);
      const smaSeries = chart.addLineSeries({
        color: "#f59e0b",
        lineWidth: 1,
        title: "SMA 20",
      });
      smaSeries.setData(sma20 as LineData[]);
      seriesRefs.current.push(smaSeries);
    }

    if (showEMA) {
      const ema20 = calculateEMA(data, 20);
      const emaSeries = chart.addLineSeries({
        color: "#8b5cf6",
        lineWidth: 1,
        title: "EMA 20",
      });
      emaSeries.setData(ema20 as LineData[]);
      seriesRefs.current.push(emaSeries);
    }

    if (showBollinger) {
      const bb = calculateBollingerBands(data, 20, 2);
      const upperSeries = chart.addLineSeries({
        color: "rgba(96, 165, 250, 0.5)",
        lineWidth: 1,
        title: "BB Upper",
      });
      upperSeries.setData(bb.map((b) => ({ time: b.time, value: b.upper })) as LineData[]);
      seriesRefs.current.push(upperSeries);

      const lowerSeries = chart.addLineSeries({
        color: "rgba(96, 165, 250, 0.5)",
        lineWidth: 1,
        title: "BB Lower",
      });
      lowerSeries.setData(bb.map((b) => ({ time: b.time, value: b.lower })) as LineData[]);
      seriesRefs.current.push(lowerSeries);
    }

    chart.timeScale().fitContent();
  }, [data, showSMA, showEMA, showBollinger]);

  return <div ref={containerRef} className="w-full" />;
}
