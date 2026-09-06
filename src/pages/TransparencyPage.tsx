import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import type { IssueReport } from '../types';
import { getDurationDays } from '../utils/dateUtils';
import { getStatusBadge } from '../utils/statusUtils';
import { triggerCrawler } from '../services/reportApiService';
import {
  MapPinIcon,
  CheckIcon,
  SearchIcon,
  RoadIcon,
  BridgeIcon,
  TrashIcon,
  BuildingIcon,
  DrainageIcon,
  AiRobotIcon,
  UserIcon,
  CloseIcon,
  SparklesIcon,
  InfoIcon,
} from '../components/Icons';

const getCategoryIcon = (category: string, cls = 'w-3.5 h-3.5') => {
  switch (category) {
    case 'jalan':
      return <RoadIcon className={cls} />;
    case 'jembatan':
      return <BridgeIcon className={cls} />;
    case 'sampah':
      return <TrashIcon className={cls} />;
    case 'bangunan':
      return <BuildingIcon className={cls} />;
    case 'drainase':
      return <DrainageIcon className={cls} />;
    default:
      return null;
  }
};

interface TransparencyPageProps {
  issues: IssueReport[];
  onSelectIssueOnMap?: (issue: IssueReport) => void;
}

export default function TransparencyPage({
  issues,
}: TransparencyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'apbd' | 'crawler'>('leaderboard');
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [showRagModal, setShowRagModal] = useState(false);
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlToast, setCrawlToast] = useState<string | null>(null);

  const handleTriggerCrawler = async () => {
    setIsCrawling(true);
    setCrawlToast(null);
    try {
      await triggerCrawler();
      setCrawlToast('Crawler berhasil di-trigger, berjalan di background.');
    } catch (err) {
      setCrawlToast(
        err instanceof Error ? err.message : 'Gagal memicu crawler',
      );
    } finally {
      setIsCrawling(false);
      setTimeout(() => setCrawlToast(null), 4000);
    }
  };


  // Sort issues by duration neglected (longest first)
  const rankedIssues = useMemo(() => {
    return [...issues]
      .map((item) => ({
        ...item,
        durationDays: getDurationDays(item.reportedAt),
      }))
      .sort((a, b) => b.durationDays - a.durationDays);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    if (!searchQuery.trim()) return rankedIssues;
    const q = searchQuery.toLowerCase();
    return rankedIssues.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.location && i.location.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q)
    );
  }, [rankedIssues, searchQuery]);

  // AI News crawler statistics
  const aiStats = useMemo(() => {
    const totalAi = issues.filter((i) => i.source === 'ai_media').length;
    const totalCitizen = issues.filter((i) => i.source === 'citizen').length;
    const total = issues.length;
    const aiRatio = total > 0 ? Math.round((totalAi / total) * 100) : 0;
    return { totalAi, totalCitizen, total, aiRatio };
  }, [issues]);

  // Export dataset handler (for journalists/researchers)
  const handleExport = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(rankedIssues, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fixora-open-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
    } else {
      const headers = ['ID', 'Judul', 'Kategori', 'Status', 'Sumber', 'Durasi_Hari', 'Latitude', 'Longitude', 'Konfirmasi_Warga'];
      const rows = rankedIssues.map((i) => [
        i.id,
        `"${i.title.replace(/"/g, '""')}"`,
        i.category,
        i.status,
        i.source,
        i.durationDays,
        i.latitude,
        i.longitude,
        i.confirmationCount || 0,
      ]);
      const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fixora-open-data-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    }

    setExportToast(`Dataset ${format.toUpperCase()} berhasil diunduh.`);
    setTimeout(() => setExportToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full pt-28 pb-24 px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2A2E2C] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-[#2E7D32]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81C784] font-mono">
                DATA & KETERBUKAAN INFORMASI PUBLIK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F2F2F0]">
              Data & Transparansi Infrastruktur
            </h1>
            <p className="text-sm text-[#9BA39E] max-w-2xl mt-1.5 leading-relaxed">
              Pantau rekapitulasi data fasilitas publik, publikasi alokasi pembangunan daerah, dan informasi berita terkini secara terpadu.
            </p>
          </div>

          {/* Export Dataset Button for Data Journalists */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="py-2.5 px-4 rounded-xl bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-xs font-bold text-[#F2F2F0] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <span>Download CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="py-2.5 px-4 rounded-xl bg-[#2E7D32]/25 hover:bg-[#2E7D32]/45 border border-[#2E7D32]/50 text-xs font-bold text-[#81C784] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <span>Export JSON (API)</span>
            </button>
          </div>
        </div>

        {/* Export Toast notification */}
        {exportToast && (
          <div className="p-3 bg-[#1B5E20]/30 border border-[#2E7D32]/50 text-[#81C784] text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
            <CheckIcon className="w-4 h-4" />
            <span>{exportToast}</span>
          </div>
        )}

        {/* Telemetry Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] shadow-lg">
            <div className="text-xs text-[#9BA39E] font-medium mb-1">Total Fasilitas Terdata</div>
            <div className="text-2xl font-bold font-heading text-[#81C784]">{issues.length} Lokasi</div>
            <div className="text-[11px] text-[#9BA39E] mt-1 font-mono">Wilayah Jawa Barat</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] shadow-lg">
            <div className="text-xs text-[#9BA39E] font-medium mb-1">Pemantauan Terlama</div>
            <div className="text-2xl font-bold font-heading text-amber-400">
              {rankedIssues[0]?.durationDays || 0} Hari
            </div>
            <div className="text-[11px] text-[#9BA39E] mt-1 font-mono">
              Infrastruktur Publik
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] shadow-lg">
            <div className="text-xs text-[#9BA39E] font-medium mb-1">Kontribusi AI Crawler</div>
            <div className="text-2xl font-bold font-heading text-blue-400">{aiStats.aiRatio}%</div>
            <div className="text-[11px] text-[#9BA39E] mt-1 font-mono">
              {aiStats.totalAi} Berita Media Terdeteksi
            </div>
          </div>
          <div
            onClick={() => setShowRagModal(true)}
            className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-amber-400/50 shadow-lg cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-[#9BA39E] font-medium mb-1">Alokasi Anggaran Terdata</div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono">
                RAG DEV
              </span>
            </div>
            <div className="text-2xl font-bold font-heading text-amber-300">Rp 0</div>
            <div className="text-[11px] text-[#9BA39E] mt-1 font-mono flex items-center gap-1.5 group-hover:text-amber-300 transition-colors">
              <span>Fitur RAG Dalam Pengembangan</span>
              <InfoIcon className="w-3 h-3 text-amber-300" />
            </div>
          </div>
        </div>

        {/* ── Data Provenance & Integrity Notice Banner ── */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#161918] border border-[#2E7D32]/40 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2A2E2C]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1B5E20]/30 border border-[#2E7D32]/50 text-[#81C784] flex items-center justify-center flex-shrink-0">
                <CheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold font-heading text-[#F2F2F0]">
                  Integritas & Akuntabilitas Sumber Data Fixora
                </h2>
                <p className="text-xs text-[#81C784] font-medium">
                  Perlu Digarisbawahi: Seluruh data dihimpun secara terverifikasi dari sumber resmi dan terbuka
                </p>
              </div>
            </div>
            <span className="text-[11px] px-3 py-1 rounded-full bg-[#0D0F0E] text-[#9BA39E] border border-[#2A2E2C] self-start sm:self-auto font-mono">
              3 Saluran Resmi
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#9BA39E] leading-relaxed">
            Fixora <strong className="text-[#F2F2F0]">tidak pernah mengumpulkan atau menampilkan data secara asal</strong>. Setiap laporan yang tertera pada sistem memiliki rekam jejak sumber yang jelas, dapat ditelusuri keasliannya, dan mengacu pada 3 kanal resmi berikut:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Source 1: Laporan Warga */}
            <div className="p-4 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F2F2F0]">
                <div className="w-7 h-7 rounded-lg bg-[#1B5E20]/30 text-[#81C784] flex items-center justify-center flex-shrink-0">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>1. Laporan Partisipasi Warga</span>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Diambil langsung dari masyarakat dengan bukti koordinat GPS aktual dan foto dokumentasi lapangan, lalu diverifikasi sebelum ditayangkan.
              </p>
            </div>

            {/* Source 2: Data Pemerintah */}
            <div className="p-4 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F2F2F0]">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <BuildingIcon className="w-4 h-4" />
                </div>
                <span>2. Portal Resmi Pemerintah</span>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Bersumber dari basis data keterbukaan informasi publik, SatuData, LPSE pengadaan, dan publikasi dinas terkait untuk memastikan akurasi data.
              </p>
            </div>

            {/* Source 3: AI Media Crawler */}
            <div className="p-4 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F2F2F0]">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <AiRobotIcon className="w-4 h-4" />
                </div>
                <span>3. Media Pers Terdaftar (AI)</span>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                AI Crawler Fixora memfilter secara ketat dan <strong className="text-[#F2F2F0]">hanya mengindeks portal berita nasional resmi</strong> (seperti Kompas.com, Detik.com, Antara News, Kumparan, dll.) lengkap dengan tautan artikel asli sebagai bukti otentik.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#2A2E2C] pb-2">
          <button
            onClick={() => setSelectedTab('leaderboard')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedTab === 'leaderboard'
                ? 'bg-[#2E7D32]/30 text-[#81C784] border border-[#2E7D32]/50'
                : 'text-[#9BA39E] hover:text-[#F2F2F0]'
            }`}
          >
            Daftar Pemantauan Fasilitas
          </button>
          <button
            onClick={() => {
              setSelectedTab('apbd');
              setShowRagModal(true);
            }}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'apbd'
                ? 'bg-[#2E7D32]/30 text-[#81C784] border border-[#2E7D32]/50'
                : 'text-[#9BA39E] hover:text-[#F2F2F0]'
            }`}
          >
            <span>Data Pembangunan Daerah</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono font-normal">
              RAG DEV
            </span>
          </button>
          <button
            onClick={() => setSelectedTab('crawler')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedTab === 'crawler'
                ? 'bg-[#2E7D32]/30 text-[#81C784] border border-[#2E7D32]/50'
                : 'text-[#9BA39E] hover:text-[#F2F2F0]'
            }`}
          >
            Publikasi Berita Terkini
          </button>
        </div>

        {/* TAB 1: LEADERBOARD MANGKRAK */}
        {selectedTab === 'leaderboard' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Search filter */}
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lokasi, nama jalan, atau kategori..."
                className="w-full bg-[#161918] border border-[#2A2E2C] text-[#F2F2F0] text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-4 outline-none focus:border-[#2E7D32]"
              />
              <SearchIcon className="w-4 h-4 text-[#9BA39E] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Table / List */}
            <div className="overflow-hidden rounded-2xl border border-[#2A2E2C] bg-[#161918] shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#2A2E2C] bg-[#0D0F0E]/70 text-[#9BA39E] font-mono text-[11px] uppercase">
                      <th className="py-3.5 px-4">Rank & Durasi</th>
                      <th className="py-3.5 px-4">Masalah Infrastruktur</th>
                      <th className="py-3.5 px-4">Kategori</th>
                      <th className="py-3.5 px-4">Sumber Data</th>
                      <th className="py-3.5 px-4">Konfirmasi Warga</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2E2C]">
                    {filteredIssues.map((item, index) => {
                      return (
                        <tr key={item.id} className="hover:bg-[#1A1F1D] transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs w-6 text-[#9BA39E]">
                                #{index + 1}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                                  item.durationDays > 60
                                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/35'
                                    : item.durationDays > 30
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/35'
                                    : 'bg-blue-500/20 text-blue-300 border-blue-500/35'
                                }`}
                              >
                                {item.durationDays} Hari
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#F2F2F0] max-w-sm sm:max-w-md">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#9BA39E] flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="w-3 h-3 text-[#81C784]" />
                                <span>{item.location || 'Lokasi Terdaftar'}</span>
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${getStatusBadge(item.status).badge}`}>
                                {getStatusBadge(item.status).label}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 uppercase text-[11px] font-semibold text-[#81C784]">
                              {getCategoryIcon(item.category)}
                              <span>{item.category}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0D0F0E] border border-[#2A2E2C] text-[#9BA39E]">
                              {item.source === 'citizen' ? (
                                <>
                                  <UserIcon className="w-3.5 h-3.5 text-[#81C784]" />
                                  <span>Laporan Warga</span>
                                </>
                              ) : (
                                <>
                                  <AiRobotIcon className="w-3.5 h-3.5 text-[#81C784]" />
                                  <span>AI Media Crawler</span>
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs">
                            <span className="text-[#81C784] font-bold">
                              {item.confirmationCount || 0}
                            </span>{' '}
                            warga
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <Link
                              to={`/laporan/${item.id}`}
                              className="py-1 px-3 rounded-lg bg-[#2E7D32]/25 hover:bg-[#2E7D32]/45 text-[#81C784] border border-[#2E7D32]/40 text-xs font-semibold transition-all cursor-pointer inline-block"
                            >
                              Lihat Detail →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KORELASI APBD TRACKER */}
        {selectedTab === 'apbd' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
              <div>
                <strong className="text-amber-300 flex items-center gap-1.5 mb-1 text-sm">
                  <SparklesIcon className="w-4 h-4 text-amber-300" />
                  <span>Fitur Sinkronisasi Anggaran (RAG Pipeline) Sedang Dikembangkan</span>
                </strong>
                <span>Seluruh data nominal alokasi anggaran daerah saat ini dinonaktifkan sementara (Rp 0) untuk memastikan validitas sebelum modul parser resmi diluncurkan.</span>
              </div>
              <button
                onClick={() => setShowRagModal(true)}
                className="py-2 px-4 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-semibold whitespace-nowrap cursor-pointer transition-all self-start sm:self-auto shadow-sm"
              >
                Lihat Detail Pengumuman →
              </button>
            </div>

            {/* Clean Empty State */}
            <div className="py-16 px-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] text-center max-w-2xl mx-auto space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-3xl bg-[#1B5E20]/20 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center mx-auto shadow-inner">
                <SparklesIcon className="w-8 h-8 text-[#81C784]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold font-heading text-[#F2F2F0]">
                  Belum Ada Data Anggaran Terhubung
                </h3>
                <p className="text-xs sm:text-sm text-[#9BA39E] max-w-md mx-auto leading-relaxed">
                  Modul pencocokan data anggaran pembangunan daerah (APBD/APBN) dengan laporan warga sedang dalam proses integrasi teknologi AI RAG.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setShowRagModal(true)}
                  className="py-2.5 px-5 rounded-xl bg-[#2E7D32]/25 hover:bg-[#2E7D32]/45 text-[#81C784] border border-[#2E7D32]/50 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Pelajari Status Pengembangan RAG</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FEED AI NEWS CRAWLER */}
        {selectedTab === 'crawler' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2E7D32]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                  <AiRobotIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#F2F2F0]">
                  Sistem AI News Crawler Otonom (US-05)
                </h3>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Fixora menjalankan cron job otomatis yang memantau portal media nasional (Kompas, Detik, Antara, Poskota). Setiap artikel yang menyebutkan kerusakan jalan, jembatan, atau banjir diekstrak koordinat lokasi, kategori, dan tingkat keparahannya menggunakan Multimodal LLM Structured JSON.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleTriggerCrawler}
                  disabled={isCrawling}
                  className="py-2 px-4 rounded-xl bg-[#2E7D32]/25 hover:bg-[#2E7D32]/45 text-[#81C784] border border-[#2E7D32]/50 text-xs font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <AiRobotIcon className="w-3.5 h-3.5" />
                  <span>{isCrawling ? 'Memicu…' : 'Jalankan Crawler Sekarang'}</span>
                </button>
                {crawlToast && (
                  <span className="text-xs text-[#81C784]">{crawlToast}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues
                .filter((i) => i.source === 'ai_media')
                .map((aiItem) => (
                  <div
                    key={aiItem.id}
                    className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/35 text-[10px] font-mono">
                          <AiRobotIcon className="w-3 h-3 text-blue-300" />
                          <span>SUMBER: MEDIA ONLINE</span>
                        </span>
                        <span className="text-[11px] font-mono text-[#9BA39E]">
                          {aiItem.reportedAt.slice(0, 10)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F2F2F0]">{aiItem.title}</h4>
                      <p className="text-xs text-[#9BA39E] mt-1 leading-relaxed line-clamp-2">
                        {aiItem.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#2A2E2C] text-xs">
                      <span className="inline-flex items-center gap-1.5 text-[#81C784] font-semibold uppercase text-[11px]">
                        {getCategoryIcon(aiItem.category)}
                        <span>Kategori: {aiItem.category}</span>
                      </span>
                      <Link
                        to="/peta"
                        className="text-[#81C784] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        Buka di Peta →
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RAG FEATURE DEVELOPMENT ANNOUNCEMENT MODAL ── */}
      {showRagModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0D0F0E]/85 backdrop-blur-md"
            onClick={() => setShowRagModal(false)}
          />

          <div className="relative w-full max-w-lg bg-[#161918] border border-[#2E7D32]/50 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 animate-slide-up overflow-hidden text-left">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#81C784] to-transparent" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#1B5E20]/35 border border-[#2E7D32]/50 text-[#81C784] flex items-center justify-center flex-shrink-0 shadow-inner">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#81C784] uppercase tracking-wider">
                    PENGUMUMAN PENGEMBANGAN FITUR
                  </span>
                  <h3 className="text-lg font-bold font-heading text-[#F2F2F0] leading-tight mt-0.5">
                    Integrasi Data Anggaran (RAG) Sedang Dikembangkan
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowRagModal(false)}
                className="w-8 h-8 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] flex items-center justify-center text-[#9BA39E] hover:text-[#F2F2F0] transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0F0E] border border-[#2A2E2C] space-y-2.5 text-xs text-[#9BA39E] leading-relaxed">
              <p>
                Fitur sinkronisasi data anggaran pembangunan (APBD/APBN) secara otomatis saat ini <strong className="text-[#F2F2F0]">belum dirilis dan sedang dalam tahap pengembangan aktif</strong> menggunakan teknologi <span className="text-[#81C784] font-mono font-semibold">RAG (Retrieval-Augmented Generation)</span> & Document Parser resmi.
              </p>
              <p>
                Sesuai prinsip transparansi Fixora yang <strong className="text-[#F2F2F0]">tidak menampilkan angka estimasi tanpa verifikasi</strong>, seluruh indikator dana/anggaran di platform Fixora saat ini diset sebesar <strong className="text-amber-300 font-mono font-bold">Rp 0</strong>.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#F2F2F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span><strong>Status Anggaran:</strong> Dinonaktifkan sementara (Rp 0).</span>
              </div>
              <div className="flex items-center gap-2 text-[#F2F2F0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#81C784]" />
                <span><strong>Teknologi:</strong> RAG Pipeline + Keterbukaan Informasi Publik.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowRagModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold font-heading shadow-lg shadow-[#2E7D32]/20 transition-all cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
