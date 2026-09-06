import { useState } from 'react';
import Reveal from '../Reveal';
import {
  CameraIcon,
  CheckIcon,
  MapPinIcon,
  SearchIcon,
  CloseIcon,
  BotIcon,
  CheckCircleIcon,
  MapIcon
} from '../Icons';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(2);

  const steps = [
    {
      id: 1,
      icon: <CameraIcon className="w-5 h-5" />,
      title: 'Warga Unggah Foto',
      description: 'Laporkan kondisi infrastruktur mangkrak dengan mudah melalui foto ponsel',
    },
    {
      id: 2,
      icon: <BotIcon className="w-5 h-5" />,
      title: 'AI Deteksi & Kategori',
      description: 'Sistem AI kami mengklasifikasikan jenis kerusakan & deskripsi secara otomatis',
    },
    {
      id: 3,
      icon: <CheckCircleIcon className="w-5 h-5" />,
      title: 'Verifikasi APBD & Lokasi',
      description: 'Verifikasi data dengan alokasi anggaran dan lokasi yang akurat',
    },
    {
      id: 4,
      icon: <MapIcon className="w-5 h-5" />,
      title: 'Transparansi Peta Publik',
      description: 'Semua laporan ditampilkan secara transparan di peta publik',
    },
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-[#F2F2F0] mb-4">
            Bagaimana Fixora Bekerja?
          </h2>
          <p className="text-[#9BA39E] max-w-2xl mx-auto text-base sm:text-lg">
            Proses transparan yang melibatkan warga, AI, dan pemerintah untuk penanganan infrastruktur yang lebih baik.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Step Buttons */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {steps.map((step, index) => (
            <Reveal key={step.id} delay={index * 0.06}>
              <button
                onClick={() => setActiveStep(step.id)}
                className={`text-left p-5 rounded-2xl border transition-all duration-300 w-full relative overflow-hidden group ${
                  activeStep === step.id
                    ? 'border-[#2E7D32]/70 bg-[#161918] shadow-lg shadow-[#2E7D32]/10'
                    : 'border-[#2A2E2C] bg-[#161918]/60 hover:border-[#2E7D32]/40 hover:bg-[#161918]'
                }`}
              >
                {activeStep === step.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2E7D32] rounded-l-2xl" />
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    activeStep === step.id
                      ? 'bg-[#1B5E20]/35 text-[#81C784] border border-[#2E7D32]/50'
                      : 'bg-[#0D0F0E] text-[#9BA39E] border border-[#2A2E2C]'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#81C784] font-bold text-xs mb-1">
                      Langkah {step.id}
                    </div>
                    <h3 className="text-[#F2F2F0] font-bold text-base sm:text-lg leading-snug">{step.title}</h3>
                    <p className="text-[#9BA39E] text-xs sm:text-sm mt-1 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Right Column: Preview Display matching Screenshots */}
        <div className="lg:col-span-7">
          <Reveal delay={0.12} className="relative">
            <div className="w-full transition-all duration-300">

              {/* ============================================================ */}
              {/* STEP 1: WARGA UNGGAH FOTO */}
              {/* ============================================================ */}
              {activeStep === 1 && (
                <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2A2E2C] pb-3">
                    <div className="flex items-center gap-2">
                      <CameraIcon className="w-5 h-5 text-[#81C784]" />
                      <span className="text-[#F2F2F0] font-bold text-base">Unggah Foto Laporan</span>
                    </div>
                    <span className="text-xs text-[#81C784] bg-[#1B5E20]/30 border border-[#2E7D32]/40 px-2.5 py-1 rounded-full">
                      Ponsel / Kamera
                    </span>
                  </div>

                  <div className="border border-dashed border-[#2A2E2C] bg-[#0D0F0E] rounded-xl p-6 text-center space-y-3">
                    <div className="w-16 h-16 bg-[#1B5E20]/25 text-[#81C784] rounded-full flex items-center justify-center mx-auto border border-[#2E7D32]/30">
                      <CameraIcon className="w-8 h-8 text-[#81C784]" />
                    </div>
                    <div>
                      <p className="text-[#F2F2F0] font-semibold text-sm">Ambil Foto Infrastruktur Mangkrak</p>
                      <p className="text-[#9BA39E] text-xs mt-1">Dukungan format JPG, PNG, WEBP hingga 10MB</p>
                    </div>
                    <button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] text-xs font-bold px-4 py-2 rounded-full shadow transition-all inline-flex items-center gap-1.5">
                      <CameraIcon className="w-3.5 h-3.5" /> Ambil / Pilih Foto
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 2: AI DETEKSI & KATEGORI (EXACT MATCH FOR SCREENSHOT 1) */}
              {/* ============================================================ */}
              {activeStep === 2 && (
                <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-5 shadow-2xl space-y-4 text-left max-h-[560px] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-[#2A2E2C] pb-3">
                    <h3 className="text-[#F2F2F0] font-bold text-lg">Laporan foto</h3>
                    <button className="text-[#9BA39E] hover:text-[#F2F2F0] p-1">
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI Badge */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#81C784]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                    Didukung oleh Fixora AI
                  </div>

                  {/* Photo Upload Area */}
                  <div>
                    <label className="text-[#F2F2F0] font-semibold text-xs block mb-1.5">
                      Foto <span className="text-[#81C784]">*</span>
                    </label>

                    <div className="border border-[#2A2E2C] bg-[#0D0F0E] rounded-xl p-5 text-center space-y-3 relative">
                      {/* Photo Thumbnail */}
                      <div className="relative w-20 h-20 mx-auto rounded-xl overflow-hidden border border-[#2A2E2C] shadow-md">
                        <img
                          src="/images/jalan-berlubang.jpg"
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-1 right-1 w-4 h-4 bg-[#161918]/80 text-white rounded-full flex items-center justify-center text-[10px] cursor-pointer">
                          <CloseIcon className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Green Action Button */}
                      <button className="bg-[#1B5E20]/30 border border-[#2E7D32]/50 hover:bg-[#2E7D32]/40 text-[#81C784] text-xs font-semibold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2">
                        <CameraIcon className="w-4 h-4 text-[#81C784]" />
                        <span>Klik untuk mengunggah</span>
                      </button>

                      {/* Helper texts */}
                      <p className="text-[#9BA39E] text-xs">
                        atau melalui seret & lepas • <span className="text-[#F2F2F0]">1/3</span>
                      </p>
                      <p className="text-[#9BA39E]/80 text-[11px]">
                        Dilarang memotret orang/plat nomor kendaraan.
                      </p>
                      <p className="text-[#9BA39E] text-[11px] flex items-center justify-center gap-1">
                        Analisis melalui Fixora AI (Indonesia) <span className="text-[#9BA39E]/70">ⓘ</span>
                      </p>
                    </div>
                  </div>

                  {/* Category Field */}
                  <div>
                    <label className="text-[#F2F2F0] font-semibold text-xs block mb-1.5">
                      kategori <span className="text-[#81C784]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        disabled
                        className="w-full bg-[#0D0F0E] border border-[#2A2E2C] text-[#F2F2F0] text-xs rounded-xl px-4 py-3 appearance-none focus:outline-none"
                      >
                        <option>Jalan Rusak</option>
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-[#9BA39E] text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Field */}
                  <div>
                    <label className="text-[#F2F2F0] font-semibold text-xs block mb-1">
                      Keterangan <span className="text-[#81C784]">*</span>
                    </label>
                    <p className="text-[#9BA39E] text-[11px] mb-2">
                      Ini dihasilkan secara otomatis dari foto. Anda dapat menyesuaikan teksnya.
                    </p>
                    <div className="bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl p-3.5 text-xs text-[#F2F2F0] leading-relaxed font-normal">
                      Terdeteksi kerusakan permukaan jalan berlubang dengan kedalaman ~8cm. Potensi bahaya bagi pengguna jalan.
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 3: VERIFIKASI APBD & LOKASI */}
              {/* ============================================================ */}
              {activeStep === 3 && (
                <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#2A2E2C] pb-3">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-[#81C784]" />
                      <span className="text-[#F2F2F0] font-bold text-base">Verifikasi APBD & Wilayah</span>
                    </div>
                    <span className="text-xs bg-[#1B5E20]/30 text-[#81C784] border border-[#2E7D32]/40 px-2.5 py-1 rounded-full font-mono">
                      Matched
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl p-4 space-y-1">
                      <span className="text-[#9BA39E] text-xs">Lokasi Terverifikasi</span>
                      <p className="text-[#F2F2F0] font-bold text-sm">Jakarta Selatan</p>
                      <p className="text-[#9BA39E] text-xs">Kecamatan Setiabudi</p>
                    </div>
                    <div className="bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl p-4 space-y-1">
                      <span className="text-[#9BA39E] text-xs">Alokasi Anggaran</span>
                      <p className="text-[#81C784] font-bold text-sm">Rp 450 Juta</p>
                      <p className="text-[#9BA39E] text-xs">APBD Tahun 2026</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 4: TRANSPARANSI PETA PUBLIK (EXACT MATCH FOR SCREENSHOT 2) */}
              {/* ============================================================ */}
              {activeStep === 4 && (
                <div className="relative rounded-2xl overflow-hidden border border-[#2A2E2C] shadow-2xl h-[420px] bg-[#0D0F0E]">
                  <div className="absolute inset-0 bg-[radial-gradient(#2A2E2C_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

                  {/* Top Bar */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value="Temukan lokasi..."
                        className="bg-[#161918] text-[#9BA39E] text-xs px-3.5 py-2 pl-8 rounded-full border border-[#2A2E2C] shadow-lg w-44"
                      />
                      <SearchIcon className="w-3.5 h-3.5 text-[#9BA39E] absolute left-2.5 top-2.5" />
                    </div>
                    <button className="flex items-center gap-1.5 bg-[#161918] text-[#F2F2F0] text-xs font-bold px-3.5 py-2 rounded-full border border-[#2A2E2C] shadow-lg">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#81C784]" />
                      <span>Tandai Lokasi</span>
                    </button>
                  </div>

                  {/* Map Markers */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-14 left-20 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-[#2E7D32] text-[#F2F2F0] font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-[#161918]">
                        2
                      </div>
                    </div>

                    <div className="absolute top-10 left-1/2 -translate-x-3 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-[#2E7D32] text-[#F2F2F0] font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-[#161918]">
                        36
                      </div>
                    </div>

                    <div className="absolute top-14 right-20 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-[#2E7D32] text-[#F2F2F0] font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-[#161918]">
                        2
                      </div>
                    </div>

                    {/* Pin Hijau */}
                    <div className="absolute bottom-28 right-2/5 flex flex-col items-center" style={{ right: '38%' }}>
                      <div className="w-10 h-10 rounded-full bg-[#2E7D32] border-2 border-[#161918] shadow-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#F2F2F0]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
                        </svg>
                      </div>
                      <div className="w-1.5 h-3 bg-[#2E7D32] rounded-b-full" />
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <a
                      href="#map"
                      className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] font-bold text-xs px-4 py-2 rounded-full shadow-xl transition-all"
                    >
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>Buka Peta Publik Penuh</span>
                    </a>
                  </div>
                </div>
              )}

            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
