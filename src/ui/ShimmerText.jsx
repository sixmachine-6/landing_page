import { useEffect, useRef } from "react";

export default function ShimmerText({
  children,
  className = "",
  duration = 5000,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The light sweeps left to right, then rests for a moment, then repeats
    const anim = el.animate(
      [
        { backgroundPosition: "100% 0" },
        { backgroundPosition: "0% 0", offset: 0.7 },
        { backgroundPosition: "0% 0" },
      ],
      { duration, iterations: Infinity, easing: "ease-in-out" },
    );

    return () => anim.cancel();
  }, [duration]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        backgroundImage:
          "linear-gradient(100deg, rgb(var(--ink)) 0%, rgb(var(--ink)) 38%, rgb(var(--accent)) 50%, rgb(var(--ink)) 62%, rgb(var(--ink)) 100%)",
        backgroundSize: "250% 100%",
        backgroundPosition: "100% 0",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
    >
      {children}
    </span>
  );
}
