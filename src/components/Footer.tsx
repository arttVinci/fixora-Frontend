import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0D0F0E] border-t border-[#2A2E2C]">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              onClick={scrollToTop}
              className="flex items-center gap-2.5 mb-4 cursor-pointer inline-flex"
            >
              <img src="/logo.png" alt="Fixora Logo" className="w-10 h-10 object-contain drop-shadow-md" />
              <span className="font-heading font-bold text-xl text-[#F2F2F0]">Fixora</span>
            </Link>
            <p className="text-[#9BA39E] text-sm leading-relaxed mb-4">
              Platform open source transparansi alokasi APBD dan pelacakan infrastruktur mangkrak untuk akuntabilitas publik Indonesia.
            </p>
            <div className="text-xs text-[#81C784] font-mono">
              MIT Open Source Software
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-[#F2F2F0] mb-4">Eksplorasi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/peta"
                  onClick={scrollToTop}
                  className="text-[#9BA39E] hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  Peta Interaktif Fullscreen
                </Link>
              </li>
              <li>
                <Link
                  to="/transparansi"
                  onClick={scrollToTop}
                  className="text-[#9BA39E] hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  Data & Transparansi
                </Link>
              </li>
              <li>
                <Link
                  to="/tentang"
                  onClick={scrollToTop}
                  className="text-[#9BA39E] hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  Tentang Fixora
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#F2F2F0] mb-4">Data & API</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/transparansi"
                  onClick={scrollToTop}
                  className="text-[#9BA39E] hover:text-[#81C784] transition-colors cursor-pointer"
                >
                  Export Dataset (CSV/JSON)
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9BA39E] hover:text-[#81C784] transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9BA39E] hover:text-[#81C784] transition-colors"
                >
                  Repositori GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#F2F2F0] mb-4">Infrastruktur</h3>
            <ul className="space-y-3 text-sm text-[#9BA39E]">
              <li>Jalan Berlubang & Rusak</li>
              <li>Jembatan & Penyeberangan</li>
              <li>Tumpukan Sampah Liar</li>
              <li>Drainase & Saluran Air</li>
              <li>Fasilitas Gedung Publik</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2A2E2C] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#9BA39E] text-xs">
            © 2026 Fixora — Open Source Infrastructure Neglect Tracker (MIT License).
          </p>
          <p className="text-[#9BA39E]/80 text-xs font-mono">
            Didedikasikan untuk transparansi & keterbukaan data Indonesia
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
