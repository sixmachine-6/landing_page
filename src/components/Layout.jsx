import { Outlet } from "react-router-dom";

import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./FooterSection";
import PageTransition from "./PageTransition";

export default function Layout() {
  const { isDark } = useTheme();

  return (
    <div
      className={`flex min-h-screen flex-col transition-colors duration-300 ${
        isDark ? "bg-black text-white" : "bg-[#f8fafc] text-gray-900"
      }`}
    >
      <Navbar />

      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
