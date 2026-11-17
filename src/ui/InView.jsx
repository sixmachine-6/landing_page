import { useLayoutEffect, useRef } from "react";

const FROM = {
  left: "translateX(-70px)",
  right: "translateX(70px)",
  top: "translateY(-50px)",
  bottom: "translateY(50px)",
  zoom: "scale(0.8)",
  grow: "scaleX(0)",
};

export default function InView({
  as: Tag = "div",
  from = "bottom",
  delay = 0,
  duration = 900,
  className = "",
  style,
  children,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !el.animate || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Hidden until it scrolls into view
    el.style.opacity = "0";
    let anim;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // plays only once

        anim = el.animate(
          [
            { opacity: 0, transform: FROM[from] },
            { opacity: 1, transform: "none" },
          ],
          {
            duration,
            delay,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          },
        );

        anim.onfinish = () => {
          el.style.opacity = "";
          anim.cancel();
        };
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      anim?.cancel();
      el.style.opacity = "";
    };
  }, [from, delay, duration]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={
        from === "grow" ? { transformOrigin: "left center", ...style } : style
      }
    >
      {children}
    </Tag>
  );
}
