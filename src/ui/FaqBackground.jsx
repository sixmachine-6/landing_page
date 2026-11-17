import { useEffect, useId, useRef } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const W = 1600;
const H = 800;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Smooth curve through points (Catmull-Rom -> cubic bezier)
function smoothPath(pts) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${
      p2[0] - (p3[0] - p1[0]) / 6
    },${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// Price lines run wider than the screen (x from -200 to 1800) so they can drift
const makeLine = ({ base, amp, rise, seed }) => {
  const N = 26;
  return smoothPath(
    Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1);
      const x = -200 + t * 2000;
      const y =
        base -
        rise * t +
        Math.sin(i * 0.8 + seed) * amp +
        Math.sin(i * 2.1 + seed) * (amp / 2);
      return [x, y];
    }),
  );
};

const LINES = [
  {
    d: makeLine({ base: 560, amp: 34, rise: 260, seed: 0 }),
    up: true,
    width: 4,
    opacity: 0.8,
  },
  {
    d: makeLine({ base: 430, amp: 28, rise: -120, seed: 2 }),
    up: false,
    width: 3,
    opacity: 0.6,
  },
  {
    d: makeLine({ base: 690, amp: 22, rise: 150, seed: 4 }),
    up: true,
    width: 3,
    opacity: 0.55,
  },
  {
    d: makeLine({ base: 300, amp: 26, rise: 90, seed: 6 }),
    up: true,
    width: 2,
    opacity: 0.4,
  },
];

const GREEN = "rgb(var(--accent))";
const RED = "rgb(var(--down))";

// Small ticker chips scattered around (hidden on small screens)
const CHIPS = [
  { label: "NIFTY 50", value: "+0.38%", up: true, pos: "left-[3%] top-[6%]" },
  { label: "SENSEX", value: "+0.42%", up: true, pos: "right-[3%] top-[8%]" },
  {
    label: "BANK NIFTY",
    value: "-0.27%",
    up: false,
    pos: "left-[5%] bottom-[7%]",
  },
  { label: "GOLD", value: "+0.34%", up: true, pos: "right-[5%] bottom-[6%]" },
];

export default function FaqBackground({ className = "" }) {
  const id = useId().replace(/:/g, "");
  const driftRef = useRef(null);
  const reduced = prefersReduced();

  // Slow sideways drift of the price lines
  useEffect(() => {
    const el = driftRef.current;
    if (!el || !el.animate || reduced) return;

    const anim = el.animate(
      [{ transform: "translateX(-80px)" }, { transform: "translateX(80px)" }],
      {
        duration: 22000,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    );
    return () => anim.cancel();
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      {/* soft green + red glows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 12% 18%, rgb(var(--accent) / 0.2), transparent 55%), radial-gradient(ellipse at 92% 92%, rgb(var(--down) / 0.14), transparent 45%)",
        }}
      />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: GREEN, stopOpacity: 0.24 }} />
            <stop offset="1" style={{ stopColor: GREEN, stopOpacity: 0 }} />
          </linearGradient>
          <pattern
            id={`${id}-dots`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1.5"
              style={{ fill: "rgb(var(--ink) / 0.2)" }}
            />
          </pattern>
        </defs>

        {/* dotted grid */}
        <rect width={W} height={H} fill={`url(#${id}-dots)`} />

        {/* drifting price lines */}
        <g ref={driftRef}>
          <path
            d={`${LINES[0].d} L1800,${H} L-200,${H} Z`}
            fill={`url(#${id}-area)`}
          />

          {/* soft glow under the main line */}
          <path
            d={LINES[0].d}
            fill="none"
            strokeLinecap="round"
            strokeWidth="14"
            style={{ stroke: GREEN, opacity: 0.25, filter: "blur(10px)" }}
          />

          {LINES.map((l, i) => (
            <path
              key={i}
              d={l.d}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={l.width}
              style={{ stroke: l.up ? GREEN : RED, opacity: l.opacity }}
            />
          ))}

          {/* glowing dot that keeps travelling along the main line */}
          {!reduced && (
            <g>
              <circle r="18" style={{ fill: GREEN, opacity: 0.25 }}>
                <animateMotion
                  dur="16s"
                  repeatCount="indefinite"
                  path={LINES[0].d}
                />
              </circle>
              <circle r="7" style={{ fill: GREEN }}>
                <animateMotion
                  dur="16s"
                  repeatCount="indefinite"
                  path={LINES[0].d}
                />
              </circle>
            </g>
          )}
        </g>
      </svg>

      {/* ticker chips */}
      {CHIPS.map(({ label, value, up, pos }) => (
        <div
          key={label}
          className={`absolute hidden items-center gap-2 rounded-full border border-[rgb(var(--ink)/0.12)] bg-[rgb(var(--card)/0.6)] px-3 py-1.5 text-xs font-semibold tabular-nums backdrop-blur-sm lg:flex ${pos}`}
        >
          <span className="text-[rgb(var(--ink)/0.75)]">{label}</span>
          <span
            className={`inline-flex items-center gap-1 ${
              up ? "text-accent" : "text-down"
            }`}
          >
            {up ? <FaCaretUp size={12} /> : <FaCaretDown size={12} />}
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}
