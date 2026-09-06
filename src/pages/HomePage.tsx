import { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/landing/HeroSection";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import ReportingTutorialSection from "../components/landing/ReportingTutorialSection";
import Footer from "../components/Footer";
import type { IssueReport } from "../types";
import {
  MapPinIcon,
  SparklesIcon,
  CheckIcon,
  MapIcon,
  ReportIcon,
  CameraIcon,
  UserIcon,
  BuildingIcon,
  AiRobotIcon,
  GithubIcon,
  ShieldCheckIcon,
  DocsIcon,
} from "../components/Icons";

interface HomePageProps {
  issues: IssueReport[];
  onLaporMasalah?: () => void;
  onReportSubmitted?: (report: IssueReport) => void;
}

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Apa perbedaan Fixora dengan platform pelaporan seperti LAPOR! atau Qlue?",
    a: 'Platform konvensional umumnya pasif (hanya menunggu warga melapor) dan modelnya "lapor sekali, selesai". Fixora melacak durasi masalah dibiarkan secara publik (hari/bulan), secara aktif mencari berita kerusakan lewat AI crawler otonom, dan mengkorelasikan titik kerusakan dengan data alokasi APBD pemerintah.',
  },
  {
    q: "Bagaimana cara AI Vision mengklasifikasi foto kerusakan?",
    a: "Saat Anda mengunggah foto, model Multimodal Vision Fixora mendeteksi jenis kerusakan (jalan berlubang, jembatan retak, sampah menumpuk, drainase tersumbat) dan memberikan estimasi tingkat keparahan (rendah, sedang, tinggi, kritis) secara instan.",
  },
  {
    q: "Apakah saya bisa melapor secara anonim tanpa login/email?",
    a: "Ya! Fixora mengutamakan kemudahan pelaporan. Anda dapat langsung mengunggah foto, mengonfirmasi lokasi otomatis via GPS, dan mengirim laporan tanpa wajib mendaftar akun atau memasukkan email.",
  },
  {
    q: 'Apa fungsi fitur "Konfirmasi Masih Begini (+1)"?',
    a: "Fitur ini memungkinkan warga sekitar untuk mengonfirmasi bahwa suatu titik masalah masih belum diperbaiki. Semakin banyak konfirmasi warga, semakin tinggi skor urgensi dan akuntabilitas titik tersebut di peta publik.",
  },
  {
    q: "Apakah data Fixora dapat diakses bebas oleh jurnalis dan publik?",
    a: "Ya. Seluruh data titik infrastruktur dan korelasi anggaran dapat diunduh bebas dalam format CSV dan JSON melalui halaman Transparansi untuk kebutuhan riset, liputan investigasi, maupun advokasi kebijakan publik.",
  },
];

import { isUnresolvedStatus } from "../utils/reportStats";

export default function HomePage({
  issues,
  onLaporMasalah,
  onReportSubmitted,
}: HomePageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const totalActive = issues.filter((i) => isUnresolvedStatus(i.status)).length;
  const totalResolved = issues.filter((i) => {
    const s = i.status?.toLowerCase().trim();
    return s === "resolved" || s === "closed" || s === "selesai";
  }).length;

  return (
    <div className="w-full bg-[#0D0F0E] text-[#F2F2F0] selection:bg-[#2E7D32] selection:text-[#F2F2F0]">
      {/* 1. HERO SECTION (Rule #1: Untouched, pristine Industrial Green design) */}
      <HeroSection
        totalReports={issues.length}
        onLaporMasalah={onLaporMasalah}
        onReportSubmitted={onReportSubmitted}
      />

      {/* 2. VALUE PROPOSITION & 4 PILLARS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#2A2E2C] bg-[#0D0F0E]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] text-xs font-mono">
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>SISTEM AKUNTABILITAS INFRASTRUKTUR PUBLIK</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#F2F2F0] tracking-tight">
              Bukan Sekadar Lapor, Tapi Melacak Hingga Selesai
            </h2>
            <p className="text-sm sm:text-base text-[#9BA39E] leading-relaxed">
              Fixora menggabungkan AI otonom, pelacakan durasi mangkrak, dan
              korelasi anggaran APBD resmi untuk memastikan masalah
              infrastruktur tidak terlupakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/60 transition-all duration-300 space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#1B5E20]/30 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                <SparklesIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F0]">
                AI News Crawler Otonom
              </h3>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Mencari dan mengekstrak data kerusakan dari portal berita
                nasional secara berkala tanpa menunggu laporan warga masuk.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/60 transition-all duration-300 space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#1B5E20]/30 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                <MapPinIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F0]">
                Timer Durasi Mangkrak
              </h3>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Menghitung dan mendokumentasikan sudah berapa hari atau bulan
                fasilitas publik dibiarkan tanpa perbaikan nyata.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/60 transition-all duration-300 space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#1B5E20]/30 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                <CheckIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F0]">
                Korelasi Anggaran APBD
              </h3>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Mencocokkan titik kerusakan dengan data anggaran perbaikan
                pemerintah terbuka (SatuData) sebagai bukti akuntabilitas.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/60 transition-all duration-300 space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#1B5E20]/30 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                <ReportIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#F2F2F0]">
                Verifikasi Gotong Royong
              </h3>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Fitur "Masih Begini" memungkinkan komunitas mengonfirmasi
                kondisi lapangan untuk menjaga akurasi data tetap tinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID SHOWCASE: EKOSISTEM FIXORA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121514] border-t border-[#2A2E2C]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#81C784] font-semibold uppercase tracking-wider">
                FITUR & KAPABILITAS TEKNIS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#F2F2F0] mt-1">
                Eksplorasi Ekosistem Fixora
              </h2>
            </div>
            <Link
              to="/peta"
              className="py-2.5 px-5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 self-start md:self-auto cursor-pointer"
            >
              <MapIcon className="w-4 h-4" />
              <span>Buka Peta Fullscreen ({issues.length} Titik) →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Fullscreen GIS Map Portal (Spans 2 cols) */}
            <Link
              to="/peta"
              className="md:col-span-2 p-8 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/60 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer group shadow-xl relative overflow-hidden"
            >
              <div className="space-y-2 z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#1B5E20]/30 text-[#81C784] border border-[#2E7D32]/40 text-xs font-mono font-bold">
                    PORTAL PETA GEOSPASIAL
                  </span>
                  <span className="text-xs text-[#9BA39E] font-mono">
                    100% Layar Penuh
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                  Peta Infrastruktur Jawa Barat
                </h3>
                <p className="text-xs sm:text-sm text-[#9BA39E] max-w-xl leading-relaxed">
                  Dilengkapi Marker Clustering, heat density layer, filter
                  durasi mangkrak, serta pencarian alamat instan tanpa lag
                  scroll.
                </p>
              </div>

              {/* Visual preview telemetry */}
              <div className="grid grid-cols-3 gap-3 z-10 pt-4 border-t border-[#2A2E2C]">
                <div className="p-3 rounded-2xl bg-[#0D0F0E]/80 border border-[#2A2E2C]">
                  <div className="text-[11px] text-[#9BA39E]">
                    Laporan Aktif
                  </div>
                  <div className="text-lg sm:text-xl font-bold font-heading text-amber-300">
                    {totalActive} Titik
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0D0F0E]/80 border border-[#2A2E2C]">
                  <div className="text-[11px] text-[#9BA39E]">
                    Terselesaikan
                  </div>
                  <div className="text-lg sm:text-xl font-bold font-heading text-[#81C784]">
                    {totalResolved} Titik
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#0D0F0E]/80 border border-[#2A2E2C]">
                  <div className="text-[11px] text-[#9BA39E]">Akses Peta</div>
                  <div className="text-xs sm:text-sm font-bold text-[#81C784] flex items-center gap-1 mt-1">
                    Buka Dashboard →
                  </div>
                </div>
              </div>
            </Link>

            {/* Bento Card 2: AI Vision Computer Classifier */}
            <div className="p-8 rounded-3xl bg-[#161918] border border-[#2A2E2C] flex flex-col justify-between gap-6 shadow-xl">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1B5E20]/30 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                  <CameraIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-heading text-[#F2F2F0]">
                  AI Vision Computer Classifier
                </h3>
                <p className="text-xs text-[#9BA39E] leading-relaxed">
                  Unggah foto dari HP Anda, AI secara otomatis mendeteksi
                  kategori kerusakan dan tingkat keparahannya dalam hitungan
                  detik.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0D0F0E] border border-[#2E7D32]/30 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#9BA39E]">Estimasi Akurasi</span>
                  <span className="text-[#81C784] font-mono font-bold">
                    91% Akurat
                  </span>
                </div>
                <div className="w-full bg-[#161918] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2E7D32] h-full rounded-full w-[91%]" />
                </div>
              </div>
            </div>

            {/* Bento Card 3: APBD Budget Tracker */}
            <Link
              to="/transparansi"
              className="p-8 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/60 transition-all duration-300 flex flex-col justify-between gap-6 cursor-pointer group shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1B5E20]/30 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                  <CheckIcon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold font-heading text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                  Korelasi Anggaran APBD
                </h3>
                <p className="text-xs text-[#9BA39E] leading-relaxed">
                  Cross-reference data proyek rehabilitasi dinas PU dari
                  portal keterbukaan data daerah untuk pemantauan berbasis anggaran.
                </p>
              </div>

              <span className="text-xs text-[#81C784] font-semibold flex items-center gap-1">
                Buka Data Anggaran →
              </span>
            </Link>

            {/* Bento Card 4: Open Data for Journalists (Spans 2 cols) */}
            <Link
              to="/transparansi"
              className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-[#161918] to-[#121514] border border-[#2E7D32]/40 hover:border-[#2E7D32] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 cursor-pointer shadow-xl"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#81C784] font-bold uppercase">
                  OPEN DATA FOR JOURNALISTS & RESEARCHERS
                </span>
                <h3 className="text-xl font-bold font-heading text-[#F2F2F0]">
                  Ekspor Dataset Bebas Lisensi (CSV & JSON)
                </h3>
                <p className="text-xs sm:text-sm text-[#9BA39E] max-w-lg leading-relaxed">
                  Gunakan dataset terstruktur Fixora untuk liputan investigasi
                  jurnalisme data, riset tata kota, atau advokasi kebijakan
                  publik.
                </p>
              </div>

              <span className="py-3 px-5 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] text-xs font-bold whitespace-nowrap shadow-lg flex-shrink-0">
                Unduh Data Terbuka →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. AUTONOMOUS ARCHITECTURE & NODE PIPELINE SHOWCASE */}
      <ArchitectureSection />

      {/* ── DATA INTEGRITY & OFFICIAL SOURCES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1211] border-t border-[#2A2E2C]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] text-xs font-mono">
              <CheckIcon className="w-3.5 h-3.5" />
              <span>AKURASI & REKAM JEJAK SUMBER DATA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#F2F2F0]">
              Data Valid dari Sumber Resmi & Terverifikasi
            </h2>
            <p className="text-sm sm:text-base text-[#9BA39E] leading-relaxed">
              <strong className="text-[#F2F2F0]">Perlu Digarisbawahi:</strong> Fixora tidak pernah mengambil data secara asal. Seluruh titik informasi melewati kurasi ketat dan bersumber dari 3 kanal resmi terpercaya:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Warga */}
            <div className="p-7 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#1B5E20]/30 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F2F2F0]">1. Laporan Partisipasi Warga</h3>
                <span className="text-[11px] font-mono text-[#81C784]">GPS Aktual & Bukti Foto</span>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Setiap laporan masyarakat menyertakan koordinat titik presisi dan foto kondisi riil di lapangan, kemudian divalidasi oleh sistem dan komunitas.
              </p>
            </div>

            {/* Card 2: Pemerintah */}
            <div className="p-7 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-blue-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <BuildingIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F2F2F0]">2. Portal Resmi Pemerintah</h3>
                <span className="text-[11px] font-mono text-blue-300">Open Data & Keterbukaan Publik</span>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Mengacu langsung pada publikasi data terbuka pemerintah (SatuData, LPSE pengadaan, dokumen dinas) guna memastikan validitas informasi proyek pembangunan.
              </p>
            </div>

            {/* Card 3: AI Media */}
            <div className="p-7 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-emerald-500/50 transition-all space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <AiRobotIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F2F2F0]">3. Media Pers Terdaftar (AI)</h3>
                <span className="text-[11px] font-mono text-emerald-300">Filtered National News</span>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                AI News Crawler Fixora secara ketat hanya menyaring artikel dari media pers nasional resmi terverifikasi (Kompas.com, Detik.com, Antara, dll.) dengan tautan berita asli.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PANDUAN & CARA MELAPOR DENGAN TIMESTAMP CAMERA & AI */}
      <ReportingTutorialSection onLaporMasalah={onLaporMasalah} />

      {/* ── OPEN SOURCE & PROJECT RESOURCES ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0D0F0E] border-t border-[#2A2E2C]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#81C784]" />
              <span className="text-xs font-mono text-[#81C784] font-semibold uppercase tracking-wider">
                SUMBER DAYA PROYEK
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#F2F2F0]">
              Infrastruktur Terbuka & Transparan
            </h2>
            <p className="text-sm sm:text-base text-[#9BA39E] max-w-2xl leading-relaxed">
              Akses repositori kode, telusuri keterbukaan data publik, dan pelajari arsitektur sistem Fixora secara terbuka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Open API & Data Publik */}
            <Link
              to="/transparansi"
              className="p-8 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 transition-all flex flex-col items-center justify-center gap-4 text-center group shadow-xl cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#1B5E20]/20 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] group-hover:scale-110 transition-transform">
                <ShieldCheckIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                  Open API & Data
                </h3>
                <p className="text-xs text-[#9BA39E] mt-1 font-mono">
                  JSON & CSV Dataset Publik
                </p>
              </div>
            </Link>

            {/* Card 2: GitHub Open Source */}
            <a
              href="https://github.com/arttVinci/fixora-Frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-[#F2F2F0]/60 transition-all flex flex-col items-center justify-center gap-4 text-center group shadow-xl cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#2A2E2C]/50 border border-[#2A2E2C] flex items-center justify-center text-[#F2F2F0] group-hover:scale-110 transition-transform">
                <GithubIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                  GitHub Repository
                </h3>
                <p className="text-xs text-[#9BA39E] mt-1 font-mono">
                  Open Source (MIT License)
                </p>
              </div>
            </a>

            {/* Card 3: Docs */}
            <Link
              to="/tentang"
              className="p-8 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-[#38bdf8]/60 transition-all flex flex-col items-center justify-center gap-4 text-center group shadow-xl cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] group-hover:scale-110 transition-transform">
                <DocsIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F2F2F0] group-hover:text-[#38bdf8] transition-colors">
                  Dokumentasi Sistem
                </h3>
                <p className="text-xs text-[#9BA39E] mt-1 font-mono">
                  Arsitektur & Panduan OSS
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ (TANYA JAWAB UMUM) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#121514] border-t border-[#2A2E2C]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#81C784] font-semibold uppercase tracking-wider">
              PERTANYAAN UMUM
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#F2F2F0]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#9BA39E]">
              Segala hal yang perlu Anda ketahui mengenai penggunaan dan
              transparansi data Fixora.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#161918] border border-[#2A2E2C] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1A1F1D] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#F2F2F0]">
                      {faq.q}
                    </span>
                    <span
                      className={`w-6 h-6 rounded-full bg-[#0D0F0E] border border-[#2A2E2C] flex items-center justify-center flex-shrink-0 text-[#81C784] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-[#9BA39E] leading-relaxed border-t border-[#2A2E2C]/50 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION (CTA) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#121514] to-[#0D0F0E] border-t border-[#2A2E2C]">
        <div className="max-w-5xl mx-auto p-8 sm:p-12 rounded-3xl bg-[#161918] border border-[#2E7D32]/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono text-[#81C784] font-semibold uppercase tracking-wider">
              MARI BERGABUNG BERSAMA WARGA
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-[#F2F2F0]">
              Wujudkan Transparansi Infrastruktur Indonesia
            </h2>
            <p className="text-xs sm:text-sm text-[#9BA39E] leading-relaxed">
              Mulai laporkan kerusakan fasilitas publik di sekitar Anda atau
              jelajahi peta interaktif untuk mengawal akuntabilitas anggaran
              daerah.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/lapor"
              className="btn-primary py-3 px-6 text-sm font-bold shadow-lg cursor-pointer inline-flex items-center gap-2"
            >
              <CameraIcon className="w-4 h-4" />
              <span>+ Buat Laporan Sekarang</span>
            </Link>
            <Link
              to="/peta"
              className="py-3 px-6 rounded-2xl bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-sm font-bold text-[#F2F2F0] transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <MapPinIcon className="w-4 h-4 text-[#81C784]" />
              <span>Jelajahi Peta Radar</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <Footer />
    </div>
  );
}
