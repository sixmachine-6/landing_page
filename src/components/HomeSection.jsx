import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Button from "../ui/Button";
import MarketTicker from "../ui/MarketTicker";
import MarketChart from "../ui/MarketChart";

const PHRASES = ["Financial Future", "Investment Goals", "Wealth Growth"];
const LONGEST = PHRASES.reduce((a, b) => (b.length > a.length ? b : a));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- entrance animations (run once, when the page loads) ---------- */
const KINDS = {
  pop: {
    frames: [
      { opacity: 0, transform: "scale(0.3)" },
      { opacity: 1, transform: "scale(1)" },
    ],
    duration: 800,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  rise: {
    frames: [
      { opacity: 0, transform: "translateY(40px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    duration: 800,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  fade: {
    frames: [{ opacity: 0 }, { opacity: 1 }],
    duration: 400,
    easing: "ease-out",
  },
};

function Anim({
  as: Tag = "span",
  kind = "pop",
  delay = 0,
  className = "",
  children,
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !el.animate || prefersReducedMotion()) return;

    const { frames, duration, easing } = KINDS[kind];
    const anim = el.animate(frames, {
      duration,
      delay,
      easing,
      fill: "backwards",
    });
    return () => anim.cancel();
  }, [kind, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* ---------- blinking cursor ---------- */
function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.animate || prefersReducedMotion()) return;

    const anim = el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 530,
      iterations: Infinity,
      direction: "alternate",
      easing: "steps(1, end)",
    });
    return () => anim.cancel();
  }, []);

  return (
    <span
      ref={ref}
      className="ml-1 inline-block h-[0.85em] w-[0.07em] translate-y-[0.08em] bg-accent"
    />
  );
}

/* ---------- typing effect ---------- */
function useTypewriter(phrases, { startDelay, typeSpeed, deleteSpeed, pause }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (prefersReducedMotion()) {
      setText(phrases[0]);
      return;
    }

    let word = 0;
    let chars = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const current = phrases[word];

      if (!deleting) {
        chars += 1;
        setText(current.slice(0, chars));

        if (chars === current.length) {
          deleting = true;
          timer = setTimeout(tick, pause);
        } else {
          timer = setTimeout(tick, typeSpeed);
        }
      } else {
        chars -= 1;
        setText(current.slice(0, chars));

        if (chars === 0) {
          deleting = false;
          word = (word + 1) % phrases.length;
          timer = setTimeout(tick, 350);
        } else {
          timer = setTimeout(tick, deleteSpeed);
        }
      }
    };

    timer = setTimeout(tick, startDelay);
    return () => clearTimeout(timer);
    // phrases and the timing numbers never change, so this runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return text;
}

/* ====================================================================== */
export default function HomeSection() {
  const typed = useTypewriter(PHRASES, {
    startDelay: 1100,
    typeSpeed: 90,
    deleteSpeed: 45,
    pause: 1800,
  });

  return (
    <section
      id="home"
      className="w-full bg-page text-ink"
    >
      {/* ================= MARKET TICKER (right below the navbar) ================= */}
      <MarketTicker />

      {/* ================= HERO =================
          FIX: min-height only from `sm` upwards, so mobile ends right
          below the button instead of leaving a huge empty gap. */}
      <div className="relative isolate flex min-h-0 w-full flex-col items-center overflow-hidden sm:min-h-190">
        {/* soft green + red glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 80%, rgb(var(--accent) / 0.16), transparent 60%), radial-gradient(ellipse at 100% 100%, rgb(var(--down) / 0.1), transparent 45%)",
          }}
        />

        {/* STOCK CHART: FULL BACKGROUND */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 sm:opacity-100"
        >
          <MarketChart />
        </div>

        {/* THE MAN: CENTRE */}
        <Anim
          as="div"
          kind="rise"
          delay={300}
          className="relative z-10 mt-3 flex w-full justify-center"
        >
          <img
            src="/images/hero_man.png"
            alt="Finvoro financial advisor"
            className="h-110 w-auto max-w-full object-contain object-top sm:h-135 lg:h-160"
          />
        </Anim>

        {/* FADE: lets the lower part of the shirt dissolve so the text is readable.
            Shorter on mobile so there isn't a big empty fade under the button. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[40%] sm:h-[55%]"
          style={{
            background:
              "linear-gradient(to top, rgb(var(--page)) 0%, rgb(var(--page) / 0.88) 35%, rgb(var(--page) / 0) 100%)",
          }}
        />

        {/* BRAND TITLE, bottom right (very faint) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-1 right-4 z-20 select-none whitespace-nowrap text-[clamp(72px,10vw,220px)] font-bold leading-[0.8] tracking-[-0.06em] text-[rgb(var(--ink)/0.07)] sm:right-8 xl:right-12"
        >
          Finvoro
        </div>

        {/* TEXT: CENTRED, OVER THE SHIRT.
            The negative margin sets how far the text overlaps the man.
            Pull it up (-mt-[240px]) to move the text higher, push it down
            (-mt-[190px]) to keep it further from his face.
            Mobile now has extra bottom padding (pb-20) so the faint
            "Finvoro" watermark doesn't touch the button. */}
        <div className="relative z-10 -mt-60 w-full px-4 pb-20 text-center sm:-mt-77.5 sm:px-8 sm:pb-14 lg:-mt-95">
          {/* HEADING: wraps onto two larger lines on mobile,
              single line (scaled with screen width) from `sm` upwards */}
          <h1 className="whitespace-normal text-[clamp(28px,8vw,44px)] font-semibold leading-[1.15] tracking-[-0.04em] sm:whitespace-nowrap sm:text-[clamp(18px,4.8vw,76px)]">
            <span className="sr-only">Empowering Your Financial Future</span>

            <span aria-hidden="true">
              {/* 1) words pop in */}
              <Anim kind="pop" delay={0} className="inline-block">
                Empowering
              </Anim>{" "}
              <Anim kind="pop" delay={160} className="inline-block">
                Your
              </Anim>{" "}
              {/* 2) then this part is typed, on the same line */}
              <Anim
                kind="fade"
                delay={700}
                className="relative inline-block text-left align-baseline text-accent"
              >
                <span className="invisible block">{LONGEST}</span>
                <span className="absolute inset-0 block">
                  {typed}
                  <Cursor />
                </span>
              </Anim>
            </span>
          </h1>

          <Anim
            as="p"
            kind="rise"
            delay={1300}
            className="mx-auto mt-3 block max-w-140 text-base leading-8 text-muted sm:text-lg md:mt-6"
          >
            Track the markets, plan with confidence and grow your wealth with
            research-driven investment guidance.
          </Anim>

          <Anim as="div" kind="rise" delay={1500}>
            <Button text="Get Started" />
          </Anim>
        </div>

        {/* TRUST INDICATOR: bottom left, green (up) + red (down) bar */}
        <Anim
          as="div"
          kind="rise"
          delay={1700}
          className="absolute bottom-8 left-8 z-30 hidden xl:left-12 xl:block"
        >
          <p className="mb-3 text-lg font-semibold">
            Trusted Financial Guidance
          </p>
          <div className="flex h-0.75 w-16 overflow-hidden rounded-full">
            <span className="w-2/3 bg-accent" />
            <span className="w-1/3 bg-down" />
          </div>
        </Anim>
      </div>
    </section>
  );
}
