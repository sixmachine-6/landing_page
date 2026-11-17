import { FiCheck, FiCircle, FiPhoneCall } from "react-icons/fi";

import Button from "../ui/Button";
import InView from "../ui/InView";
import {
  FEATURES,
  EXPERIENCE_YEARS,
  PHONE_DISPLAY,
  PHONE_LINK,
} from "../constants/layout";
import { useCountOnView } from "../utils/helpers";

/* ====================================================================== */

const AboutSection = () => {
  const [badgeRef, years] = useCountOnView(EXPERIENCE_YEARS);

  return (
    <section className="w-full overflow-hidden bg-page py-20 text-ink transition-colors duration-300 sm:py-24 lg:py-32 lg:px-10">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 xl:px-12">
        {/* ================= LEFT IMAGE ================= */}
        <InView
          from="left"
          duration={1100}
          className="relative mx-auto w-full max-w-175"
        >
          <div className="relative h-100 overflow-hidden rounded-xl bg-card sm:h-125 lg:h-145">
            <img
              src="/images/about_small.jpg"
              alt="Financial professionals discussing investment opportunities"
              className="h-full w-full object-cover"
            />

            {/* soft dark fade so the white text stays readable */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/45 to-transparent"
            />

            {/* EXPERIENCE CARD + CONTACT PILL */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
              <InView from="zoom" delay={500} duration={800}>
                <div
                  ref={badgeRef}
                  className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-5 py-4 text-white shadow-lg backdrop-blur-md sm:gap-4 sm:px-7 sm:py-5"
                >
                  <span className="sr-only">
                    {EXPERIENCE_YEARS}+ years of experience
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-5xl font-light leading-none tracking-tight tabular-nums sm:text-6xl"
                  >
                    <span className="inline-block min-w-[2ch] text-right">
                      {years}
                    </span>
                    +
                  </span>

                  <span
                    aria-hidden="true"
                    className="text-base font-medium leading-snug sm:text-lg"
                  >
                    Years
                    <br />
                    Experience
                  </span>
                </div>
              </InView>

              <InView from="bottom" delay={750} duration={800}>
                <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/15 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-md sm:text-base">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <FiPhoneCall size={16} />
                  </span>
                  <span>
                    Contact Us:{" "}
                    <a
                      href={PHONE_LINK}
                      className="underline underline-offset-2 transition-colors hover:text-accent"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </span>
                </div>
              </InView>
            </div>
          </div>
        </InView>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="relative mt-2 lg:mt-0">
          {/* SECTION LABEL */}
          <InView from="top" className="mb-6 flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
              <FiCircle size={15} className="fill-accent text-accent" />
            </div>
            <span className="text-base font-semibold tracking-wide text-accent">
              About Us
            </span>
          </InView>

          {/* MAIN HEADING */}
          <InView as="div" from="top" delay={150}>
            <h2 className="mb-7 text-3xl font-semibold leading-[1.2] tracking-[-0.035em] text-ink sm:text-4xl lg:text-[48px] xl:text-[54px]">
              Empowering Smarter Financial Decisions For A Brighter Future
            </h2>
          </InView>

          {/* DESCRIPTION */}
          <InView from="bottom" delay={300}>
            <p className="text-base leading-8 text-muted sm:text-lg">
              At Finvoro, we believe that thoughtful investment decisions create
              opportunities for a stronger financial future. We focus on
              understanding our clients, identifying opportunities and building
              investment strategies aligned with their financial objectives.
            </p>
          </InView>

          {/* DIVIDER: line grows, then the dot pops in */}
          <div className="relative my-10 flex items-center">
            <InView
              from="grow"
              delay={300}
              duration={1200}
              className="h-px w-full bg-ink/15"
            />

            <div className="absolute left-1/2 -translate-x-1/2">
              <InView from="zoom" delay={900} duration={700}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <div className="h-3 w-3 rounded-full bg-accent" />
                </div>
              </InView>
            </div>
          </div>

          {/* FEATURES AND SECONDARY IMAGE */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_190px] sm:items-center">
            <div className="space-y-5">
              {FEATURES.map((item, i) => (
                <InView
                  key={item}
                  from="left"
                  delay={i * 150}
                  className="flex items-start gap-3"
                >
                  <FiCheck size={21} className="mt-1 shrink-0 text-accent" />
                  <p className="text-base font-medium leading-7 text-ink sm:text-lg">
                    {item}
                  </p>
                </InView>
              ))}

              <InView from="bottom" delay={500}>
                <Button text="More About Us" className="!mt-8" />
              </InView>
            </div>

            <InView
              from="zoom"
              delay={300}
              duration={1000}
              className="hidden h-47.5 overflow-hidden rounded-2xl bg-card sm:block"
            >
              <img
                src="/images/about_small.jpg"
                alt="Financial planning and advisory"
                className="h-full w-full object-cover"
              />
            </InView>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
