import { Stock, OHLCBar } from "@/types/stock";

// Seeded pseudo-random generator (mulberry32) so output is deterministic
// per seed -> avoids hydration mismatches when called with fixed seeds.
export function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const SECTORS: Record<string, string[]> = {
  Technology: ["Software", "Semiconductors", "Hardware", "IT Services", "Cloud Computing"],
  Healthcare: ["Pharmaceuticals", "Biotechnology", "Medical Devices", "Healthcare Services"],
  Financials: ["Banks", "Insurance", "Asset Management", "Fintech"],
  Energy: ["Oil & Gas", "Renewable Energy", "Coal", "Utilities"],
  "Consumer Discretionary": ["Retail", "Automobiles", "E-commerce", "Hospitality"],
  "Consumer Staples": ["Food & Beverage", "Household Products", "Personal Care"],
  Industrials: ["Aerospace & Defense", "Machinery", "Transportation", "Construction"],
  Materials: ["Chemicals", "Metals & Mining", "Paper & Packaging"],
  "Real Estate": ["REITs", "Real Estate Development", "Real Estate Services"],
  "Communication Services": ["Telecom", "Media", "Entertainment", "Social Platforms"],
  Utilities: ["Electric Utilities", "Gas Utilities", "Water Utilities"],
};

const PREFIXES = [
  "Alpha", "Beta", "Omega", "Nova", "Apex", "Zenith", "Vertex", "Pinnacle", "Quantum",
  "Stellar", "Horizon", "Pioneer", "Catalyst", "Summit", "Vantage", "Eagle", "Falcon",
  "Titan", "Atlas", "Orion", "Phoenix", "Meridian", "Crescent", "Pacific", "Global",
  "United", "National", "Universal", "Premier", "Sterling", "Crown", "Royal", "Imperial",
  "Liberty", "Patriot", "Frontier", "Legacy", "Pinewood", "Ironclad", "Silverline",
  "Goldcrest", "Bluechip", "Greenfield", "Redstone", "Whitestone", "Blackrock",
  "Eastwind", "Westgate", "Northstar", "Southport",
];

const SUFFIXES = [
  "Industries", "Holdings", "Group", "Corp", "Technologies", "Systems", "Solutions",
  "Enterprises", "Partners", "Labs", "Networks", "Dynamics", "Capital", "Resources",
  "Ventures", "Energy", "Materials", "Pharma", "Biotech", "Motors", "Foods", "Retail",
  "Logistics", "Communications", "Media", "Properties", "Bank", "Insurance",
];

function generateSymbol(rand: () => number, index: number): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const len = 3 + Math.floor(rand() * 2);
  let sym = "";
  for (let i = 0; i < len; i++) {
    sym += letters[Math.floor(rand() * letters.length)];
  }
  return sym + (index % 7 === 0 ? letters[Math.floor(rand() * letters.length)] : "");
}

function round(num: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

function generateStock(index: number): Stock {
  const rand = mulberry32(index * 7919 + 12345);

  const sectorNames = Object.keys(SECTORS);
  const sector = sectorNames[Math.floor(rand() * sectorNames.length)];
  const industries = SECTORS[sector];
  const industry = industries[Math.floor(rand() * industries.length)];

  const prefix = PREFIXES[Math.floor(rand() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(rand() * SUFFIXES.length)];
  const name = `${prefix} ${suffix}`;
  const symbol = generateSymbol(rand, index) + index.toString(36).toUpperCase().slice(-2);

  // Price ranges vary by "market cap tier" to create realistic distribution
  const tier = rand();
  let basePrice: number;
  if (tier < 0.1) basePrice = rand() * 5 + 0.5; // penny stocks
  else if (tier < 0.5) basePrice = rand() * 50 + 5;
  else if (tier < 0.85) basePrice = rand() * 300 + 50;
  else basePrice = rand() * 2000 + 300;

  const price = round(basePrice, 2);
  const changePercent = round((rand() - 0.5) * 8, 2);
  const previousClose = round(price / (1 + changePercent / 100), 2);
  const change = round(price - previousClose, 2);

  const sharesOutstanding = Math.floor(rand() * 5_000_000_000) + 1_000_000;
  const marketCap = Math.floor(price * sharesOutstanding);

  const volume = Math.floor(rand() * 50_000_000) + 10_000;

  const pe = round(rand() * 60 - 5, 2); // can be negative for losses
  const eps = pe !== 0 ? round(price / pe, 2) : 0;

  const rsi = round(rand() * 100, 2);

  const macdVal = round((rand() - 0.5) * 5, 3);
  const signalVal = round(macdVal + (rand() - 0.5) * 1.5, 3);
  const macd = {
    macd: macdVal,
    signal: signalVal,
    histogram: round(macdVal - signalVal, 3),
  };

  const sma20 = round(price * (1 + (rand() - 0.5) * 0.05), 2);
  const sma50 = round(price * (1 + (rand() - 0.5) * 0.08), 2);
  const ema20 = round(price * (1 + (rand() - 0.5) * 0.04), 2);
  const ema50 = round(price * (1 + (rand() - 0.5) * 0.07), 2);

  const bandWidth = price * (0.02 + rand() * 0.06);
  const bollinger = {
    upper: round(price + bandWidth, 2),
    middle: round(price, 2),
    lower: round(price - bandWidth, 2),
  };

  const dayHigh = round(price * (1 + rand() * 0.03), 2);
  const dayLow = round(price * (1 - rand() * 0.03), 2);
  const yearHigh = round(price * (1 + rand() * 0.6 + 0.05), 2);
  const yearLow = round(price * (1 - rand() * 0.5 - 0.02), 2);

  return {
    id: `stock-${index}`,
    symbol,
    name,
    sector,
    industry,
    price,
    previousClose,
    change,
    changePercent,
    marketCap,
    volume,
    pe,
    eps,
    rsi,
    macd,
    sma20,
    sma50,
    ema20,
    ema50,
    bollinger,
    dayHigh,
    dayLow,
    yearHigh,
    yearLow,
  };
}

export const TOTAL_STOCKS = 5000;

let cachedStocks: Stock[] | null = null;

/**
 * Generates (or returns cached) deterministic mock stock universe.
 * Safe to call on client only (called from zustand store init).
 */
export function generateStockUniverse(count: number = TOTAL_STOCKS): Stock[] {
  if (cachedStocks && cachedStocks.length === count) return cachedStocks;
  const stocks: Stock[] = [];
  for (let i = 0; i < count; i++) {
    stocks.push(generateStock(i));
  }
  cachedStocks = stocks;
  return stocks;
}

/**
 * Generates realistic mock OHLC historical data for a given stock symbol.
 * Deterministic based on symbol so the same stock always shows the same chart.
 */
export function generateOHLCData(symbol: string, days: number = 180): OHLCBar[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) {
    seed = (seed * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  const rand = mulberry32(seed);

  const bars: OHLCBar[] = [];
  let price = round(rand() * 200 + 20, 2);
  const today = new Date();

  // trend bias for the whole series
  const trendBias = (rand() - 0.5) * 0.002;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // skip weekends for realism
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const volatility = price * 0.025;
    const drift = price * trendBias;
    const open = price;
    const change = (rand() - 0.5) * volatility * 2 + drift;
    const close = Math.max(0.5, round(open + change, 2));
    const high = round(Math.max(open, close) + rand() * volatility * 0.6, 2);
    const low = round(Math.min(open, close) - rand() * volatility * 0.6, 2);
    const volume = Math.floor(rand() * 5_000_000) + 100_000;

    bars.push({
      time: date.toISOString().split("T")[0],
      open: round(open, 2),
      high,
      low,
      close,
      volume,
    });

    price = close;
  }

  return bars;
}

// ---- Technical indicator calculations on OHLC series ----

export function calculateSMA(data: OHLCBar[], period: number): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
    result.push({ time: data[i].time, value: round(sum / period, 2) });
  }
  return result;
}

export function calculateEMA(data: OHLCBar[], period: number): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  const k = 2 / (period + 1);
  let emaPrev: number | null = null;
  for (let i = 0; i < data.length; i++) {
    const close = data[i].close;
    if (emaPrev === null) {
      if (i >= period - 1) {
        let sum = 0;
        for (let j = 0; j < period; j++) sum += data[j].close;
        emaPrev = sum / period;
        result.push({ time: data[i].time, value: round(emaPrev, 2) });
      }
    } else {
      emaPrev = close * k + emaPrev * (1 - k);
      result.push({ time: data[i].time, value: round(emaPrev, 2) });
    }
  }
  return result;
}

export function calculateRSI(data: OHLCBar[], period: number = 14): { time: string; value: number }[] {
  const result: { time: string; value: number }[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i < data.length; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (i <= period) {
      if (diff >= 0) gains += diff;
      else losses -= diff;
      if (i === period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
        result.push({ time: data[i].time, value: round(rsi, 2) });
      }
      continue;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    gains = avgGain * period;
    losses = avgLoss * period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
    result.push({ time: data[i].time, value: round(rsi, 2) });
  }

  return result;
}

export function calculateMACD(
  data: OHLCBar[]
): { time: string; macd: number; signal: number; histogram: number }[] {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);

  const map26 = new Map(ema26.map((d) => [d.time, d.value]));
  const macdLine: { time: string; value: number }[] = [];

  for (const e12 of ema12) {
    const v26 = map26.get(e12.time);
    if (v26 !== undefined) {
      macdLine.push({ time: e12.time, value: round(e12.value - v26, 3) });
    }
  }

  // signal = EMA9 of macd line
  const k = 2 / (9 + 1);
  let signalPrev: number | null = null;
  const result: { time: string; macd: number; signal: number; histogram: number }[] = [];

  for (let i = 0; i < macdLine.length; i++) {
    const m = macdLine[i].value;
    if (signalPrev === null) {
      if (i >= 8) {
        let sum = 0;
        for (let j = i - 8; j <= i; j++) sum += macdLine[j].value;
        signalPrev = sum / 9;
        result.push({
          time: macdLine[i].time,
          macd: m,
          signal: round(signalPrev, 3),
          histogram: round(m - signalPrev, 3),
        });
      }
    } else {
      signalPrev = m * k + signalPrev * (1 - k);
      result.push({
        time: macdLine[i].time,
        macd: m,
        signal: round(signalPrev, 3),
        histogram: round(m - signalPrev, 3),
      });
    }
  }

  return result;
}

export function calculateBollingerBands(
  data: OHLCBar[],
  period: number = 20,
  stdDevMultiplier: number = 2
): { time: string; upper: number; middle: number; lower: number }[] {
  const result: { time: string; upper: number; middle: number; lower: number }[] = [];

  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += data[j].close;
    const mean = sum / period;

    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      variance += Math.pow(data[j].close - mean, 2);
    }
    const stdDev = Math.sqrt(variance / period);

    result.push({
      time: data[i].time,
      upper: round(mean + stdDev * stdDevMultiplier, 2),
      middle: round(mean, 2),
      lower: round(mean - stdDev * stdDevMultiplier, 2),
    });
  }

  return result;
}
