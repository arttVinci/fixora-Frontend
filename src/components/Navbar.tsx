import { useState, useEffect } from "react";
import { MapPinIcon, SparklesIcon } from "./Icons";

export type AppPage = "home" | "peta" | "transparansi" | "tentang";

interface NavbarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  onLaporClick: () => void;
}

const navLinks: { id: AppPage; label: string; badge?: string }[] = [
  { id: "home", label: "Beranda" },
  { id: "peta", label: "Peta Interaktif", badge: "LIVE" },
  { id: "transparansi", label: "Transparansi & Anggaran" },
  { id: "tentang", label: "Tentang OSS" },
];

export default function Navbar({
  activePage,
  onNavigate,
  onLaporClick,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLinkClick = (page: AppPage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`${
          activePage === 'peta' ? 'relative' : 'fixed top-0 left-0 right-0'
        } z-50 transition-all duration-300 flex-shrink-0 ${
          isScrolled || isMobileMenuOpen || activePage === 'peta'
            ? 'bg-[#0D0F0E]/95 py-3 backdrop-blur-xl border-b border-[#2A2E2C]'
            : 'bg-gradient-to-b from-[#0D0F0E]/90 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => handleLinkClick("home")}
            >
              <img
                src="/logo.png"
                alt="Fixora Logo"
                className="w-9 h-9 object-contain drop-shadow-md"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading font-bold text-xl text-[#F2F2F0] tracking-tight">
                  Fixora
                </span>
                <span className="text-[10px] font-mono text-[#81C784] font-semibold uppercase tracking-wider bg-[#1B5E20]/30 px-1.5 py-0.5 rounded border border-[#2E7D32]/40">
                  OSS
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "text-[#F2F2F0] bg-[#161918] border border-[#2A2E2C]"
                        : "text-[#9BA39E] hover:text-[#F2F2F0] hover:bg-[#161918]/50"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[#81C784] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Right Action */}
            <div className="hidden md:flex items-center gap-3">
              {activePage !== 'peta' ? (
                <button
                  onClick={onLaporClick}
                  className="btn-primary text-xs sm:text-sm py-2 px-4 shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>+ Lapor Masalah</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161918] border border-[#2A2E2C] text-xs text-[#9BA39E]">
                  <span className="w-2 h-2 rounded-full bg-[#81C784] animate-pulse" />
                  <span className="font-mono text-[#F2F2F0]">Jabodetabek Live</span>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-[#161918] border border-[#2A2E2C] flex items-center justify-center text-[#F2F2F0] active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle menu"
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
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full text-left py-3.5 px-4 rounded-2xl text-base font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-[#161918] text-[#81C784] border border-[#2E7D32]/50"
                      : "text-[#9BA39E] hover:text-[#F2F2F0]"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-4 pt-6 border-t border-[#2A2E2C]">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLaporClick();
              }}
              className="w-full btn-primary py-3 text-center justify-center font-bold text-sm"
            >
              + Lapor Masalah
            </button>
            <p className="text-center text-xs text-[#9BA39E] font-mono">
              Fixora v1.0 • Open Source Infrastructure Tracker
            </p>
          </div>
        </div>
      )}
    </>
  );
}
