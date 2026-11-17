import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import HomeSection from "../components/HomeSection";
import AboutSection from "../components/AboutSection";
import TeamSection from "../components/TeamSection";
import ClientTestimonialSection from "../components/ClientTestimonialSection";
import ContactSection from "../components/ContactSection";
import MapSection from "../components/MapSection";
import Footer from "../components/FooterSection";
import FaqSection from "../components/FaqSection";

const SECTION_BY_PATH = {
  "/": null,
  "/about": "about",
  "/team": "team",
  "/testimonials": "testimonials",
  "/contact": "contact",
  "/faq": "faq",
};

const NAVBAR_HEIGHT = 60;

const Home = () => {
  const { pathname, key } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const sectionId = SECTION_BY_PATH[pathname];
    const smooth = !isFirstRender.current;
    isFirstRender.current = false;

    const frame = requestAnimationFrame(() => {
      if (!sectionId) {
        window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
        return;
      }
      const el = document.getElementById(sectionId);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: smooth ? "smooth" : "auto",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, key]);

  return (
    <main className="border-red-300 min-h-screen bg-page text-ink transition-colors duration-300">
      <Navbar />

      {/* ================= HOME (ticker + hero) ================= */}
      {/* HOME (ticker + hero) */}
      <HomeSection />

      <div id="about">
        <AboutSection />
      </div>

      <div id="team">
        <TeamSection />
      </div>

      <div id="faq">
        <FaqSection />
      </div>

      <div id="testimonials">
        <ClientTestimonialSection />
      </div>

      <div id="contact">
        <ContactSection />
      </div>

      <div id="map">
        <MapSection />
      </div>

      <Footer />
    </main>
  );
};

export default Home;
