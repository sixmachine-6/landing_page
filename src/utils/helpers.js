import { useEffect, useRef, useState } from "react";

/* ---------- jumbling count-up, starts when the card is on screen ---------- */
function buildSequence(target) {
  const seq = [];
  let v = 0;
  while (v < target) {
    v = Math.min(target, v + 1 + Math.floor(Math.random() * 4));
    seq.push(v);
  }
  return seq;
}

export function useCountOnView(target) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setValue(target);
      return;
    }

    let timer;

    const run = () => {
      const seq = buildSequence(target);
      let i = 0;

      const step = () => {
        setValue(seq[i]);
        i += 1;
        if (i < seq.length) {
          const t = i / (seq.length - 1 || 1);
          timer = setTimeout(step, 90 + 260 * t * t);
        }
      };

      step();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // small wait so the card has finished popping in
        timer = setTimeout(run, 500);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [target]);

  return [ref, value];
}
