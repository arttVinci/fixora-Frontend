import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  MapPinIcon,
  SparklesIcon,
  ClockIcon,
  CheckIcon,
  ShieldCheckIcon,
  AiRobotIcon,
  CameraIcon,
  RoadIcon,
  BridgeIcon,
  TrashIcon,
  BuildingIcon,
  DrainageIcon,
  UserIcon,
} from '../components/Icons';

export default function AboutPage() {

  const problemStatements = [
    {
      number: '01',
      title: 'Ketiadaan Visibilitas Durasi Pembiaran',
      description:
        'Masyarakat mengetahui jalan berlubang atau jembatan rusak di rute harian mereka, namun tidak ada sistem publik yang mencatat dan mempublikasikan "sudah berapa lama masalah ini dibiarkan" secara transparan dan terukur.',
      impact: 'Pemerintah dan dinas terkait tidak memiliki tekanan akuntabilitas waktu terhadap perbaikan.',
    },
    {
      number: '02',
      title: 'Platform Konvensional yang Terbengkalai & Reaktif',
      description:
        'Platform pelaporan publik terdahulu seperti Qlue sudah tidak terawat (domain resminya bahkan dialihkan ke situs tidak relevan). Sementara platform resmi seperti LAPOR! masih berjalan dengan paradigma "lapor sekali, selesai" tanpa pelacakan progres publik berkelanjutan.',
      impact: 'Laporan warga hilang di birokrasi dan tidak dapat dipantau oleh komunitas sipil luas.',
    },
    {
      number: '03',
      title: 'Cold-Start Problem & Ketergantungan Pasif',
      description:
        'Platform crowdsourced murni sering gagal pada tahap awal karena peta kosong sebelum massa pengguna aktif melapor. Fixora mengatasi ini dengan Autonomous AI News Crawler yang proaktif mencari dan memetakan isu infrastruktur dari berita sejak hari pertama.',
      impact: 'Peta radar Fixora aktif terisi data valid dari hari pertama tanpa menunggu laporan warga.',
    },
    {
      number: '04',
      title: 'Ketiadaan Korelasi Data Anggaran Resmi',
      description:
        'Warga tidak mengetahui apakah suatu titik kerusakan infrastruktur sebenarnya sudah dialokasikan dalam APBD dinas atau belum. Fixora dirancang menghubungkan laporan kerusakan dengan data anggaran terbuka pemerintah (Open Government Data).',
      impact: 'Menyediakan bukti investigatif bagi publik, jurnalis data, dan aktivis keterbukaan informasi.',
    },
  ];

  const corePillars = [
    {
      icon: <ClockIcon className="w-6 h-6 text-[#81C784]" />,
      title: 'Public Neglect Timer',
      subtitle: 'Pelacakan Durasi Mangkrak Real-Time',
      description:
        'Setiap titik kerusakan memiliki penghitung hari/bulan otomatis sejak pertama kali terdeteksi atau dilaporkan, menciptakan metrik akuntabilitas objektif yang dapat dilihat siapa saja.',
      badge: 'Akuntabilitas Waktu',
    },
    {
      icon: <AiRobotIcon className="w-6 h-6 text-[#81C784]" />,
      title: 'Autonomous AI Crawler',
      subtitle: 'Akuisisi Data Berita Proaktif',
      description:
        'Cron job berkala menyisir portal berita dan media lokal di Indonesia. Multimodal LLM secara otonom mengekstraksi koordinat lokasi, kategori, dan tingkat keparahan dalam format terstruktur.',
      badge: 'Proaktif & Mandiri',
    },
    {
      icon: <CameraIcon className="w-6 h-6 text-[#81C784]" />,
      title: 'Multimodal Vision AI',
      subtitle: 'OCR Timestamp & Validasi Foto',
      description:
        'Warga cukup mengunggah foto dari aplikasi Timestamp Camera. AI otomatis membaca koordinat watermark GPS, mendeteksi objek kerusakan, dan menilai relevansi tanpa birokrasi form manual.',
      badge: 'Bebas Formulir',
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6 text-[#81C784]" />,
      title: 'Anti-Spam & Multi-Agent',
      subtitle: 'Integritas Data Terverifikasi',
      description:
        'Mekanisme perceptual image hashing, toleransi radius GPS untuk penggabungan laporan serupa (merge), serta panel verifikasi multi-agent untuk memfilter spam dan laporan palsu.',
      badge: 'Kredibilitas Data',
    },
  ];

  const personas = [
    {
      role: 'Warga Pelapor',
      icon: <UserIcon className="w-5 h-5 text-[#81C784]" />,
      headline: 'Melaporkan dalam hitungan detik tanpa registrasi berbelit',
      description:
        'Cukup potret menggunakan aplikasi Timestamp Camera dan unggah langsung. AI Fixora menangani sisanya sehingga suara warga terdengar tanpa terhalang birokrasi.',
    },
    {
      role: 'Komunitas & Pemantau',
      icon: <MapPinIcon className="w-5 h-5 text-[#81C784]" />,
      headline: 'Mengawal perbaikan fasilitas di lingkungan tempat tinggal',
      description:
        'Mengecek titik kerusakan terlama di wilayahnya, mengonfirmasi status terkini ("Masih Rusak"), dan menjadikannya materi advokasi kepada RT/RW atau dinas daerah.',
    },
    {
      role: 'Jurnalis & Peneliti',
      icon: <SparklesIcon className="w-5 h-5 text-[#81C784]" />,
      headline: 'Akses data investigatif terbuka siap olah',
      description:
        'Mengekspor data spasial titik mangkrak dan menghubungkannya dengan pagu anggaran APBD dinas untuk bahan liputan investigasi berbasis fakta.',
    },
    {
      role: 'Pemerintah Daerah',
      icon: <ShieldCheckIcon className="w-5 h-5 text-[#81C784]" />,
      headline: 'Early warning signal titik prioritas lapangan',
      description:
        'Mendapatkan sinyal awal kerusakan fasilitas publik yang diverifikasi masyarakat sebelum berdampak fatal atau memicu kecelakaan lalu lintas.',
    },
  ];

  const categories = [
    { name: 'Jalan Rusak', icon: <RoadIcon className="w-4 h-4" /> },
    { name: 'Jembatan Kritis', icon: <BridgeIcon className="w-4 h-4" /> },
    { name: 'Sampah Liar', icon: <TrashIcon className="w-4 h-4" /> },
    { name: 'Fasilitas Terbengkalai', icon: <BuildingIcon className="w-4 h-4" /> },
    { name: 'Drainase Tersumbat', icon: <DrainageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] pt-24 pb-0 flex flex-col justify-between selection:bg-[#2E7D32] selection:text-[#F2F2F0] font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-20 w-full">
        
        {/* ── 1. HERO SECTION ── */}
        <div className="relative border-b border-[#2A2E2C] pb-12 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161918] border border-[#2E7D32]/40 text-[#81C784] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#81C784] animate-pulse" />
            <span className="font-mono tracking-wider uppercase">Open Source Software • Inisiatif Transparansi Publik</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F2F2F0] tracking-tight leading-[1.15]">
            Akuntabilitas Jangka Panjang untuk{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81C784] via-[#66BB6A] to-[#A5D6A7]">
              Infrastruktur Publik
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#9BA39E] max-w-3xl leading-relaxed">
            Fixora adalah platform crowdsourced & AI-driven independen yang memetakan kerusakan fasilitas umum di Indonesia — bukan sekadar tempat menampung keluhan, melainkan sistem pelacakan terbuka yang menghitung durasi mangkrak dan memverifikasi integritas data secara berkelanjutan.
          </p>

          {/* Quick Categories Pill Bar */}
          <div className="pt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#9BA39E] font-mono mr-1">Kategori Dipantau:</span>
            {categories.map((c) => (
              <span
                key={c.name}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#161918] border border-[#2A2E2C] text-xs text-[#F2F2F0]"
              >
                <span className="text-[#81C784]">{c.icon}</span>
                <span>{c.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── 2. PENGEMBANG PLATFORM (NARASI) ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#161918] via-[#121514] to-[#0D0F0E] border border-[#2A2E2C] space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-[#81C784]" />
            <span className="text-xs font-mono uppercase tracking-wider text-[#81C784] font-semibold">
              PENGEMBANG PLATFORM
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F2F0] tracking-tight relative z-10">
            Tentang Pengembang
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#9BA39E] leading-relaxed relative z-10 max-w-4xl">
            <p>
              Platform ini dirancang dan dibangun oleh <strong className="text-[#F2F2F0]">Putra Rizky Nugraha</strong> dan <strong className="text-[#F2F2F0]">Muhammad Fadhil Sevano</strong>, dua Full-stack Developers dengan fokus pada aplikasi web berkinerja tinggi, rekayasa kecerdasan buatan, serta arsitektur sistem yang bersih dan skalabel.
            </p>
            <p>
              Mereka membangun platform ini dengan satu tujuan: menghadirkan solusi pelacakan akuntabilitas infrastruktur publik yang terbuka, cerdas, terukur, dan transparan bagi seluruh masyarakat Indonesia.
            </p>
          </div>
        </div>


        {/* ── 3. LATAR BELAKANG & PROBLEM STATEMENT (REPLACED TABLE) ── */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#81C784] font-semibold">
              PROBLEM STATEMENT
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F2F0] tracking-tight">
              Mengapa Fixora Dibutuhkan?
            </h2>
            <p className="text-sm text-[#9BA39E]">
              Persoalan sistemik infrastruktur mangkrak di kota-kota besar Indonesia yang mendasari lahirnya platform ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {problemStatements.map((item) => (
              <div
                key={item.number}
                className="p-6 rounded-3xl bg-[#121514] border border-[#2A2E2C] hover:border-[#2E7D32]/40 transition-all space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-[#2E7D32]/60">
                    {item.number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161918] text-[#81C784] border border-[#2A2E2C]">
                    Tantangan Utama
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F2F2F0] tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9BA39E] leading-relaxed">
                  {item.description}
                </p>
                <div className="p-3 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] text-xs text-[#81C784] flex items-start gap-2 mt-2">
                  <span className="font-bold flex-shrink-0">Dampak:</span>
                  <span className="text-[#9BA39E]">{item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. VISI & MISI ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#161918] to-[#121514] border border-[#2A2E2C] space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/20 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#81C784] font-semibold">
                ARAH JANGKA PANJANG
              </span>
              <h3 className="text-2xl font-extrabold text-[#F2F2F0]">Visi Kami</h3>
            </div>
            <p className="text-sm text-[#9BA39E] leading-relaxed">
              Menjadi penyedia <strong className="text-[#F2F2F0]">open data infrastruktur Indonesia</strong> yang terstruktur rapi berdasarkan wilayah — mencakup jenis infrastruktur, kondisi fisik, durasi pembiaran, hingga alokasi anggaran resminya — sehingga dapat dimanfaatkan secara bebas oleh publik, media massa, peneliti, maupun instansi pemerintah.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#161918] to-[#121514] border border-[#2A2E2C] space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/20 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#81C784] font-semibold">
                LANGKAH STRATEGIS
              </span>
              <h3 className="text-2xl font-extrabold text-[#F2F2F0]">Misi Kami</h3>
            </div>
            <p className="text-sm text-[#9BA39E] leading-relaxed">
              Menciptakan ekosistem transparansi infrastruktur di Indonesia dengan informasi yang kredibel dan terverifikasi secara multi-layer, memanfaatkan <strong className="text-[#F2F2F0]">Multimodal Vision AI</strong> dan <strong className="text-[#F2F2F0]">RAG (Retrieval-Augmented Generation)</strong> untuk menghubungkan laporan langsung masyarakat dengan data anggaran resmi pemerintah dan bukti lokasi aktual di lapangan.
            </p>
          </div>
        </div>

        {/* ── 5. CORE PILLARS & VALUE PROPOSITION (CARDS) ── */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#81C784] font-semibold">
              ARSITEKTUR & PENDEKATAN
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F2F0] tracking-tight">
              4 Pilar Solusi Fixora
            </h2>
            <p className="text-sm text-[#9BA39E]">
              Kombinasi teknologi modern untuk memutus rantai birokrasi dan menjaga transparansi berkelanjutan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {corePillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#2E7D32]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-[#0D0F0E] border border-[#2A2E2C]">
                      {pillar.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1B5E20]/30 text-[#81C784] border border-[#2E7D32]/40">
                      {pillar.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F2F2F0]">{pillar.title}</h3>
                    <div className="text-xs text-[#81C784] font-mono mt-0.5">{pillar.subtitle}</div>
                  </div>
                  <p className="text-xs text-[#9BA39E] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. TARGET USERS & VALUE ── */}
        <div className="space-y-6">
          <div className="border-l-2 border-[#81C784] pl-4 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#81C784] font-semibold">
              EKOSISTEM PENGGUNA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F2F0] tracking-tight">
              Memberi Nilai Nyata untuk Seluruh Pihak
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {personas.map((p) => (
              <div
                key={p.role}
                className="p-6 rounded-2xl bg-[#121514] border border-[#2A2E2C] space-y-2 flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-[#161918] border border-[#2A2E2C] text-[#81C784] flex-shrink-0 mt-0.5">
                  {p.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#F2F2F0]">{p.role}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#81C784]">{p.headline}</div>
                  <p className="text-xs text-[#9BA39E] leading-relaxed pt-1">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. TECH STACK SPECIFICATION ── */}
        <div className="space-y-4">
          <div className="border-l-2 border-[#81C784] pl-4 space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-[#81C784] font-semibold">
              SPESIFIKASI TEKNIS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F2F0] tracking-tight">
              Tumpukan Teknologi (Tech Stack)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-2">
              <div className="text-[10px] font-mono uppercase text-[#81C784]">BACKEND ARCHITECTURE</div>
              <div className="text-base font-bold text-[#F2F2F0]">Go (Golang) + Fiber</div>
              <p className="text-xs text-[#9BA39E]">Clean Architecture, Modular Monolith, GORM, Logrus, Viper, high throughput low-latency REST API.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-2">
              <div className="text-[10px] font-mono uppercase text-amber-400">DATABASE & STORAGE</div>
              <div className="text-base font-bold text-[#F2F2F0]">MySQL</div>
              <p className="text-xs text-[#9BA39E]">Relational data mapping via GORM, spatial coordinate indexing, transaction safety, and high-concurrency read/write.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-2">
              <div className="text-[10px] font-mono uppercase text-blue-400">FRONTEND SPA</div>
              <div className="text-base font-bold text-[#F2F2F0]">React 19 + TypeScript</div>
              <p className="text-xs text-[#9BA39E]">Tailwind CSS, Leaflet.js / OpenStreetMap GIS Engine, Marker Clustering, Framer Motion animations.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-2">
              <div className="text-[10px] font-mono uppercase text-rose-400">AI & AGENTIC VISION</div>
              <div className="text-base font-bold text-[#F2F2F0]">Multimodal Vision LLM</div>
              <p className="text-xs text-[#9BA39E]">OCR GPS watermark parsing, autonomous news scraper, perceptual hashing duplicate detection & multi-agent verification.</p>
            </div>
          </div>
        </div>

        {/* ── 8. REPOSITORY & CODE SOURCE ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#161918] via-[#141816] to-[#0F1411] border border-[#2E7D32]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161918] border border-[#2E7D32]/40 text-[#81C784] text-xs font-semibold">
              <CheckIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Proyek Open Source</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F2F2F0] tracking-tight">
              Repositori & Kode Sumber
            </h3>
            <p className="text-sm text-[#9BA39E] max-w-xl leading-relaxed">
              Kode sumber frontend dan backend Fixora terbuka untuk umum di GitHub. Kunjungi repositori untuk melihat arsitektur sistem, berdiskusi, atau mengirimkan saran perbaikan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="https://github.com/arttVinci/fixora-Frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap shrink-0 border border-[#81C784]/30"
            >
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="whitespace-nowrap">Lihat di GitHub</span>
            </a>
            <Link
              to="/peta"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-[#F2F2F0] text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <MapPinIcon className="w-4 h-4 shrink-0 text-[#81C784]" />
              <span className="whitespace-nowrap">Buka Peta Radar</span>
            </Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
