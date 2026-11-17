import { useEffect, useRef } from "react";

const W = 1200;
const H = 700;
const N = 30; // number of candles
const X0 = 20;
const DOT_X = W - 50; // where the last candle and the glowing dot sit
const STEP = (DOT_X - X0) / (N - 1);

const GREEN = "rgb(var(--accent))";
const RED = "rgb(var(--down))";

// Smooth upward trend, plus some wobble for the candles
const trendY = (i) => 600 - Math.pow(i / (N - 1), 1.15) * 440;
const lineY = (i) => trendY(i) + Math.sin(i * 0.9) * 10;
const candleY = (i) =>
  trendY(i) + Math.sin(i * 0.9) * 24 + Math.sin(i * 2.1) * 12;

const CANDLES = Array.from({ length: N }, (_, i) => {
  const open = i === 0 ? candleY(0) + 14 : candleY(i - 1);
  const close = candleY(i);
  const top = Math.min(open, close);
  const bottom = Math.max(open, close);
  const wickUp = 8 + Math.abs(Math.sin(i * 3.1)) * 16;
  const wickDown = 8 + Math.abs(Math.cos(i * 2.3)) * 16;

  return {
    x: X0 + i * STEP,
    top,
    height: Math.max(bottom - top, 5),
    high: top - wickUp,
    low: bottom + wickDown,
    up: close < open, // smaller y = higher price
  };
});

// Smooth curve through the points (Catmull-Rom -> cubic bezier)
function smoothPath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// The line runs 2 extra points past the last candle so it bleeds off the
// right edge and the green area fills all the way to the end of the screen.
const POINTS = Array.from({ length: N + 2 }, (_, i) => [
  X0 + i * STEP,
  lineY(i),
]);
const LINE = smoothPath(POINTS);
const LAST = POINTS[N - 1]; // the dot stays on the last candle
const END = POINTS[POINTS.length - 1]; // off-screen end of the line
const AREA = `${LINE} L${END[0]},${H} L${X0},${H} Z`;

export default function MarketChart() {
  const candlesRef = useRef(null);
  const areaRef = useRef(null);
  const glowRef = useRef(null);
  const lineRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anims = [];
    const run = (el, frames, options) => {
      if (el && el.animate)
        anims.push(el.animate(frames, { fill: "both", ...options }));
    };

    // candles fade in
    run(candlesRef.current, [{ opacity: 0 }, { opacity: 0.4 }], {
      duration: 1400,
      delay: 400,
    });

    // trend line draws itself
    [lineRef.current, glowRef.current].forEach((path) => {
      if (!path) return;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      run(path, [{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
        duration: 2800,
        delay: 600,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      });
    });

    // area under the line, then the end dot
    run(areaRef.current, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 1000,
      delay: 2400,
    });
    run(dotRef.current, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 600,
      delay: 3200,
    });

    return () => anims.forEach((a) => a.cancel());
  }, []);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMaxYMax slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="market-chart-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: GREEN, stopOpacity: 0.28 }} />
          <stop offset="1" style={{ stopColor: GREEN, stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* grid */}
      <g
        style={{ stroke: "rgb(var(--ink) / 0.08)" }}
        strokeWidth="1"
        strokeDasharray="4 8"
      >
        {[100, 200, 300, 400, 500, 600].map((y) => (
          <line key={`h${y}`} x1="0" x2={W} y1={y} y2={y} />
        ))}
        {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map(
          (x) => (
            <line key={`v${x}`} x1={x} x2={x} y1="0" y2={H} />
          ),
        )}
      </g>

      {/* candlesticks */}
      <g ref={candlesRef} style={{ opacity: 0.4 }}>
        {CANDLES.map((c) => {
          const color = c.up ? GREEN : RED;
          return (
            <g key={c.x} style={{ stroke: color, fill: color }}>
              <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} strokeWidth="2" />
              <rect x={c.x - 8} y={c.top} width="16" height={c.height} rx="2" />
            </g>
          );
        })}
      </g>

      {/* area under the trend line */}
      <path ref={areaRef} d={AREA} fill="url(#market-chart-area)" />

      {/* upward trend line (with a soft glow underneath) */}
      <path
        ref={glowRef}
        d={LINE}
        fill="none"
        strokeLinecap="round"
        strokeWidth="14"
        style={{ stroke: GREEN, opacity: 0.25, filter: "blur(10px)" }}
      />
      <path
        ref={lineRef}
        d={LINE}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        style={{ stroke: GREEN }}
      />

      {/* glowing dot at the peak */}
      <g ref={dotRef}>
        <circle
          cx={LAST[0]}
          cy={LAST[1]}
          r="18"
          style={{ fill: GREEN, opacity: 0.25 }}
        />
        <circle cx={LAST[0]} cy={LAST[1]} r="7" style={{ fill: GREEN }} />
      </g>
    </svg>
  );
}
