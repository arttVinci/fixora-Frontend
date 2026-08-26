import { useEffect, useRef, type CSSProperties } from 'react';
import AnimatedCounter from '../AnimatedCounter';
import HeroMapBackground from './HeroMapBackground';
import InlineHeroAiCard from './InlineHeroAiCard';
import Reveal from '../Reveal';
import HoverButton from '../HoverButton';
import type { IssueReport } from '../../types';

type HeroSectionProps = {
  onLaporMasalah?: () => void;
  onReportSubmitted?: (report: IssueReport) => void;
  onScrollToMap?: () => void;
};

export default function HeroSection({ onLaporMasalah, onReportSubmitted, onScrollToMap }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (prefersReducedMotion || !hasFinePointer) return;

    let rafId = 0;
    let targetX = 50;
    let targetY = 50;
    let currentX = 50;
    let currentY = 50;
    let isActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
      isActive = true;
      section.dataset.cursorActive = 'true';
    };

    const handleMouseLeave = () => {
      isActive = false;
      section.dataset.cursorActive = 'false';
    };

    const animate = () => {
      const ease = isActive ? 0.12 : 0.06;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      section.style.setProperty('--mouse-x', `${currentX}%`);
      section.style.setProperty('--mouse-y', `${currentY}%`);

      rafId = requestAnimationFrame(animate);
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    rafId = requestAnimationFrame(animate);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToMap = () => {
    if (onScrollToMap) {
      onScrollToMap();
    } else {
      const element = document.getElementById('map');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-cursor-section relative min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as CSSProperties}
    >
      <HeroMapBackground />

      <div className="absolute inset-0 bg-dark-surface/30"></div>
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-dark-surface via-dark-surface-low/60 to-dark-surface-high/40"></div>

      <div className="hero-cursor-glow absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          <Reveal className="lg:col-span-6 text-left" delay={0}>
            <Reveal delay={0}>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="w-8 h-px bg-primary-500/80"></span>
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-primary-400 font-mono">
                  CROWDMAPPING INFRASTRUKTUR PUBLIK
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white mb-5 leading-[1.12] text-glow-white tracking-tight">
                Kawal Anggaran.
                <br />
                <span className="text-gradient">Laporkan Mangkrak.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
                Platform transparansi alokasi APBD & pelaporan masalah fasilitas publik secara real-time dengan kecerdasan buatan. Tanpa ribet, langsung ditindaklanjuti.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <HoverButton
                  onClick={onLaporMasalah || scrollToMap}
                  className="btn-primary-glow text-base px-6 py-3.5 flex items-center gap-2 font-bold"
                >
                  <span>+</span> Buat Laporan Gratis
                </HoverButton>
                <HoverButton
                  onClick={scrollToMap}
                  className="text-slate-300 hover:text-white font-semibold text-sm flex items-center gap-1.5 transition-colors group px-2 py-3"
                >
                  <span>Lihat contoh peta</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </HoverButton>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-primary-400 font-heading">
                    <AnimatedCounter end={500} suffix="+" />
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">Laporan Aktif</div>
                </div>
                <div className="border-x border-white/10 px-3">
                  <div className="text-xl sm:text-2xl font-bold text-green-400 font-heading">
                    <AnimatedCounter end={85} suffix="%" />
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">Ditangani</div>
                </div>
                <div className="pl-1">
                  <div className="text-xl sm:text-2xl font-bold text-amber-400 font-heading">
                    <AnimatedCounter end={34} suffix="+" />
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">Provinsi</div>
                </div>
              </div>
            </Reveal>
          </Reveal>

          <Reveal className="lg:col-span-6 relative" delay={0.16}>
            <div className="absolute -inset-10 bg-primary-500/15 blur-[90px] rounded-full animate-glow-pulse pointer-events-none" />
            <div className="relative w-full rounded-[28px] bg-slate-950/70 border border-white/10 overflow-hidden animate-floating shadow-premium backdrop-blur-xl transition-all duration-700 hover:scale-[1.015]
            hover: border-primary-400/40">
              <InlineHeroAiCard
                onReportSubmitted={onReportSubmitted}
                onScrollToMap={scrollToMap}
              />
            </div>
          </Reveal>

        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-scroll-fade hidden xs:block">
        <button
          onClick={scrollToMap}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Scroll down"
        >
          <span className="text-[11px] uppercase tracking-widest font-mono">SCROLL</span>
          <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
}

