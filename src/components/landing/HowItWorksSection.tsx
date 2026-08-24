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
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Bagaimana Fixora Bekerja?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
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
                    ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                    : 'border-white/10 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {activeStep === step.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
                )}
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    activeStep === step.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-emerald-400 font-bold text-xs mb-1">
                      Langkah {step.id}
                    </div>
                    <h3 className="text-white font-bold text-base sm:text-lg leading-snug">{step.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">{step.description}</p>
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
                <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CameraIcon className="w-5 h-5 text-red-500" />
                      <span className="text-white font-bold text-base">Unggah Foto Laporan</span>
                    </div>
                    <span className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                      Ponsel / Kamera
                    </span>
                  </div>

                  <div className="border border-dashed border-slate-700 bg-slate-900/60 rounded-xl p-6 text-center space-y-3">
                    <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto">
                      <CameraIcon className="w-8 h-8 text-red-500" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Ambil Foto Infrastruktur Mangkrak</p>
                      <p className="text-slate-400 text-xs mt-1">Dukungan format JPG, PNG, WEBP hingga 10MB</p>
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow transition-all inline-flex items-center gap-1.5">
                      <CameraIcon className="w-3.5 h-3.5" /> Ambil / Pilih Foto
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 2: AI DETEKSI & KATEGORI (EXACT MATCH FOR SCREENSHOT 1) */}
              {/* ============================================================ */}
              {activeStep === 2 && (
                <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 text-left max-h-[560px] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <h3 className="text-white font-bold text-lg">Laporan foto</h3>
                    <button className="text-slate-400 hover:text-white p-1">
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI Badge */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    Didukung oleh AI
                  </div>

                  {/* Photo Upload Area */}
                  <div>
                    <label className="text-white font-semibold text-xs block mb-1.5">
                      Foto <span className="text-red-500">*</span>
                    </label>

                    <div className="border border-slate-800 bg-[#0d1424] rounded-xl p-5 text-center space-y-3 relative">
                      {/* Photo Thumbnail */}
                      <div className="relative w-20 h-20 mx-auto rounded-xl overflow-hidden border border-slate-700 shadow-md">
                        <img
                          src="/images/jalan-berlubang.jpg"
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <button className="absolute top-1 right-1 w-4 h-4 bg-slate-900/80 text-white rounded-full flex items-center justify-center text-[10px]">
                          ✕
                        </button>
                      </div>

                      {/* Red Button */}
                      <button className="bg-red-950/40 border border-red-500/50 hover:bg-red-900/50 text-red-400 text-xs font-semibold px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2">
                        <CameraIcon className="w-4 h-4 text-red-500" />
                        <span>Klik untuk mengunggah</span>
                      </button>

                      {/* Helper texts */}
                      <p className="text-slate-400 text-xs">
                        atau melalui seret & lepas • <span className="text-slate-300">1/3</span>
                      </p>
                      <p className="text-slate-500 text-[11px]">
                        Dilarang memotret orang/plat nomor kendaraan.
                      </p>
                      <p className="text-slate-400 text-[11px] flex items-center justify-center gap-1">
                        Analisis melalui Fixora AI (Indonesia) <span className="text-slate-500">ⓘ</span>
                      </p>
                    </div>
                  </div>

                  {/* Category Field */}
                  <div>
                    <label className="text-white font-semibold text-xs block mb-1.5">
                      kategori <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        disabled
                        className="w-full bg-[#0d1424] border border-slate-800 text-white text-xs rounded-xl px-4 py-3 appearance-none focus:outline-none"
                      >
                        <option>Jalan Rusak</option>
                      </select>
                      <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Keterangan Field */}
                  <div>
                    <label className="text-white font-semibold text-xs block mb-1">
                      Keterangan <span className="text-red-500">*</span>
                    </label>
                    <p className="text-slate-400 text-[11px] mb-2">
                      Ini dihasilkan secara otomatis dari foto. Anda dapat menyesuaikan teksnya.
                    </p>
                    <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 leading-relaxed font-normal">
                      Terdeteksi kerusakan permukaan jalan berlubang dengan kedalaman ~8cm. Potensi bahaya bagi pengguna jalan.
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 3: VERIFIKASI APBD & LOKASI */}
              {/* ============================================================ */}
              {activeStep === 3 && (
                <div className="bg-[#0b101d] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckIcon className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-bold text-base">Verifikasi APBD & Wilayah</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-mono">
                      Matched
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
                      <span className="text-slate-400 text-xs">Lokasi Terverifikasi</span>
                      <p className="text-white font-bold text-sm">Jakarta Selatan</p>
                      <p className="text-slate-400 text-xs">Kecamatan Setiabudi</p>
                    </div>
                    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-1">
                      <span className="text-slate-400 text-xs">Alokasi Anggaran</span>
                      <p className="text-emerald-400 font-bold text-sm">Rp 450 Juta</p>
                      <p className="text-slate-400 text-xs">APBD Tahun 2026</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* STEP 4: TRANSPARANSI PETA PUBLIK (EXACT MATCH FOR SCREENSHOT 2) */}
              {/* ============================================================ */}
              {activeStep === 4 && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-[420px] bg-[#090d16]">
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

                  <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-r from-red-500/50 via-amber-500/40 to-emerald-500/30 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-gradient-to-r from-red-500/60 via-amber-500/40 to-transparent rounded-full blur-xl pointer-events-none" />
                  <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-amber-500/40 rounded-full blur-xl pointer-events-none" />

                  {/* Top Bar */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value="Temukan lokasi..."
                        className="bg-slate-950/90 text-slate-400 text-xs px-3.5 py-2 pl-8 rounded-full border border-slate-700/80 shadow-lg w-44"
                      />
                      <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    </div>
                    <button className="flex items-center gap-1.5 bg-slate-950/90 text-white text-xs font-bold px-3.5 py-2 rounded-full border border-slate-700/80 shadow-lg">
                      <MapPinIcon className="w-3.5 h-3.5 text-red-500" />
                      <span>Tandai Lokasi</span>
                    </button>
                  </div>

                  {/* Map Markers & Clusters */}
                  <div className="absolute inset-0 pointer-events-none">

                    {/* Cluster Merah Kiri Atas */}
                    <div className="absolute top-14 left-20 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                        2
                      </div>
                    </div>

                    {/* Cluster Merah Tengah Atas */}
                    <div className="absolute top-10 left-1/2 -translate-x-3 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                        36
                      </div>
                    </div>

                    {/* Cluster Merah Kanan Atas */}
                    <div className="absolute top-14 right-20 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                        2
                      </div>
                    </div>

                    {/* Pin Ungu — Ikon Orang / User (seperti screenshot 1) */}
                    <div className="absolute top-24 left-1/2 -translate-x-8 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-600 border-2 border-white shadow-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                      </div>
                      <div className="w-1.5 h-3 bg-purple-600 rounded-b-full" />
                    </div>

                    {/* Pin Pink — Ikon Segitiga Peringatan */}
                    <div className="absolute top-44 right-1/3 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white shadow-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                      </div>
                      <div className="w-1.5 h-3 bg-pink-500 rounded-b-full" />
                    </div>

                    {/* Pin Hijau — Ikon Jam / Clock */}
                    <div className="absolute bottom-28 right-2/5 flex flex-col items-center" style={{ right: '38%' }}>
                      <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z" />
                        </svg>
                      </div>
                      <div className="w-1.5 h-3 bg-emerald-600 rounded-b-full" />
                    </div>

                    {/* Cluster Merah Kiri Bawah */}
                    <div className="absolute bottom-16 left-16 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                        2
                      </div>
                    </div>

                    {/* Cluster Merah Kanan Tengah */}
                    <div className="absolute top-1/2 right-16 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-lg border-2 border-white">
                        2
                      </div>
                    </div>

                  </div>

                  {/* Bottom Action */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <a
                      href="#map"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-xl transition-all"
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
