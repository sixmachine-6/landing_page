import { useEffect, useRef, useState } from "react";

const REFRESH_MS = 120_000; // every 2 minutes (each refresh makes one request per symbol)
const CACHE_KEY = "finvoro-market-v1";
const MAX_AGE_MS = 30 * 60_000; // cached prices older than this are ignored

// `name` is what the ticker shows, `symbol` is the Yahoo Finance code.
// Fewer symbols = fewer requests. Edit this list to change the ticker.
const SYMBOLS = [
  { name: "BSE SENSEX", symbol: "^BSESN" },
  { name: "NIFTY 50", symbol: "^NSEI" },
  { name: "BANK NIFTY", symbol: "^NSEBANK" },
  { name: "NIFTY IT", symbol: "^CNXIT" },
  { name: "NIFTY MIDCAP 100", symbol: "NIFTY_MIDCAP_100.NS" },
  { name: "RELIANCE", symbol: "RELIANCE.NS" },
  { name: "TCS", symbol: "TCS.NS" },
  { name: "HDFC BANK", symbol: "HDFCBANK.NS" },
  { name: "INFOSYS", symbol: "INFY.NS" },
  { name: "ICICI BANK", symbol: "ICICIBANK.NS" },
  { name: "GOLD (USD/oz)", symbol: "GC=F" },
  { name: "USD/INR", symbol: "INR=X" },
];

// Shown only until real prices arrive (or if every request fails).
const FALLBACK = [
  { name: "BSE SENSEX", value: 82450.15, change: 312.4 },
  { name: "NIFTY 50", value: 25180.6, change: 96.25 },
  { name: "BANK NIFTY", value: 54320.8, change: -145.3 },
  { name: "NIFTY IT", value: 38905.1, change: 210.75 },
  { name: "NIFTY MIDCAP 100", value: 58640.25, change: -88.6 },
  { name: "RELIANCE", value: 1482.3, change: 12.45 },
  { name: "TCS", value: 3215.75, change: -28.1 },
  { name: "HDFC BANK", value: 1018.4, change: 6.2 },
  { name: "INFOSYS", value: 1612.9, change: -9.85 },
  { name: "ICICI BANK", value: 1365.55, change: 14.3 },
];

/* ---------- data source ---------- */

const yahooUrl = (symbol) =>
  `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    symbol,
  )}?range=1d&interval=1d`;

// Tried in order: 1) straight from the browser, 2) through a free CORS proxy.
const ROUTES = [
  (url) => url,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

let routeStart = 0; // remembers which route worked last, so we don't retry a blocked one first

const round = (n) => Math.round(n * 100) / 100;

async function fetchQuote({ name, symbol }, signal) {
  const target = yahooUrl(symbol);
  let lastError;

  for (let i = 0; i < ROUTES.length; i++) {
    const idx = (routeStart + i) % ROUTES.length;

    try {
      const res = await fetch(ROUTES[idx](target), { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice;
      const prev = meta?.chartPreviousClose ?? meta?.previousClose;

      if (typeof price !== "number" || typeof prev !== "number") {
        throw new Error("no price in response");
      }

      routeStart = idx;
      return { name, symbol, value: round(price), change: round(price - prev) };
    } catch (err) {
      if (err.name === "AbortError") throw err;
      lastError = err;
    }
  }

  throw lastError;
}

/* ---------- tiny cache, so reloads and quick visits don't refetch ---------- */

function readCache() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (!raw || !Array.isArray(raw.markets) || !raw.markets.length) return null;
    if (Date.now() - raw.time > MAX_AGE_MS) return null;
    return raw;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable, ignore */
  }
}

/* ---------- the hook ---------- */

export default function useMarketData() {
  const [state, setState] = useState(() => {
    const cached = readCache();
    return cached
      ? {
          markets: cached.markets,
          isLive: true,
          updatedAt: new Date(cached.time).toISOString(),
        }
      : { markets: FALLBACK, isLive: false, updatedAt: null };
  });

  // lets the loader read the latest prices without being re-created
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let stopped = false;
    let timer;
    let controller;

    const load = async () => {
      controller?.abort();
      controller = new AbortController();

      const results = await Promise.allSettled(
        SYMBOLS.map((s) => fetchQuote(s, controller.signal)),
      );
      if (stopped) return;

      // keep the previous price for any symbol that failed this time
      const prev = stateRef.current;
      const byName = new Map(
        prev.isLive ? prev.markets.map((m) => [m.name, m]) : [],
      );
      let received = 0;

      results.forEach((r, i) => {
        if (r.status === "fulfilled") {
          byName.set(SYMBOLS[i].name, r.value);
          received += 1;
        }
      });

      if (!received) {
        setState({ ...prev, isLive: false }); // everything failed: show the last values, marked not live
        return;
      }

      const time = Date.now();
      const markets = SYMBOLS.map((s) => byName.get(s.name)).filter(Boolean);

      writeCache({ time, markets });
      setState({
        markets,
        isLive: true,
        updatedAt: new Date(time).toISOString(),
      });
    };

    const schedule = (delay) => {
      timer = setTimeout(async () => {
        if (!document.hidden) await load(); // no requests while the tab is in the background
        if (!stopped) schedule(REFRESH_MS);
      }, delay);
    };

    // If the cache is still fresh, wait out the rest of its time before asking again.
    const cached = readCache();
    const age = cached ? Date.now() - cached.time : Infinity;
    schedule(age >= REFRESH_MS ? 0 : REFRESH_MS - age);

    // Coming back to the tab after a long time: refresh straight away
    const onVisible = () => {
      if (document.hidden) return;
      const c = readCache();
      if (!c || Date.now() - c.time >= REFRESH_MS) {
        clearTimeout(timer);
        schedule(0);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      clearTimeout(timer);
      controller?.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return state;
}
