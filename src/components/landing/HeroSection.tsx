import AnimatedCounter from '../AnimatedCounter';
import HeroMapBackground from './HeroMapBackground';
import InlineHeroAiCard from './InlineHeroAiCard';
import Reveal from '../Reveal';
import HoverButton from '../HoverButton';
import { MapPinIcon } from '../Icons';
import type { IssueReport } from '../../types';

type HeroSectionProps = {
  onLaporMasalah?: () => void;
  onReportSubmitted?: (report: IssueReport) => void;
  onScrollToMap?: () => void;
};

export default function HeroSection({ onLaporMasalah: _onLaporMasalah, onReportSubmitted, onScrollToMap }: HeroSectionProps) {
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
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <HeroMapBackground />

      {/* Blueprint / Technical Grid Overlay */}
      <div className="absolute inset-0 grid-technical pointer-events-none z-0 opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F0E] via-transparent to-[#0D0F0E]/60 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-16 sm:pt-20 lg:pt-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

          <Reveal className="lg:col-span-6 text-left" delay={0}>
            <Reveal delay={0}>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="w-8 h-px bg-[#2E7D32]"></span>
                <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#81C784] font-mono">
                  CROWDMAPPING INFRASTRUKTUR PUBLIK
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#F2F2F0] mb-5 leading-[1.12] tracking-tight">
                Kawal Anggaran.
                <br />
                <span className="text-gradient">Laporkan Mangkrak.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="text-base sm:text-lg text-[#9BA39E] mb-8 max-w-xl leading-relaxed">
                Platform transparansi alokasi APBD & pelaporan masalah fasilitas publik secara real-time dengan kecerdasan buatan. Tanpa ribet, langsung ditindaklanjuti.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 mb-8">
                {/* Unique Industrial Button */}
                <button
                  onClick={scrollToMap}
                  className="group relative inline-flex items-center gap-3.5 p-1.5 pr-5 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32] transition-all duration-300 shadow-lg hover:bg-[#1C211F] active:scale-[0.98] text-left cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#2E7D32] group-hover:bg-[#1B5E20] text-[#F2F2F0] flex items-center justify-center transition-all shadow-inner relative flex-shrink-0">
                    <MapPinIcon className="w-5 h-5" />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#81C784] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4CAF50]"></span>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                        Lihat Peta Laporan
                      </span>
                      <svg
                        className="w-4 h-4 text-[#81C784] transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-[#9BA39E] font-medium font-mono uppercase tracking-wider">
                      Live Infrastructure Map
                    </span>
                  </div>
                </button>

                {/* Total Laporan Stat */}
                <div className="inline-flex items-center gap-3 py-1 px-1">
                  <div className="text-2xl sm:text-3xl font-bold text-[#81C784] font-heading leading-none">
                    <AnimatedCounter end={500} suffix="+" />
                  </div>
                  <div className="h-6 w-px bg-[#2A2E2C]" />
                  <div className="text-[#9BA39E] text-xs sm:text-sm font-medium whitespace-nowrap">
                    Total Laporan Infrastruktur
                  </div>
                </div>
              </div>
            </Reveal>
          </Reveal>

          <Reveal className="lg:col-span-6 relative flex justify-center" delay={0.16}>
            <div className="relative w-full max-w-[620px] animate-floating">
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
          className="flex flex-col items-center gap-1 text-[#9BA39E] hover:text-[#F2F2F0] transition-colors"
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

