import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { Stock } from "@/types/stock";
import { formatMarketCap, formatVolume, cn } from "@/lib/formatters";
import { PriceCell } from "@/components/table/PriceCell";

const columnHelper = createColumnHelper<Stock>();

export const stockColumns: ColumnDef<Stock, any>[] = [
  columnHelper.accessor("symbol", {
    header: "Symbol",
    size: 100,
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-mono font-semibold text-sm">{info.getValue()}</span>
        <span className="text-xs text-textSecondary truncate max-w-[140px]">
          {info.row.original.name}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("sector", {
    header: "Sector",
    size: 160,
    cell: (info) => (
      <span className="text-xs text-textSecondary">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("price", {
    header: () => <div className="text-right">Price / Change</div>,
    size: 150,
    cell: (info) => (
      <PriceCell
        stockId={info.row.original.id}
        price={info.getValue()}
        change={info.row.original.change}
        changePercent={info.row.original.changePercent}
      />
    ),
  }),
  columnHelper.accessor("marketCap", {
    header: () => <div className="text-right">Market Cap</div>,
    size: 110,
    cell: (info) => (
      <div className="text-right font-mono text-sm">{formatMarketCap(info.getValue())}</div>
    ),
  }),
  columnHelper.accessor("volume", {
    header: () => <div className="text-right">Volume</div>,
    size: 100,
    cell: (info) => (
      <div className="text-right font-mono text-sm">{formatVolume(info.getValue())}</div>
    ),
  }),
  columnHelper.accessor("pe", {
    header: () => <div className="text-right">P/E</div>,
    size: 80,
    cell: (info) => {
      const value = info.getValue();
      return (
        <div className={cn("text-right font-mono text-sm", value < 0 && "text-bearish")}>
          {value.toFixed(2)}
        </div>
      );
    },
  }),
  columnHelper.accessor("eps", {
    header: () => <div className="text-right">EPS</div>,
    size: 80,
    cell: (info) => (
      <div className="text-right font-mono text-sm">{info.getValue().toFixed(2)}</div>
    ),
  }),
  columnHelper.accessor("rsi", {
    header: () => <div className="text-right">RSI</div>,
    size: 90,
    cell: (info) => {
      const value = info.getValue();
      const color =
        value >= 70 ? "text-bearish" : value <= 30 ? "text-bullish" : "text-textPrimary";
      return <div className={cn("text-right font-mono text-sm", color)}>{value.toFixed(1)}</div>;
    },
  }),
  columnHelper.accessor((row) => row.macd.histogram, {
    id: "macd",
    header: () => <div className="text-right">MACD Hist</div>,
    size: 100,
    cell: (info) => {
      const value = info.getValue();
      return (
        <div
          className={cn(
            "text-right font-mono text-sm",
            value >= 0 ? "text-bullish" : "text-bearish"
          )}
        >
          {value.toFixed(3)}
        </div>
      );
    },
  }),
  columnHelper.accessor("sma20", {
    header: () => <div className="text-right">SMA20</div>,
    size: 90,
    cell: (info) => (
      <div className="text-right font-mono text-sm text-textSecondary">
        {info.getValue().toFixed(2)}
      </div>
    ),
  }),
  columnHelper.accessor("ema20", {
    header: () => <div className="text-right">EMA20</div>,
    size: 90,
    cell: (info) => (
      <div className="text-right font-mono text-sm text-textSecondary">
        {info.getValue().toFixed(2)}
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.bollinger.upper, {
    id: "bbUpper",
    header: () => <div className="text-right">BB Upper</div>,
    size: 100,
    cell: (info) => (
      <div className="text-right font-mono text-sm text-textSecondary">
        {info.getValue().toFixed(2)}
      </div>
    ),
  }),
  columnHelper.accessor((row) => row.bollinger.lower, {
    id: "bbLower",
    header: () => <div className="text-right">BB Lower</div>,
    size: 100,
    cell: (info) => (
      <div className="text-right font-mono text-sm text-textSecondary">
        {info.getValue().toFixed(2)}
      </div>
    ),
  }),
];
