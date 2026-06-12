# StockScreener Pro — Real-Time Stock Screener

A production-style, internship-level **Real-Time Stock Screener** dashboard built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Table/Virtual, and Lightweight Charts. The UI is a hybrid of TradingView and Screener.in — dark, data-dense, and built for performance with 5,000+ rows.

---

## 1. Project Overview

StockScreener Pro simulates a live equity screener. It generates a deterministic universe of **5,000+ mock stocks** (with realistic price, fundamentals, and technical indicators), renders them in a virtualized, sortable/filterable table, simulates a real-time price feed via `setInterval` (acting as a WebSocket), and provides a detailed stock view with candlestick, volume, RSI, and MACD charts.

> All data is **simulated/mock** — no external APIs or real market data are used.

---

## 2. Features

### Dashboard
- Header with live/paused feed indicator and toggle
- Sidebar navigation + sector quick-filters
- Market summary cards (advancers/decliners, total market cap, volume, average change)
- Collapsible filter panel

### Stock Screener Table
- **TanStack Table** for column definitions, sorting
- **TanStack Virtual** for virtualized scrolling across 5,000+ rows (only visible rows are rendered)
- Search by symbol or company name
- Sortable columns: Price, Market Cap, Volume, P/E, EPS, RSI, MACD Histogram, SMA, EMA, Bollinger Bands
- Responsive column layout

### Filter System
- Sector multi-select (sidebar)
- Price range
- Market cap range
- Volume range
- P/E ratio range
- RSI range
- Text search
- "Reset all filters" with active filter count badge
- Filtering computed via `useMemo` — sub-200ms for 5,000 rows

### Stock Detail View (Modal)
- **Candlestick chart** (Lightweight Charts) with ~6 months of mock OHLC data
- **Volume chart** (histogram, colored by candle direction)
- Toggleable overlays: **SMA(20)**, **EMA(20)**, **Bollinger Bands**
- **RSI(14)** chart with overbought/oversold reference lines
- **MACD** chart (MACD line, signal line, histogram)
- Charts are **lazy-loaded** via `React.lazy` + `Suspense`

### Real-Time Updates
- Simulated WebSocket using `setInterval` (1s tick)
- Each tick mutates a random ~3–6% subset of stocks (efficient partial updates)
- Green/red flash animation on price change (CSS keyframes)
- Pause/Resume control in the header

### State Management (Zustand)
- `stockStore` — stock universe, real-time tick logic, flash state
- `filterStore` — all filter criteria

### Performance
- `React.memo` on price cells to avoid re-rendering the entire table on each tick
- `useMemo` for filtered data and table columns
- TanStack Virtual row virtualization (renders ~20 rows regardless of dataset size)
- Lazy-loaded chart components
- Deterministic seeded random generator (`mulberry32`) avoids hydration mismatches

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| Table | TanStack Table v8 |
| Virtualization | TanStack Virtual v3 |
| Charts | Lightweight Charts v4 |

---

## 4. Folder Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx           # Entry point -> renders Dashboard
│   └── globals.css        # Tailwind + flash animations
├── components/
│   ├── layout/             # Header, Sidebar, MarketSummary
│   ├── table/              # StockTable, columns, PriceCell
│   ├── filters/             # FilterPanel
│   └── charts/              # Candlestick, Volume, RSI, MACD, DetailPanel
├── features/
│   └── Dashboard.tsx       # Composes the whole screen
├── hooks/
│   ├── useFilteredStocks.ts
│   └── useRealtimeSimulation.ts
├── lib/
│   ├── mockEngine.ts        # Stock + OHLC generators, indicator math
│   └── formatters.ts        # Currency/volume/percent formatters
├── store/
│   ├── stockStore.ts        # Zustand: stock data + realtime ticks
│   └── filterStore.ts       # Zustand: filter state
└── types/
    └── stock.ts             # Shared TypeScript types
```

---

## 5. Setup Instructions

### Prerequisites
- Node.js 18.17+ (recommended: 20.x)
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm run start
```

---

## 6. Architecture Explanation

### Data Generation
`src/lib/mockEngine.ts` contains a **seeded PRNG** (`mulberry32`). All 5,000 stocks are generated deterministically from an index-based seed, so the same data is produced every time — this prevents Next.js hydration mismatches because the data isn't `Math.random()`-derived at module scope. Stocks are generated **once on the client** inside `stockStore.initStocks()`, which is called from a `useEffect` in `useRealtimeSimulation`, ensuring server-rendered HTML contains no random data.

### State Flow
1. `useRealtimeSimulation` (called once in `Dashboard`) initializes the stock universe and starts a 1-second interval.
2. Each tick (`stockStore.applyTick`), a random subset of stocks gets new prices, and a `flashMap` records which stocks just changed (up/down).
3. `useFilteredStocks` subscribes to `stockStore.stocks` and `filterStore` criteria, and recomputes the filtered array via `useMemo` — this is the data passed to the table.
4. `StockTable` uses TanStack Table for sorting/column logic and TanStack Virtual to render only the rows in the viewport (~20 of 5,000).
5. `PriceCell` is wrapped in `React.memo` and subscribes individually to its own `flashMap[stockId]` entry, so a price tick only re-renders the affected cells, not the whole table.

### Charts
Clicking a row opens `StockDetailPanel`, a modal that generates ~180 days of mock OHLC data (seeded by stock symbol) and renders it through `lightweight-charts`. Each chart (`CandlestickChart`, `VolumeChart`, `RSIChart`, `MACDChart`) is a separate client component, lazily imported via `React.lazy`/`Suspense` so chart libraries are only loaded when the modal opens.

### Avoiding Hydration Issues
- No `Math.random()` calls at module load or during SSR render.
- All randomness is seeded (mulberry32) and generated lazily inside client-only effects/stores.
- `"use client"` directives mark all interactive/stateful components.

---

## 7. Deployment (Vercel)

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected).
4. Build command: `next build` (default) — no environment variables required.
5. Deploy.

The project has **zero TypeScript errors** and builds successfully with `npm run build`, making it deploy-ready out of the box.

---

## 8. Notes & Limitations

- All market data (prices, fundamentals, OHLC history, indicators) is **synthetically generated** for demonstration only.
- The "WebSocket" is simulated client-side via `setInterval`; no real socket connection is made.
- Designed for desktop-first usage; sidebar collapses on smaller screens.
