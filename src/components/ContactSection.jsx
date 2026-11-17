import { useState } from "react";
import { FiMail, FiNavigation, FiPhoneCall } from "react-icons/fi";

import SectionLabel from "./SectionLabel";
import InView from "../ui/InView";

const PHONE_DISPLAY = "Free +92 (020)-9850";
const PHONE_LINK = "tel:+920209850";
const EMAIL = "needhelp@company.com";
const ADDRESS = "66 broklyn golden street. New York";

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "",
  phone: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect your backend / email service here.
    console.log("Contact form values:", form);
  };

  const handleReset = () => setForm(INITIAL_FORM);

  const inputClass =
    "w-full rounded-xl border border-ink/10 bg-card px-6 py-5 text-base text-ink outline-none transition-colors duration-300 placeholder:text-muted focus:border-accent";

  const infoItems = [
    {
      icon: FiPhoneCall,
      title: "Have any question?",
      text: PHONE_DISPLAY,
      href: PHONE_LINK,
    },
    {
      icon: FiMail,
      title: "Write email",
      text: EMAIL,
      href: `mailto:${EMAIL}`,
    },
    {
      icon: FiNavigation,
      title: "Visit anytime",
      text: ADDRESS,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`,
      external: true,
    },
  ];

  return (
    <section className="w-full overflow-hidden bg-alt py-20 text-ink transition-colors duration-300 sm:py-24 lg:py-32 lg:px-10">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:gap-20 xl:px-12">
        {/* ================= LEFT: FORM ================= */}
        <div>
          <InView from="top">
            <SectionLabel>Send us Email</SectionLabel>
          </InView>

          <InView from="top" delay={150}>
            <h2 className="mb-10 text-3xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-4xl lg:text-[48px] xl:text-[54px]">
              Feel free to write
            </h2>
          </InView>

          <form onSubmit={handleSubmit} onReset={handleReset} noValidate>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <InView from="left" delay={0}>
                <label htmlFor="contact-name" className="sr-only">
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                  autoComplete="name"
                  className={inputClass}
                />
              </InView>

              <InView from="left" delay={120}>
                <label htmlFor="contact-email" className="sr-only">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  autoComplete="email"
                  className={inputClass}
                />
              </InView>

              <InView from="left" delay={240}>
                <label htmlFor="contact-subject" className="sr-only">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter Subject"
                  className={inputClass}
                />
              </InView>

              <InView from="left" delay={360}>
                <label htmlFor="contact-phone" className="sr-only">
                  Phone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone"
                  autoComplete="tel"
                  className={inputClass}
                />
              </InView>

              <InView from="bottom" delay={480} className="sm:col-span-2">
                <label htmlFor="contact-message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={7}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter Message"
                  className={`${inputClass} resize-none`}
                />
              </InView>
            </div>

            <InView
              from="bottom"
              delay={600}
              className="mt-6 flex flex-wrap gap-3"
            >
              <button
                type="submit"
                className="rounded-full bg-brand px-10 py-5 text-base font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                Send Message
              </button>
              <button
                type="reset"
                className="rounded-full border-2 border-down px-10 py-[18px] text-base font-semibold text-down transition-colors hover:bg-down hover:text-white"
              >
                Reset
              </button>
            </InView>
          </form>
        </div>

        {/* ================= RIGHT: CONTACT INFO ================= */}
        <div>
          <InView from="top">
            <SectionLabel>Need Any Help?</SectionLabel>
          </InView>

          <InView from="top" delay={150}>
            <h2 className="mb-6 text-3xl font-semibold leading-[1.2] tracking-[-0.035em] sm:text-4xl lg:text-[48px] xl:text-[54px]">
              Get in touch with us
            </h2>
          </InView>

          <InView from="bottom" delay={300}>
            <p className="mb-10 text-base leading-8 text-muted sm:text-lg">
              Lorem ipsum is simply free text available dolor sit amet
              consectetur notted adipisicing elit sed do eiusmod tempor
              incididunt simply dolore magna.
            </p>
          </InView>

          <ul className="space-y-6">
            {infoItems.map(({ icon: Icon, title, text, href, external }, i) => (
              <InView as="li" key={title} from="right" delay={400 + i * 150}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex items-center gap-6 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="grid h-[84px] w-[84px] shrink-0 place-items-center bg-footer text-white transition-colors duration-300 group-hover:bg-brand sm:h-[100px] sm:w-[100px]">
                    <Icon size={32} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xl font-medium sm:text-2xl">
                      {title}
                    </span>
                    <span className="mt-2 block break-words text-base text-muted transition-colors group-hover:text-accent sm:text-xl">
                      {text}
                    </span>
                  </span>
                </a>
              </InView>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
