import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FiArrowUpRight } from "react-icons/fi";

import SectionLabel from "./SectionLabel";
import Member from "./../ui/Member";
import InView from "../ui/InView";
import { NAVBAR_HEIGHT } from "../constants/layout";

const INITIAL_COUNT = 4; // how many members show before "All Members" is clicked
const ENTER_OFFSET = 0.45; // cards start this far (fraction of screen width) off the right edge

const MEMBERS = [
  {
    id: 1,
    name: "Ronald Richards",
    role: "Manager",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
  {
    id: 2,
    name: "Daniel Brooks",
    role: "Chief Executive Officer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
  {
    id: 3,
    name: "Lucas Meyer",
    role: "Product Director",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
  {
    id: 4,
    name: "Adrian Cole",
    role: "Chief Technology Officer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
  {
    id: 5,
    name: "Sophia Bennett",
    role: "Head of Research",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
  {
    id: 6,
    name: "Marcus Webb",
    role: "Senior Portfolio Manager",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
  {
    id: 7,
    name: "Elena Rossi",
    role: "Risk Analyst",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
  {
    id: 8,
    name: "Noah Fischer",
    role: "Client Relations Lead",
    image: "https://randomuser.me/api/portraits/men/64.jpg",
    socials: { facebook: "#", twitter: "#", instagram: "#" },
  },
];

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Screen-dependent sizes for the pinned, horizontal view
const computeLayout = () => {
  const stickyH = Math.max(window.innerHeight - NAVBAR_HEIGHT, 420);
  // card height = what is left after the header and the progress bar.
  // On phones (< 640px) cards are capped at 280px wide to match the Member card.
  const maxW = window.innerWidth < 640 ? 280 : 340;
  const cardW = clamp(((stickyH - 230) * 19) / 27, 200, maxW);
  return { stickyH, cardW };
};

/* ====================================================================== */
/*  BUTTON: colour fills left -> right on hover, arrow rotates            */
/* ====================================================================== */
// Full class names are written out so Tailwind can detect them.
const ARROW_UP_RIGHT = "group-hover:rotate-45 group-focus-visible:rotate-45";
const ARROW_DOWN_RIGHT =
  "rotate-90 group-hover:rotate-[135deg] group-focus-visible:rotate-[135deg]";

function ActionButton({ text, onClick, expanded, pointsDown = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className="group relative isolate inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full bg-brand py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white sm:gap-3 sm:py-2 sm:pl-6 sm:pr-2 sm:text-base md:py-2.5 md:pl-8 md:pr-2.5 md:text-lg"
    >
      {/* hover colour grows from the left edge (0%) to the right edge (100%) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-brand-hover transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />

      {text}

      <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand sm:h-9 sm:w-9 md:h-11 md:w-11">
        <FiArrowUpRight
          className={`h-4 w-4 transition-transform duration-300 ease-out motion-reduce:transition-none md:h-[18px] md:w-[18px] ${
            pointsDown ? ARROW_DOWN_RIGHT : ARROW_UP_RIGHT
          }`}
        />
      </span>
    </button>
  );
}

/* ====================================================================== */
/*  PINNED HORIZONTAL VIEW: vertical scroll moves the cards sideways      */
/* ====================================================================== */
function MemberTrack({ members, onCollapse }) {
  const outerRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const metrics = useRef({ start: 0, total: 0 });

  const [layout, setLayout] = useState(computeLayout);
  const [outerHeight, setOuterHeight] = useState(layout.stickyH);

  // Moves the cards according to how far the page has scrolled through this block
  const update = useCallback(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!outer || !track) return;

    const { start, total } = metrics.current;
    const rect = outer.getBoundingClientRect();
    const progress =
      total > 0 ? clamp((NAVBAR_HEIGHT - rect.top) / total, 0, 1) : 1;

    track.style.transform = `translate3d(${start - progress * total}px,0,0)`;
    if (bar) bar.style.transform = `scaleX(${progress})`;
  }, []);

  // Screen resized -> recompute sizes
  useEffect(() => {
    const onResize = () => setLayout(computeLayout());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Measure the row of cards and size the scroll distance to match
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const viewW = document.documentElement.clientWidth;
    const distance = Math.max(0, track.offsetWidth - viewW); // how far the row must travel
    const start = viewW * ENTER_OFFSET; // cards begin off the right edge
    const total = start + distance;

    metrics.current = { start, total };
    setOuterHeight(layout.stickyH + total);
    update();
  }, [layout, members.length, update]);

  // Follow the page scroll
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [update]);

  return (
    // This tall block is what creates the scroll distance
    <div
      ref={outerRef}
      style={{ height: outerHeight }}
      className="relative lg:px-10"
    >
      {/* This part stays pinned under the navbar while the block scrolls past */}
      <div
        style={{ top: NAVBAR_HEIGHT, height: layout.stickyH }}
        className="sticky flex flex-col overflow-hidden bg-alt"
      >
        {/* compact header */}
        <div className="mx-auto flex w-full max-w-[1600px] items-end justify-between gap-4 px-5 pt-6 sm:gap-6 sm:px-8 xl:px-12">
          <div>
            <SectionLabel>Our Leadership</SectionLabel>
            <h2 className="text-2xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-4xl">
              The Minds Behind Your Success Story
            </h2>
          </div>

          <ActionButton
            text="Show Less"
            onClick={onCollapse}
            expanded={true}
            pointsDown
          />
        </div>

        {/* the moving row of cards */}
        <div className="relative flex-1">
          <div
            ref={trackRef}
            className="absolute inset-y-0 left-0 flex w-max items-center gap-6 px-5 will-change-transform sm:gap-8 sm:px-8 xl:px-12"
          >
            {members.map((m) => (
              <div
                key={m.id}
                style={{ width: layout.cardW }}
                className="shrink-0"
              >
                <Member member={m} />
              </div>
            ))}
          </div>
        </div>

        {/* scroll progress */}
        <div className="mx-auto mb-6 flex w-full max-w-[1600px] items-center gap-4 px-5 sm:px-8 xl:px-12">
          <span className="text-sm font-medium text-muted">
            Scroll to explore
          </span>
          <div className="h-1 w-[min(320px,50%)] overflow-hidden rounded-full bg-ink/10">
            <div
              ref={barRef}
              style={{ transform: "scaleX(0)" }}
              className="h-full origin-left bg-accent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
export default function TeamSection() {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);

  const scrollToSection = () => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  };

  const expand = () => {
    setExpanded(true);
    requestAnimationFrame(scrollToSection);
  };

  const collapse = () => {
    setExpanded(false);
    requestAnimationFrame(scrollToSection);
  };

  return (
    // overflow-x-clip (not overflow-hidden) so the pinned part can stick
    <section
      ref={sectionRef}
      className={`w-full overflow-x-clip bg-alt text-ink transition-colors duration-300 ${
        expanded ? "" : "py-20 sm:py-24 lg:py-32"
      }`}
    >
      {expanded ? (
        <MemberTrack members={MEMBERS} onCollapse={collapse} />
      ) : (
        <div className="mx-auto max-w-[1600px] px-5 sm:px-8 xl:px-12">
          <header className="mb-16 flex flex-wrap items-start justify-between gap-8">
            <div>
              <InView from="top">
                <SectionLabel>Our Leadership</SectionLabel>
              </InView>

              <InView from="top" delay={150}>
                <h2 className="max-w-[620px] text-3xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-4xl lg:text-[48px] xl:text-[54px]">
                  The Minds Behind Your Success Story
                </h2>
              </InView>
            </div>

            <div className="max-w-[460px]">
              <InView from="bottom" delay={300}>
                <p className="mb-6 text-base leading-8 text-muted sm:text-lg">
                  On the other hand, we denounce with righteous indignation and
                  dislike men
                </p>
              </InView>

              <InView from="bottom" delay={450}>
                <ActionButton
                  text="All Members"
                  onClick={expand}
                  expanded={false}
                />
              </InView>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-10 min-[620px]:grid-cols-2 min-[1000px]:grid-cols-4">
            {MEMBERS.slice(0, INITIAL_COUNT).map((m, i) => (
              <InView key={m.id} from="bottom" delay={i * 150} duration={1000}>
                <Member member={m} />
              </InView>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
