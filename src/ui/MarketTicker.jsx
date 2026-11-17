import { useEffect, useRef } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import useMarketData from "../hooks/useMarketData";

const fmt = (n) =>
  n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Item({ market }) {
  const up = market.change >= 0;
  const prev = market.value - market.change;
  const pct = prev ? (market.change / prev) * 100 : 0;
  const color = up ? "text-[rgb(var(--accent))]" : "text-[rgb(var(--down))]";
  const sign = up ? "+" : "-";

  return (
    <div className="flex shrink-0 items-center gap-3 border-r border-[rgb(var(--ink)/0.12)] px-6 text-sm tabular-nums sm:text-[15px]">
      <span className="font-semibold tracking-wide text-[rgb(var(--ink))]">
        {market.name}
      </span>
      <span className="font-medium text-[rgb(var(--ink))]">
        {fmt(market.value)}
      </span>
      <span className={`inline-flex items-center gap-1 font-semibold ${color}`}>
        {up ? <FaCaretUp size={16} /> : <FaCaretDown size={16} />}
        {sign}
        {fmt(Math.abs(market.change))} ({sign}
        {Math.abs(pct).toFixed(2)}%)
      </span>
    </div>
  );
}

export default function MarketTicker() {
  const { markets, isLive, updatedAt } = useMarketData();
  const trackRef = useRef(null);
  const animRef = useRef(null);

  // Each half holds the list twice, so it is always wider than the screen.
  const half = [...markets, ...markets];

  // Endless right-to-left loop. It runs once and is not restarted when prices refresh.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !el.animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anim = el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: 90000, iterations: Infinity, easing: "linear" },
    );
    animRef.current = anim;

    return () => anim.cancel();
  }, []);

  const updatedLabel = updatedAt
    ? `Updated ${new Date(updatedAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Sample data";

  return (
    <div
      role="region"
      aria-label="Market indices"
      className="flex items-center border-y border-[rgb(var(--ink)/0.1)] bg-[rgb(var(--card))]"
    >
      {/* LIVE / SAMPLE badge */}
      <div
        title={updatedLabel}
        className="hidden shrink-0 items-center gap-2 border-r border-[rgb(var(--ink)/0.12)] px-4 py-3 text-xs font-bold tracking-wider text-[rgb(var(--ink))] sm:flex"
      >
        <span className="relative flex h-2.5 w-2.5">
          {isLive && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[rgb(var(--accent))] opacity-70" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
              isLive ? "bg-[rgb(var(--accent))]" : "bg-[rgb(var(--muted))]"
            }`}
          />
        </span>
        {isLive ? "LIVE" : "SAMPLE"}
      </div>

      {/* scrolling prices */}
      <div
        onMouseEnter={() => animRef.current?.pause()}
        onMouseLeave={() => animRef.current?.play()}
        className="min-w-0 flex-1 overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0"
              aria-hidden={copy === 1 ? "true" : undefined}
            >
              {half.map((m, i) => (
                <Item key={`${copy}-${i}`} market={m} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
