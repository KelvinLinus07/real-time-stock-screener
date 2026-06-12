"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ColorType, LineData, HistogramData } from "lightweight-charts";
import { OHLCBar } from "@/types/stock";
import { calculateMACD } from "@/lib/mockEngine";

interface MACDChartProps {
  data: OHLCBar[];
}

export default function MACDChart({ data }: MACDChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

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
      height: 140,
      timeScale: {
        borderColor: "#252b38",
      },
      rightPriceScale: {
        borderColor: "#252b38",
      },
    });

    chartRef.current = chart;

    const macdData = calculateMACD(data);

    const histogramSeries = chart.addHistogramSeries({
      title: "Histogram",
    });
    histogramSeries.setData(
      macdData.map((d) => ({
        time: d.time,
        value: d.histogram,
        color: d.histogram >= 0 ? "rgba(22, 199, 132, 0.6)" : "rgba(234, 57, 67, 0.6)",
      })) as HistogramData[]
    );

    const macdSeries = chart.addLineSeries({
      color: "#3b82f6",
      lineWidth: 2,
      title: "MACD",
    });
    macdSeries.setData(macdData.map((d) => ({ time: d.time, value: d.macd })) as LineData[]);

    const signalSeries = chart.addLineSeries({
      color: "#f59e0b",
      lineWidth: 1,
      title: "Signal",
    });
    signalSeries.setData(macdData.map((d) => ({ time: d.time, value: d.signal })) as LineData[]);

    chart.timeScale().fitContent();

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
    };
  }, [data]);

  return <div ref={containerRef} className="w-full" />;
}
