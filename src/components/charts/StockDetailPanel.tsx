"use client";

import { useMemo, useState, lazy, Suspense } from "react";
import { Stock } from "@/types/stock";
import { generateOHLCData } from "@/lib/mockEngine";
import {
  formatCurrency,
  formatMarketCap,
  formatVolume,
  formatPercent,
  cn,
} from "@/lib/formatters";

const CandlestickChart = lazy(() => import("@/components/charts/CandlestickChart"));
const VolumeChart = lazy(() => import("@/components/charts/VolumeChart"));
const RSIChart = lazy(() => import("@/components/charts/RSIChart"));
const MACDChart = lazy(() => import("@/components/charts/MACDChart"));

interface StockDetailPanelProps {
  stock: Stock | null;
  onClose: () => void;
}

type IndicatorTab = "price" | "rsi" | "macd";

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full bg-surfaceLight/40 rounded-md animate-pulse flex items-center justify-center text-xs text-textSecondary"
      style={{ height }}
    >
      Loading chart...
    </div>
  );
}

function StatItem({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-textSecondary">{label}</span>
      <span className={cn("text-sm font-mono font-medium", valueClass)}>{value}</span>
    </div>
  );
}

export default function StockDetailPanel({ stock, onClose }: StockDetailPanelProps) {
  const [tab, setTab] = useState<IndicatorTab>("price");
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);

  const ohlcData = useMemo(() => {
    if (!stock) return [];
    return generateOHLCData(stock.symbol, 180);
  }, [stock]);

  if (!stock) return null;

  const isPositive = stock.changePercent >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 p-0 md:p-4">
      <div className="bg-surface border border-border rounded-t-xl md:rounded-xl w-full md:max-w-4xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface border-b border-border px-4 py-3 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-mono">{stock.symbol}</h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-surfaceLight text-textSecondary">
                {stock.sector}
              </span>
            </div>
            <p className="text-sm text-textSecondary">{stock.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-textPrimary text-2xl leading-none px-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Price header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-3xl font-bold font-mono">{formatCurrency(stock.price)}</div>
              <div className={cn("text-sm font-mono mt-1", isPositive ? "text-bullish" : "text-bearish")}>
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)} ({formatPercent(stock.changePercent)})
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatItem label="Day High" value={formatCurrency(stock.dayHigh)} />
              <StatItem label="Day Low" value={formatCurrency(stock.dayLow)} />
              <StatItem label="52W High" value={formatCurrency(stock.yearHigh)} />
              <StatItem label="52W Low" value={formatCurrency(stock.yearLow)} />
            </div>
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 bg-surfaceLight/40 rounded-lg p-3">
            <StatItem label="Market Cap" value={formatMarketCap(stock.marketCap)} />
            <StatItem label="Volume" value={formatVolume(stock.volume)} />
            <StatItem label="P/E Ratio" value={stock.pe.toFixed(2)} valueClass={stock.pe < 0 ? "text-bearish" : undefined} />
            <StatItem label="EPS" value={stock.eps.toFixed(2)} />
            <StatItem
              label="RSI (14)"
              value={stock.rsi.toFixed(1)}
              valueClass={stock.rsi >= 70 ? "text-bearish" : stock.rsi <= 30 ? "text-bullish" : undefined}
            />
            <StatItem
              label="MACD Hist"
              value={stock.macd.histogram.toFixed(3)}
              valueClass={stock.macd.histogram >= 0 ? "text-bullish" : "text-bearish"}
            />
            <StatItem label="SMA 20 / 50" value={`${stock.sma20.toFixed(2)} / ${stock.sma50.toFixed(2)}`} />
            <StatItem label="EMA 20 / 50" value={`${stock.ema20.toFixed(2)} / ${stock.ema50.toFixed(2)}`} />
            <StatItem
              label="Bollinger Bands"
              value={`${stock.bollinger.lower.toFixed(2)} - ${stock.bollinger.upper.toFixed(2)}`}
            />
            <StatItem label="Industry" value={stock.industry} />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-border">
            {(["price", "rsi", "macd"] as IndicatorTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
                  tab === t
                    ? "border-accent text-accent"
                    : "border-transparent text-textSecondary hover:text-textPrimary"
                )}
              >
                {t === "price" ? "Price & Volume" : t.toUpperCase()}
              </button>
            ))}

            {tab === "price" && (
              <div className="ml-auto flex items-center gap-3 pb-2">
                <label className="flex items-center gap-1 text-xs text-textSecondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSMA}
                    onChange={(e) => setShowSMA(e.target.checked)}
                    className="accent-amber-500"
                  />
                  SMA
                </label>
                <label className="flex items-center gap-1 text-xs text-textSecondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showEMA}
                    onChange={(e) => setShowEMA(e.target.checked)}
                    className="accent-violet-500"
                  />
                  EMA
                </label>
                <label className="flex items-center gap-1 text-xs text-textSecondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBollinger}
                    onChange={(e) => setShowBollinger(e.target.checked)}
                    className="accent-blue-500"
                  />
                  Bollinger
                </label>
              </div>
            )}
          </div>

          {/* Chart area */}
          <div>
            {tab === "price" && (
              <div className="space-y-2">
                <Suspense fallback={<ChartSkeleton height={380} />}>
                  <CandlestickChart
                    data={ohlcData}
                    showSMA={showSMA}
                    showEMA={showEMA}
                    showBollinger={showBollinger}
                  />
                </Suspense>
                <Suspense fallback={<ChartSkeleton height={120} />}>
                  <VolumeChart data={ohlcData} />
                </Suspense>
              </div>
            )}
            {tab === "rsi" && (
              <Suspense fallback={<ChartSkeleton height={140} />}>
                <RSIChart data={ohlcData} />
              </Suspense>
            )}
            {tab === "macd" && (
              <Suspense fallback={<ChartSkeleton height={140} />}>
                <MACDChart data={ohlcData} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
