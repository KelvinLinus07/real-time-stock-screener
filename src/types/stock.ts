export interface BollingerBands {
  upper: number;
  middle: number;
  lower: number;
}

export interface MACDValue {
  macd: number;
  signal: number;
  histogram: number;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  pe: number;
  eps: number;
  rsi: number;
  macd: MACDValue;
  sma20: number;
  sma50: number;
  ema20: number;
  ema50: number;
  bollinger: BollingerBands;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
}

export interface OHLCBar {
  time: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FilterState {
  search: string;
  sectors: string[];
  priceMin: number | null;
  priceMax: number | null;
  marketCapMin: number | null;
  marketCapMax: number | null;
  volumeMin: number | null;
  volumeMax: number | null;
  peMin: number | null;
  peMax: number | null;
  rsiMin: number | null;
  rsiMax: number | null;
}

export type SortDirection = "asc" | "desc";
