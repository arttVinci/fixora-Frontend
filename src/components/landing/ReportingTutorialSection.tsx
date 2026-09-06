import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CameraIcon, SparklesIcon, MapPinIcon } from '../Icons';

interface ReportingTutorialSectionProps {
  onLaporMasalah?: () => void;
}

export default function ReportingTutorialSection(_props: ReportingTutorialSectionProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const steps = [
    {
      id: 0,
      number: '01',
      title: 'Ambil Foto Ber-Timestamp',
      shortTitle: '01. Potret Ber-GPS',
      badge: 'Langkah 1',
      description:
        'Gunakan aplikasi Timestamp Camera di ponsel Anda saat memotret fasilitas yang rusak. Pastikan watermark tanggal, waktu, alamat, dan koordinat GPS tercetak jelas pada foto.',
      whyNeeded:
        'Watermark timestamp mengunci koordinat GPS riil di lapangan serta mencegah manipulasi data.',
      icon: <CameraIcon className="w-5 h-5" />,
    },
    {
      id: 1,
      number: '02',
      title: 'Unggah ke AI Fixora',
      shortTitle: '02. Unggah ke AI',
      badge: 'Langkah 2',
      description:
        'Kirim foto hasil jepretan Anda langsung ke asisten AI di halaman utama Fixora. Sistem tidak mewajibkan registrasi akun atau pengisian formulir manual.',
      whyNeeded:
        'Proses instan tanpa birokrasi, siapapun dapat melapor dalam hitungan detik.',
      icon: <SparklesIcon className="w-5 h-5" />,
    },
    {
      id: 2,
      number: '03',
      title: 'AI Ekstrak & Terbitkan ke Radar',
      shortTitle: '03. Masuk Radar Peta',
      badge: 'Langkah 3',
      description:
        'Multimodal Vision AI Fixora otomatis memindai teks watermark GPS (OCR), mendeteksi kategori kerusakan, dan langsung mempublikasikan titik laporan ke peta radar publik.',
      whyNeeded:
        'Laporan langsung transparan dipantau publik dan timer penghitung durasi mangkrak otomatis mulai berjalan.',
      icon: <MapPinIcon className="w-5 h-5" />,
    },
  ];

  // Auto-progress through steps every 6 seconds unless user pauses
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, steps.length]);

  const current = steps[activeStep];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090B0A] border-t border-[#2A2E2C] relative overflow-hidden font-sans">
      {/* Subtle single-color monochrome green ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2E7D32]/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161918] border border-[#2E7D32]/40 text-[#81C784] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#81C784] animate-pulse" />
            <span>Panduan Pelaporan</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F2F0] tracking-tight">
            Cara Melapor dengan Timestamp Camera
          </h2>
          <p className="text-sm sm:text-base text-[#9BA39E] leading-relaxed">
            Cukup ambil foto dengan aplikasi kamera timestamp. AI Fixora otomatis membaca lokasi presisi dan kategori kerusakan tanpa formulir rumit.
          </p>
        </div>

        {/* Interactive Step Switcher Tabs */}
        <div
          className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 bg-[#121514] border border-[#2A2E2C] rounded-2xl max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-[#1B5E20]/40 text-[#81C784] border border-[#2E7D32]/60 shadow-md font-bold'
                    : 'text-[#9BA39E] hover:text-[#F2F2F0] hover:bg-[#161918]'
                }`}
              >
                <span>{step.shortTitle}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#81C784]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Stage Interactive Showcase */}
        <div
          className="rounded-3xl bg-[#121514] border border-[#2A2E2C] p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#81C784 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Side: Step Details */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#81C784]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1B5E20]/30 border border-[#2E7D32]/40 font-semibold">
                    {current.badge}
                  </span>
                  <span className="text-[#9BA39E]">•</span>
                  <span className="text-[#9BA39E]">Langkah {current.number} dari 03</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#F2F2F0] tracking-tight">
                  {current.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-[#9BA39E] leading-relaxed">
                {current.description}
              </p>

              <div className="p-4 rounded-2xl bg-[#0D0F0E] border border-[#2A2E2C] space-y-1.5">
                <div className="text-xs font-semibold text-[#81C784]">
                  Mengapa langkah ini penting?
                </div>
                <p className="text-xs text-[#9BA39E] leading-relaxed">
                  {current.whyNeeded}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link
                  to="/lapor"
                  className="py-2.5 px-5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span>Coba Lapor Sekarang</span>
                </Link>
              </div>
            </div>

            {/* Right Side: Clean Minimal Stage Visual Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-[#0D0F0E] border border-[#2A2E2C] p-6 shadow-inner relative flex flex-col justify-between aspect-[16/11] overflow-hidden">
                {/* ── STEP 1 VISUAL PREVIEW: CAMERA VIEW ── */}
                {activeStep === 0 && (
                  <div className="h-full flex flex-col justify-between space-y-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="flex items-center justify-between text-xs text-[#81C784]">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#81C784] animate-pulse" />
                        <span>GPS Terkunci</span>
                      </div>
                      <span className="text-[#9BA39E] text-xs">Akurasi: ±1.2m</span>
                    </div>

                    {/* Viewfinder Frame with Watermark */}
                    <div className="relative flex-1 rounded-xl bg-[#161918] border border-[#2E7D32]/30 p-4 flex flex-col justify-between overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                        <div className="w-12 h-12 border border-[#81C784] rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-1.5 h-1.5 bg-[#81C784] rounded-full" />
                        </div>
                      </div>

                      {/* Corner Brackets */}
                      <div className="flex justify-between pointer-events-none">
                        <div className="w-3 h-3 border-t-2 border-l-2 border-[#81C784]" />
                        <div className="w-3 h-3 border-t-2 border-r-2 border-[#81C784]" />
                      </div>

                      {/* Stamped Watermark */}
                      <div className="p-3 rounded-lg bg-black/80 border border-white/10 text-left text-xs space-y-0.5">
                        <div className="text-[#81C784] font-semibold">
                          01-09-2026 • 14:35 WIB
                        </div>
                        <div className="text-[#F2F2F0] text-xs truncate font-medium">
                          Jl. Raya Siliwangi No. 18, Bekasi
                        </div>
                        <div className="text-[#9BA39E] text-[11px]">
                          LAT: -6.241582 • LNG: 106.992415
                        </div>
                      </div>

                      <div className="flex justify-between pointer-events-none">
                        <div className="w-3 h-3 border-b-2 border-l-2 border-[#81C784]" />
                        <div className="w-3 h-3 border-b-2 border-r-2 border-[#81C784]" />
                      </div>
                    </div>

                    <div className="text-xs text-[#9BA39E] text-center">
                      Rekomendasi App: <span className="text-[#F2F2F0] font-semibold">Timestamp Camera</span> di Play Store / App Store
                    </div>
                  </div>
                )}

                {/* ── STEP 2 VISUAL PREVIEW: INSTANT UPLOAD ── */}
                {activeStep === 1 && (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-4 animate-[fadeIn_0.4s_ease-out]">
                    <div className="w-14 h-14 rounded-2xl bg-[#1B5E20]/20 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] animate-bounce">
                      <SparklesIcon className="w-7 h-7" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-[#F2F2F0]">
                        Kirim Foto ke AI Fixora
                      </h4>
                      <p className="text-xs text-[#9BA39E] max-w-xs leading-relaxed">
                        Tarik & letakkan foto di kolom beranda. Bebas form, tanpa perlu buat akun.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#161918] border border-[#2E7D32]/40 text-[#81C784] text-xs font-semibold">
                      <SparklesIcon className="w-3.5 h-3.5" />
                      <span>AI Siap Membaca Otomatis</span>
                    </div>
                  </div>
                )}

                {/* ── STEP 3 VISUAL PREVIEW: RADAR MAP PUBLISH ── */}
                {activeStep === 2 && (
                  <div className="h-full flex flex-col justify-between space-y-3 animate-[fadeIn_0.4s_ease-out]">
                    <div className="flex items-center justify-between text-xs text-[#81C784]">
                      <span className="font-semibold flex items-center gap-1.5">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>Radar Publik Aktif</span>
                      </span>
                      <span className="text-[#81C784] font-semibold">Status: Live</span>
                    </div>

                    {/* Result Card */}
                    <div className="p-4 rounded-xl bg-[#161918] border border-[#2E7D32]/40 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#9BA39E]">Objek Terdeteksi:</span>
                        <span className="text-[#81C784] font-semibold">Jalan Rusak</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#9BA39E]">Koordinat Terbaca:</span>
                        <span className="text-[#F2F2F0] font-medium">-6.241582, 106.992415</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[#2A2E2C] pt-2">
                        <span className="text-[#9BA39E]">Timer Mangkrak:</span>
                        <span className="text-[#81C784] font-semibold">Aktif (Hari ke-1)</span>
                      </div>
                    </div>

                    <div className="text-xs text-[#9BA39E] text-center">
                      Titik langsung dapat dipantau oleh seluruh masyarakat di peta radar
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
