import { useEffect, useRef } from "react";

import SectionLabel from "./SectionLabel";
import Testimonial from "./../ui/Testimonial";
import InView from "../ui/InView";

const TESTIMONIALS = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    headline: "“Seamless, professional.”",
    quote:
      "“The team helped us migrate to the cloud without any disruptions. Their support and expertise have been outstanding from day one.”",
    name: "Lisa Mandela",
    role: "Operations Manager at FinTech Corp",
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    headline: "“They delivered exactly what we needed.”",
    quote:
      "“From custom software development to post-launch support, their attention to detail and clear communication made all the difference.”",
    name: "David Ronald",
    role: "CEO at HealthBridge Solutions",
  },
  {
    id: 3,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    headline: "“A true technology partner.”",
    quote:
      "“We now have total peace of mind knowing our data and systems are protected 24/7.”",
    name: "Tom Surgeon",
    role: "Founder at GreenEdge Logistics",
  },
];

const HALF = [...TESTIMONIALS, ...TESTIMONIALS];

export default function ClientTestimonialSection() {
  const trackRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || !el.animate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anim = el.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: 60000, iterations: Infinity, easing: "linear" },
    );
    animRef.current = anim;

    return () => anim.cancel();
  }, []);

  const pause = () => animRef.current?.pause();
  const play = () => animRef.current?.play();

  return (
    <section className="w-full overflow-hidden bg-page py-20 text-ink transition-colors duration-300 sm:py-24 lg:py-32">
      <div className="mx-auto mb-14 max-w-[1600px] px-5 sm:px-8 lg:mb-20 xl:px-12">
        <InView from="top">
          <SectionLabel>Client Testimonials</SectionLabel>
        </InView>

        <InView from="top" delay={150}>
          <h2 className="max-w-[760px] text-3xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-4xl lg:text-[48px] xl:text-[54px]">
            What Our Clients Say About Working With Us
          </h2>
        </InView>
      </div>

      {/* The marquee slides up into view; the hover pause stays on the inner div */}
      <InView from="bottom" delay={300} duration={1100}>
        <div
          onMouseEnter={pause}
          onMouseLeave={play}
          className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div ref={trackRef} className="flex w-max will-change-transform">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0"
                aria-hidden={copy === 1 ? "true" : undefined}
              >
                {HALF.map((t, i) => (
                  <div
                    key={`${copy}-${t.id}-${i}`}
                    className="w-[88vw] max-w-[600px] shrink-0 pr-10 sm:pr-16 lg:pr-24"
                  >
                    <Testimonial testimonial={t} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </InView>
    </section>
  );
}
