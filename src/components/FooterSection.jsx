import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import {
  FiChevronUp,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTrendingUp,
} from "react-icons/fi";

import { useTheme } from "../context/ThemeContext";
import InView from "../ui/InView";

const PHONE_DISPLAY = "+629 555-0129";
const PHONE_LINK = "tel:+6295550129";
const EMAIL = "demo@example.com";
const ADDRESS_LINES = ["1901 Thornridge Cir.", "Shiloh Hawaii 81063"];

const HOURS = [
  { day: "Mon-Fri:", time: "9.00 am - 8.00pm" },
  { day: "Saturday:", time: "10.00 am - 8.00pm" },
  { day: "Sunday:", time: "Closed" },
];

const COMPANY_LINKS = [
  { label: "About", to: "/about" },
  { label: "FAQs", to: "/faq1`" },
  { label: "Contact Us", to: "/contact" },
];

const SOCIALS = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "Twitter", icon: FaTwitter, href: "#" },
  { label: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
];

const LEGAL_LINKS = [
  { label: "Terms & Condition", to: "/" },
  { label: "Privacy Policy", to: "/" },
  { label: "Contact us", to: "/contact" },
];

// Side spacing used by every row of the footer.
// Bigger screens get more room so the content never sits close to the edge.
const CONTAINER =
  "mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-24";

// Round icon badge shown next to contact details on mobile only
const ICON_BADGE =
  "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 lg:hidden";

export default function Footer() {
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: connect your newsletter service here.
    console.log("Newsletter email:", email);
    setEmail("");
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ---------- theme colours (night = dark footer, day = green footer) ----------
     To change the day-mode green, replace #0f5c2e below
     (it appears in `bg`, `solidBtn` and the `text-[#0f5c2e]` classes). */
  const t = isDark
    ? {
        bg: "bg-footer",
        link: "text-white/60 hover:text-[#34d17a] focus-visible:text-[#34d17a]",
        hover: "hover:text-[#34d17a]",
        legal: "text-white/80 hover:text-[#34d17a]",
        logo: "text-[#34d17a]",
        social: "hover:bg-brand",
        ring: "focus-within:ring-[#34d17a]",
        solidBtn: "bg-brand text-white hover:bg-brand-hover",
        hours: "text-white/60",
      }
    : {
        bg: "bg-[#0f5c2e]",
        link: "text-white/80 hover:text-[#9af2bf] focus-visible:text-[#9af2bf]",
        hover: "hover:text-[#9af2bf]",
        legal: "text-white/90 hover:text-[#9af2bf]",
        logo: "text-[#9af2bf]",
        social: "hover:bg-white hover:text-[#0f5c2e]",
        ring: "focus-within:ring-white",
        solidBtn: "bg-white text-[#0f5c2e] hover:bg-[#d9f7e4]",
        hours: "text-white/80",
      };

  const linkClass = `text-base transition-colors duration-200 focus-visible:outline-none sm:text-lg ${t.link}`;

  // Mobile: each block is a soft card. Large screens: plain columns (as before).
  const card = "rounded-2xl bg-white/10 p-5 sm:p-6 lg:bg-transparent lg:p-0";
  const heading = "mb-4 text-xl font-medium lg:mb-8 lg:text-2xl";

  return (
    <footer
      className={`relative w-full overflow-hidden text-white transition-colors duration-300 ${t.bg}`}
    >
      {/* TOP: HOURS / COMPANY / CONTACT
          Mobile: three stacked cards.  Large screens: three columns. */}
      <div
        className={`${CONTAINER} flex flex-col gap-5 pb-12 pt-12 lg:flex-row lg:justify-between lg:gap-16 lg:pb-16 lg:pt-20`}
      >
        {/* Working hours */}
        <InView from="bottom" delay={0} className={card}>
          <h3 className={heading}>Working Hours</h3>
          <ul className="space-y-4 lg:space-y-6">
            {HOURS.map(({ day, time }) => (
              <li
                key={day}
                className={`flex items-center justify-between gap-4 border-b border-white/10 pb-4 text-base last:border-b-0 last:pb-0 sm:text-lg lg:grid lg:grid-cols-[140px_1fr] lg:gap-2 lg:border-b-0 lg:pb-0 ${t.hours}`}
              >
                <span>{day}</span>
                <span className="text-right text-white lg:text-left lg:text-inherit">
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </InView>

        {/* Company */}
        <InView from="bottom" delay={150} className={card}>
          <h3 className={heading}>Company</h3>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-4 lg:block lg:space-y-5">
            {COMPANY_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </InView>

        {/* Contact details + socials */}
        <InView
          from="bottom"
          delay={300}
          className={`${card} space-y-4 text-base font-medium sm:text-lg lg:space-y-5`}
        >
          <h3 className={`${heading} lg:hidden`}>Contact</h3>

          <a
            href={PHONE_LINK}
            className={`flex items-center gap-3 transition-colors lg:block ${t.hover}`}
          >
            <span className={ICON_BADGE}>
              <FiPhone size={18} />
            </span>
            {PHONE_DISPLAY}
          </a>

          <a
            href={`mailto:${EMAIL}`}
            className={`flex items-center gap-3 break-words transition-colors lg:block ${t.hover}`}
          >
            <span className={ICON_BADGE}>
              <FiMail size={18} />
            </span>
            {EMAIL}
          </a>

          <div className="flex items-start gap-3 lg:block">
            <span className={ICON_BADGE}>
              <FiMapPin size={18} />
            </span>
            <address className="not-italic leading-7 lg:leading-8">
              {ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>

          <div className="flex gap-2 pt-2 lg:pt-4">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className={`grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 ${t.social}`}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </InView>
      </div>

      {/* MIDDLE: LOGO + NEWSLETTER */}
      <div className="border-t border-white/15">
        <div
          className={`${CONTAINER} grid grid-cols-1 items-center gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1.3fr] lg:gap-16`}
        >
          <InView from="left">
            <Link
              to="/"
              aria-label="Finvoro home"
              className="flex items-center gap-3"
            >
              <FiTrendingUp size={44} className={t.logo} />
              <span className="text-4xl font-semibold tracking-tight">
                Finvoro
              </span>
            </Link>
          </InView>

          <InView from="bottom" delay={150}>
            <h3 className="max-w-[420px] text-2xl font-medium leading-[1.5]">
              Subscribe to Our Newsletter for Exclusive Updates
            </h3>
          </InView>

          <InView from="right" delay={300}>
            <form
              onSubmit={handleSubscribe}
              className={`flex w-full items-center rounded-full bg-white/10 p-2 focus-within:ring-2 ${t.ring}`}
            >
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                autoComplete="email"
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-base text-white outline-none placeholder:text-white/60 sm:px-6"
              />
              <button
                type="submit"
                className={`shrink-0 rounded-full px-6 py-4 text-base font-semibold transition-colors sm:px-8 ${t.solidBtn}`}
              >
                Subscribe
              </button>
            </form>
          </InView>
        </div>
      </div>

      {/* BOTTOM: COPYRIGHT + LEGAL
          Extra bottom padding on mobile so the back-to-top button
          sits in its own space and never covers the links. */}
      <div className="border-t border-white/15">
        <div
          className={`${CONTAINER} flex flex-col items-start justify-between gap-5 pb-24 pt-8 md:flex-row md:items-center md:pb-8`}
        >
          <p className="text-base text-white/80">
            © Copyright {new Date().getFullYear()} by Company.com
          </p>

          <ul className="flex flex-wrap gap-x-8 gap-y-3 pr-0 md:pr-20 lg:gap-x-16">
            {LEGAL_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className={`text-base transition-colors ${t.legal}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BACK TO TOP */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`absolute bottom-6 right-5 grid h-12 w-12 place-items-center rounded-full shadow-lg transition hover:-translate-y-1 sm:right-8 md:h-14 md:w-14 lg:right-12 xl:right-16 2xl:right-24 ${t.solidBtn}`}
      >
        <FiChevronUp size={24} />
      </button>
    </footer>
  );
}
