"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ColorType, LineData, IPriceLine } from "lightweight-charts";
import { OHLCBar } from "@/types/stock";
import { calculateRSI } from "@/lib/mockEngine";

interface RSIChartProps {
  data: OHLCBar[];
}

export default function RSIChart({ data }: RSIChartProps) {
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

    const rsiSeries = chart.addLineSeries({
      color: "#a78bfa",
      lineWidth: 2,
      title: "RSI (14)",
    });

    const rsiData = calculateRSI(data, 14);
    rsiSeries.setData(rsiData as LineData[]);

    const overboughtLine: IPriceLine = rsiSeries.createPriceLine({
      price: 70,
      color: "rgba(234, 57, 67, 0.5)",
      lineWidth: 1,
      lineStyle: 2,
      title: "Overbought",
    });

    const oversoldLine: IPriceLine = rsiSeries.createPriceLine({
      price: 30,
      color: "rgba(22, 199, 132, 0.5)",
      lineWidth: 1,
      lineStyle: 2,
      title: "Oversold",
    });

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
