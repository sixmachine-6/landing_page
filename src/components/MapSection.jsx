import { FiMapPin, FiNavigation } from "react-icons/fi";

import SectionLabel from "./SectionLabel";

// ================= SET YOUR COMPANY LOCATION HERE =================
const COMPANY_NAME = "Finvoro";
const ADDRESS = "1901 Thornridge Cir, Shiloh, Hawaii 81063";
const COORDINATES = null; // e.g. { lat: 40.7128, lng: -74.006 }
const ZOOM = 15;
// ==================================================================

export default function MapSection({
  name = COMPANY_NAME,
  address = ADDRESS,
  coordinates = COORDINATES,
  zoom = ZOOM,
}) {
  const query = coordinates ? `${coordinates.lat},${coordinates.lng}` : address;

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    query,
  )}&z=${zoom}&output=embed`;

  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    query,
  )}`;

  return (
    <section className="w-full overflow-hidden bg-page py-20 text-ink transition-colors duration-300 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 xl:px-12">
        <div className="mb-10 lg:mb-14">
          <SectionLabel>Find Us</SectionLabel>
          <h2 className="max-w-[760px] text-3xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-4xl lg:text-[48px] xl:text-[54px]">
            Visit Our Office
          </h2>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <iframe
            title={`${name} location on Google Maps`}
            src={embedSrc}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[420px] w-full border-0 sm:h-[480px] lg:h-[560px]"
          />

          <div className="flex items-start gap-4 bg-card p-6 text-ink lg:absolute lg:bottom-6 lg:left-6 lg:max-w-[380px] lg:rounded-2xl lg:shadow-xl">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-white">
              <FiMapPin size={22} />
            </span>

            <div className="min-w-0">
              <p className="text-lg font-semibold">{name}</p>
              <p className="mt-1 text-base text-muted">{address}</p>

              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                <FiNavigation size={16} />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
