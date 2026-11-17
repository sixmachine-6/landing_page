import { useEffect, useRef, useState } from "react";

import SectionLabel from "./SectionLabel";
import Button from "../ui/Button";
import FaqItem from "../ui/FaqItem";
import FaqBackground from "../ui/FaqBackground";
import InView from "../ui/InView";
import ShimmerText from "../ui/ShimmerText";

const FAQS = [
  {
    question: "What financial services do you offer?",
    answer:
      "We provide a wide range of services including financial planning, investment consulting, wealth management, retirement planning, and risk management.",
  },
  {
    question: "How do you determine the right financial strategy?",
    answer:
      "We start by understanding your goals, income, risk appetite and timeline. Our advisors then back every recommendation with market research and review the plan with you regularly.",
  },
  {
    question: "Can you work with my existing investments?",
    answer:
      "Yes. We review your current portfolio, keep what is working, and suggest changes only where they move you closer to your goals.",
  },
  {
    question: "How much do your financial services cost?",
    answer:
      "Our fees depend on the service and the size of the portfolio. We explain every charge up front, with no hidden costs, before you commit to anything.",
  },
  {
    question: "Do you work with remote or international clients?",
    answer:
      "Absolutely. We meet clients by video call and manage portfolios across borders, so you get the same guidance wherever you are.",
  },
];

/* small glass "?" bubble that floats up and down forever */
function FloatingMark({
  className = "",
  size = 56,
  delay = 0,
  duration = 4200,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anim = el.animate(
      [
        { transform: "translateY(0) rotate(-6deg)" },
        { transform: "translateY(-18px) rotate(6deg)" },
      ],
      {
        duration,
        delay,
        iterations: Infinity,
        direction: "alternate",
        easing: "ease-in-out",
      },
    );

    return () => anim.cancel();
  }, [delay, duration]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      className={`absolute hidden place-items-center rounded-full border border-[rgb(var(--accent)/0.35)] bg-[rgb(var(--accent)/0.12)] font-semibold text-[rgb(var(--accent))] shadow-lg backdrop-blur-sm lg:grid ${className}`}
    >
      ?
    </span>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0); // first question open by default

  const toggle = (i) => setOpenIndex((current) => (current === i ? -1 : i));

  return (
    <section className="relative isolate w-full overflow-hidden bg-page py-20 text-ink transition-colors duration-300 sm:py-24 lg:py-32">
      <FaqBackground />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:px-12">
        {/* ================= LEFT: TITLE + BUTTON ================= */}
        <div className="relative py-6 lg:py-16">
          <FloatingMark className="-top-2 right-4" size={60} delay={0} />
          <FloatingMark
            className="bottom-0 left-2"
            size={44}
            delay={900}
            duration={5000}
          />
          <FloatingMark
            className="right-0 top-1/2"
            size={36}
            delay={1600}
            duration={3800}
          />

          <InView from="top">
            <SectionLabel>Financial Insights &amp; Answers</SectionLabel>
          </InView>

          <InView from="left" delay={150} duration={1100}>
            <h2 className="text-4xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl">
              <ShimmerText>Frequently Asked Questions</ShimmerText>
            </h2>
          </InView>

          <InView from="bottom" delay={350}>
            <p className="mt-6 max-w-[440px] text-base leading-8 text-muted sm:text-lg">
              Quick answers to what investors ask us most. Can't find yours? Our
              advisors are one conversation away.
            </p>
          </InView>

          <InView from="bottom" delay={500}>
            <Button text="Get Consultation" className="!mt-8" />
          </InView>
        </div>

        {/* ================= RIGHT: GLASS FAQ CARD ================= */}
        <InView from="right" duration={1100} delay={150}>
          <div className="relative overflow-hidden rounded-3xl border border-[rgb(var(--ink)/0.18)] bg-[rgb(var(--card)/0.28)] p-6 shadow-2xl backdrop-blur-[6px] sm:p-10">
            {/* faint light edge along the top, like glass catching light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
            />

            {FAQS.map((item, i) => (
              <InView key={item.question} from="bottom" delay={400 + i * 110}>
                <FaqItem
                  index={i}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                />
              </InView>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}
