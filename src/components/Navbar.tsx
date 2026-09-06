import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { CameraIcon } from "./Icons";

export type AppPage = "home" | "peta" | "transparansi" | "tentang";

const navLinks: { path: string; id: AppPage; label: string; badge?: string }[] =
  [
    { path: "/", id: "home", label: "Beranda" },
    { path: "/peta", id: "peta", label: "Peta Infrastruktur" },
    {
      path: "/transparansi",
      id: "transparansi",
      label: "Open Data & Transparansi",
    },
    { path: "/tentang", id: "tentang", label: "Tentang" },
  ];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;
  const isMapPage = pathname === "/peta";

  // Handle scroll state for navbar glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile menu
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, handleKeyDown]);

  const getIsActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname === "";
    }
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <>
      <nav
        className={`${
          isMapPage ? "relative" : "fixed top-0 left-0 right-0"
        } z-50 transition-all duration-300 flex-shrink-0 ${
          isScrolled || isMobileMenuOpen || isMapPage
            ? "bg-[#0D0F0E]/95 py-3 backdrop-blur-xl border-b border-[#2A2E2C]"
            : "bg-gradient-to-b from-[#0D0F0E]/90 to-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <img
                src="/logo.png"
                alt="Fixora Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="font-heading font-bold text-xl text-[#F2F2F0] tracking-tight group-hover:text-[#81C784] transition-colors">
                Fixora
              </span>
            </Link>

            {/* Desktop Navigation Links & Action Button */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-1 sm:gap-1.5">
                {navLinks.map((link) => {
                  const isActive = getIsActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isActive
                          ? "text-[#F2F2F0] bg-[#161918] border-[#2A2E2C] shadow-sm font-semibold"
                          : "text-[#9BA39E] border-transparent hover:text-[#F2F2F0] hover:bg-[#161918]/60 hover:border-[#2A2E2C]/50"
                      }`}
                    >
                      <span>{link.label}</span>
                      {link.badge && (
                        <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                          {link.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[#81C784] rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Dedicated + Buat Laporan Button */}
              <Link
                to="/lapor"
                className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 border ${
                  pathname === "/lapor"
                    ? "bg-[#1B5E20] text-white border-[#81C784] ring-2 ring-[#81C784]/20"
                    : "bg-[#2E7D32] hover:bg-[#1B5E20] text-white border-transparent hover:border-[#81C784]/40"
                }`}
              >
                <CameraIcon className="w-3.5 h-3.5" />
                <span>+ Buat Laporan</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#161918] border border-[#2A2E2C] flex items-center justify-center text-[#F2F2F0] active:scale-95 transition-all cursor-pointer hover:border-[#81C784]/50"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0D0F0E]/98 pt-20 px-6 pb-8 flex flex-col justify-between md:hidden animate-fadeIn backdrop-blur-2xl">
          <div className="space-y-3 pt-4">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full text-left py-3.5 px-4 rounded-2xl text-base font-semibold transition-all flex items-center justify-between cursor-pointer border ${
                    isActive
                      ? "bg-[#161918] text-[#81C784] border-[#2E7D32]/50"
                      : "text-[#9BA39E] border-transparent hover:text-[#F2F2F0] hover:bg-[#161918]/40"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="space-y-4 pt-6 border-t border-[#2A2E2C]">
            <Link
              to="/lapor"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full btn-primary py-3.5 text-center justify-center font-bold text-sm flex items-center shadow-lg gap-2"
            >
              <CameraIcon className="w-4 h-4" />
              <span>+ Buat Laporan Baru</span>
            </Link>
            <p className="text-center text-xs text-[#9BA39E]">
              Fixora • Platform Partisipasi Infrastruktur Publik
            </p>
          </div>
        </div>
      )}
    </>
  );
}
