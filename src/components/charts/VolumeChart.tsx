"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ColorType, HistogramData } from "lightweight-charts";
import { OHLCBar } from "@/types/stock";

interface VolumeChartProps {
  data: OHLCBar[];
}

export default function VolumeChart({ data }: VolumeChartProps) {
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
      height: 120,
      timeScale: {
        borderColor: "#252b38",
        visible: true,
      },
      rightPriceScale: {
        borderColor: "#252b38",
      },
    });

    chartRef.current = chart;

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      color: "#2563eb",
    });

    const volumeData: HistogramData[] = data.map((bar) => ({
      time: bar.time,
      value: bar.volume,
      color: bar.close >= bar.open ? "rgba(22, 199, 132, 0.6)" : "rgba(234, 57, 67, 0.6)",
    }));
    volumeSeries.setData(volumeData);
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
