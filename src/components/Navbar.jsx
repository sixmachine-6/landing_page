import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon, FiArrowUpRight } from "react-icons/fi";

import { useTheme } from "../context/ThemeContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Team", path: "/team" },
  { name: "FAQs", path: "/faq" },
  { name: "Testimonials", path: "/testimonials" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const linkStyle = ({ isActive }) =>
    `text-[17px] font-semibold transition-colors duration-200 ${
      isActive ? "text-accent" : "text-ink hover:text-accent"
    }`;

  return (
    <>
      <div className="h-20">
        <header
          className={`fixed inset-x-0 top-0 z-50 w-full border-b border-ink/10 bg-page text-ink transition-colors duration-300 ${
            isSticky ? "animate-navbar-drop shadow-lg" : ""
          }`}
        >
          <nav className="mx-auto flex h-20 max-w-[1900px] items-center justify-between px-5 md:px-8 lg:px-5">
            {/* LOGO */}
            <NavLink
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand text-white">
                <FiArrowUpRight size={32} strokeWidth={2.8} />
              </div>
              <span className="text-3xl font-bold tracking-tight md:text-4xl">
                Finvoro
              </span>
            </NavLink>

            {/* DESKTOP NAVIGATION */}
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex xl:gap-12">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === "/"}
                  className={linkStyle}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/10 text-ink transition-colors hover:bg-ink/20"
              >
                {isDark ? (
                  <FiSun size={22} className="text-yellow-300" />
                ) : (
                  <FiMoon size={22} />
                )}
              </button>

              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white hover:bg-brand-hover lg:hidden"
              >
                <FiMenu size={25} />
              </button>
            </div>
          </nav>
        </header>
      </div>

      {/* MOBILE BACKDROP */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-60 bg-black/60 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* MOBILE DRAWER */}
      <aside
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[70] flex h-screen w-[85%] max-w-[380px] flex-col bg-page text-ink transition-transform duration-300 ease-in-out lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 p-6">
          <span className="text-3xl font-bold">
            Finvoro<span className="text-accent">.</span>
          </span>
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex flex-col px-6 py-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center justify-between border-b border-ink/10 py-2 text-lg font-semibold ${
                  isActive ? "text-accent" : "hover:text-accent"
                }`
              }
            >
              {link.name}
              <FiArrowUpRight size={20} className="text-accent" />
            </NavLink>
          ))}
        </div>

        <div className="mt-auto border-t border-ink/10 p-6">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-hover"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
            Switch to {isDark ? "Light" : "Dark"} Mode
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
