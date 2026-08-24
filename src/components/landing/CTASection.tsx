import Reveal from '../Reveal';
import HoverButton from '../HoverButton';

export default function CTASection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-dark-surface-low to-secondary-900/30"></div>

      <div className="absolute inset-0 grid-pattern opacity-30"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 badge-primary mb-6">
            <span>🚀</span>
            <span>Mulai Sekarang</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-6">
            Siap Berkontribusi?
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Laporkan infrastruktur mangkrak di sekitarmu dan bantu wujudkan transparansi
            penggunaan anggaran daerah.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <HoverButton
              onClick={() => {
                const el = document.getElementById('map');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary-glow text-lg px-10 py-4"
            >
              + Lapor Masalah
            </HoverButton>
            <HoverButton
              onClick={() => {
                const el = document.getElementById('stats');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-outline text-lg px-10 py-4"
            >
              📊 Lihat Statistik
            </HoverButton>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Gratis untuk digunakan</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Verifikasi dengan AI</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Transparan 100%</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
