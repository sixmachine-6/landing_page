import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

export default function Button({ text, to = "/contact", className = "" }) {
  return (
    <Link
      to={to}
      className={`group relative isolate mt-3 inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white sm:mt-4 sm:gap-3 sm:py-2 sm:pl-6 sm:pr-2 sm:text-base md:mt-6 md:py-2.5 md:pl-8 md:pr-2.5 md:text-lg lg:mt-8 ${className}`}
    >
      {/* Hover colour that fills the button from left (0%) to right (100%) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-brand-hover transition-transform duration-500 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
      />

      {text}

      <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand sm:h-9 sm:w-9 md:h-11 md:w-11">
        {/* Arrow turns from up-right (↗) to right (→) on hover */}
        <FiArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:rotate-45 group-focus-visible:rotate-45 motion-reduce:transition-none md:h-4.5 md:w-4.5" />
      </span>
    </Link>
  );
}
