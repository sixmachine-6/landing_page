import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";

export default function Member({ member }) {
  const { name, role, image, socials } = member;
  const [open, setOpen] = useState(false);

  // The notch must match the colour behind the card: TeamSection uses `alt`.
  const corner =
    "[--notch:rgb(var(--alt))] " +
    "before:absolute before:right-full before:top-0 before:h-6 before:w-6 before:bg-[radial-gradient(circle_at_0_100%,transparent_23.5px,var(--notch)_24px)] " +
    "after:absolute after:right-0 after:top-full after:h-6 after:w-6 after:bg-[radial-gradient(circle_at_0_100%,transparent_23.5px,var(--notch)_24px)]";

  const socialBase =
    "absolute right-0 grid h-[60px] w-[60px] place-items-center rounded-[14px] bg-brand text-white transition duration-500 ease-out hover:bg-brand-hover motion-reduce:transition-none";

  const socialState = (delay) =>
    open
      ? `translate-y-0 scale-100 opacity-100 ${delay}`
      : "-translate-y-5 scale-75 opacity-0 pointer-events-none";

  return (
    <article
      tabIndex={0}
      aria-label={`${name}, ${role}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      // Mobile: card is capped at 280px wide (so about 280 x 360) and centred.
      // From `sm` (640px) up it fills its column like before.
      className="relative isolate mx-auto aspect-21/27 w-full max-w-[280px] cursor-pointer overflow-hidden rounded-3xl bg-card outline-none transition-colors duration-300 focus-visible:ring-4 focus-visible:ring-accent sm:mx-0 sm:max-w-none"
    >
      {/* Photo: circle at rest, grows to fill the card on hover */}
      <img
        src={image}
        alt={name}
        className={`absolute inset-0 h-full w-full origin-[50%_41%] object-cover object-[50%_30%] transition-[clip-path,transform] duration-700 ease-out motion-reduce:transition-none ${
          open
            ? "scale-100 [clip-path:circle(80%_at_50%_41%)]"
            : "scale-[0.8] [clip-path:circle(30.6%_at_50%_41%)]"
        }`}
      />

      {/* Dark fade behind the text (hover only) */}
      <div
        className={`pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent via-45% to-transparent transition-opacity duration-700 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Name + role */}
      <div
        className={`absolute left-[10%] transition-all duration-700 ease-out motion-reduce:transition-none ${
          open ? "bottom-6" : "bottom-12"
        }`}
      >
        <h3
          className={`text-xl font-semibold transition-colors duration-500 sm:text-2xl ${
            open ? "text-white" : "text-ink"
          }`}
        >
          {name}
        </h3>
        <p
          className={`mt-1 text-sm transition-colors duration-500 sm:text-base ${
            open ? "text-white/90" : "text-muted"
          }`}
        >
          {role}
        </p>
      </div>

      {/* Notch: grows taller on hover to hold the social icons */}
      <div
        className={`absolute right-0 top-0 z-10 w-20 rounded-bl-3xl bg-notch transition-[height] duration-500 ease-out motion-reduce:transition-none ${
          open ? "h-53.5" : "h-17.5"
        } ${corner}`}
      >
        <span
          className={`absolute right-0 top-0.5 grid h-15 w-15 place-items-center rounded-[14px] bg-card text-ink transition duration-300 motion-reduce:transition-none ${
            open ? "scale-75 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <FiPlus size={18} />
        </span>

        <a
          href={socials.facebook}
          aria-label={`${name} on Facebook`}
          className={`${socialBase} top-0.5 ${socialState("delay-100")}`}
        >
          <FaFacebook size={20} />
        </a>
        <a
          href={socials.twitter}
          aria-label={`${name} on Twitter`}
          className={`${socialBase} top-18.5 ${socialState("delay-200")}`}
        >
          <FaTwitter size={20} />
        </a>
        <a
          href={socials.instagram}
          aria-label={`${name} on Instagram`}
          className={`${socialBase} top-36.5 ${socialState("delay-300")}`}
        >
          <FaInstagram size={20} />
        </a>
      </div>
    </article>
  );
}
