import { RiDoubleQuotesL } from "react-icons/ri";

export default function Testimonial({ testimonial }) {
  const { avatar, headline, quote, name, role } = testimonial;

  return (
    <figure
      className="
        group relative flex h-full gap-5 overflow-hidden rounded-2xl p-6 sm:gap-6 sm:p-8
        border border-emerald-900/10 dark:border-white/10
        bg-emerald-50 dark:bg-black
        shadow-[0_10px_30px_-12px_rgba(16,185,129,0.25)]
        dark:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)]
        transition-transform duration-300 hover:-translate-y-1
      "
    >
      {/* Green rounded left accent bar */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full bg-gradient-to-b from-emerald-400 to-green-600"
      />

      {/* Big faded quote mark in the corner */}
      <RiDoubleQuotesL
        aria-hidden="true"
        size={140}
        className="pointer-events-none absolute -right-4 -top-4 rotate-12 text-emerald-500/10 dark:text-emerald-400/10"
      />

      <img
        src={avatar}
        alt={name}
        className="relative h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-emerald-500/60 ring-offset-2 ring-offset-emerald-50 dark:ring-offset-black sm:h-20 sm:w-20"
      />

      {/* flex-col so the caption can be pushed to the bottom */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <p className="w-fit max-w-full truncate rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 sm:text-sm">
          {headline}
        </p>

        {/* Long quotes are cut off after 5 lines */}
        <blockquote className="mt-4 line-clamp-5 text-lg font-medium leading-[1.4] text-emerald-950 dark:text-white sm:text-xl lg:text-2xl">
          {quote}
        </blockquote>

        {/* mt-auto keeps the name/role at the bottom of every card */}
        <figcaption className="mt-auto flex items-center gap-4 pt-8">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
            <RiDoubleQuotesL size={24} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-medium text-emerald-950 dark:text-white">
              {name}
            </p>
            <p className="mt-1 truncate text-sm text-emerald-900/70 dark:text-white/60">
              {role}
            </p>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
