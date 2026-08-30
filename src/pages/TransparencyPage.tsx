import { useState, useMemo } from 'react';
import type { IssueReport } from '../types';
import { getDurationDays } from '../utils/dateUtils';
import {
  MapPinIcon,
  CheckIcon,
  SearchIcon,
  SparklesIcon,
} from '../components/Icons';

interface TransparencyPageProps {
  issues: IssueReport[];
  onSelectIssueOnMap?: (issue: IssueReport) => void;
  onNavigateToMap?: () => void;
}

interface ApbdProject {
  id: string;
  projectName: string;
  agency: string;
  budgetAllocated: string;
  fiscalYear: string;
  statusField: 'Mangkrak / Tidak Ada Progres' | 'Progres Lambat' | 'Dalam Pengerjaan' | 'Selesai';
  matchedLocation: string;
  daysNeglected: number;
}

const SAMPLE_APBD_DATA: ApbdProject[] = [
  {
    id: 'APBD-DKI-2024-041',
    projectName: 'Rehabilitasi Saluran Drainase & Gorong-gorong Senayan-Palmerah',
    agency: 'Dinas Sumber Daya Air DKI Jakarta',
    budgetAllocated: 'Rp 4.250.000.000',
    fiscalYear: '2024 / 2025',
    statusField: 'Mangkrak / Tidak Ada Progres',
    matchedLocation: 'Senayan, Jakarta Pusat',
    daysNeglected: 142,
  },
  {
    id: 'APBD-DKI-2024-118',
    projectName: 'Perbaikan Jembatan Penyeberangan & Penguatan Struktur Ciliwung',
    agency: 'Dinas Bina Marga DKI Jakarta',
    budgetAllocated: 'Rp 1.800.000.000',
    fiscalYear: '2024',
    statusField: 'Progres Lambat',
    matchedLocation: 'Sungai Ciliwung, Jakarta Pusat',
    daysNeglected: 98,
  },
  {
    id: 'APBD-DKI-2024-302',
    projectName: 'Pengaspalan Ulang & Penambalan Lubang Jalur Cepat Sudirman',
    agency: 'Dinas Bina Marga DKI Jakarta',
    budgetAllocated: 'Rp 2.100.000.000',
    fiscalYear: '2025',
    statusField: 'Dalam Pengerjaan',
    matchedLocation: 'Jalan Sudirman, Jakarta Selatan',
    daysNeglected: 45,
  },
  {
    id: 'APBD-BKS-2024-089',
    projectName: 'Pengelolaan TPA & Pengangkutan Sampah Terpadu Jalur Barat',
    agency: 'Dinas Lingkungan Hidup Kota Bekasi',
    budgetAllocated: 'Rp 3.400.000.000',
    fiscalYear: '2024',
    statusField: 'Mangkrak / Tidak Ada Progres',
    matchedLocation: 'Taman Anggrek, Jakarta Barat',
    daysNeglected: 74,
  },
];

export default function TransparencyPage({
  issues,
  onNavigateToMap,
}: TransparencyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'apbd' | 'crawler'>('leaderboard');
  const [exportToast, setExportToast] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2A2E2C] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px bg-[#2E7D32]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#81C784] font-mono">
                OPEN DATA & AKUNTABILITAS PUBLIK
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F2F2F0]">
              Transparansi & Pelacak Anggaran
            </h1>
            <p className="text-sm text-[#9BA39E] max-w-2xl mt-1.5 leading-relaxed">
              Pantau durasi infrastruktur yang dibiarkan mangkrak, cross-reference data alokasi APBD pemerintah, serta ekstraksi isu berita oleh sistem AI otonom.
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
            <div className="text-xs text-[#9BA39E] font-medium mb-1">Total Titik Terdata</div>
            <div className="text-2xl font-bold font-heading text-[#81C784]">{issues.length} Lokasi</div>
            <div className="text-[11px] text-[#9BA39E] mt-1 font-mono">Jabodetabek Coverage</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] shadow-lg">
            <div className="text-xs text-[#9BA39E] font-medium mb-1">Mangkrak Terlama</div>
            <div className="text-2xl font-bold font-heading text-rose-400">
              {rankedIssues[0]?.durationDays || 0} Hari
            </div>
            <div className="text-[11px] text-[#9BA39E] mt-1 truncate">
              {rankedIssues[0]?.title || '-'}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] shadow-lg">
            <div className="text-xs text-[#9BA39E] font-medium mb-1">Kontribusi AI Crawler</div>
            <div className="text-2xl font-bold font-heading text-blue-400">{aiStats.aiRatio}%</div>
            <div className="text-[11px] text-[#9BA39E] mt-1 font-mono">
              {aiStats.totalAi} Berita Media Terdeteksi
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] shadow-lg">
            <div className="text-xs text-[#9BA39E] font-medium mb-1">Total Anggaran Terhubung</div>
            <div className="text-2xl font-bold font-heading text-amber-300">Rp 11,55 M</div>
            <div className="text-[11px] text-[#9BA39E] mt-1 font-mono">SatuData Jakarta APBD</div>
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
            Leaderboard Titik Mangkrak Terlama
          </button>
          <button
            onClick={() => setSelectedTab('apbd')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedTab === 'apbd'
                ? 'bg-[#2E7D32]/30 text-[#81C784] border border-[#2E7D32]/50'
                : 'text-[#9BA39E] hover:text-[#F2F2F0]'
            }`}
          >
            Korelasi Anggaran APBD
          </button>
          <button
            onClick={() => setSelectedTab('crawler')}
            className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedTab === 'crawler'
                ? 'bg-[#2E7D32]/30 text-[#81C784] border border-[#2E7D32]/50'
                : 'text-[#9BA39E] hover:text-[#F2F2F0]'
            }`}
          >
            Feed AI News Crawler
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
                            <div className="text-[11px] text-[#9BA39E] flex items-center gap-1 mt-0.5">
                              <MapPinIcon className="w-3 h-3 text-[#81C784]" />
                              <span>{item.location || 'Lokasi Terdaftar'}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-[#81C784]">
                            {item.category}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#0D0F0E] border border-[#2A2E2C] text-[#9BA39E]">
                              {item.source === 'citizen' ? 'Laporan Warga' : 'AI Media Crawler'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs">
                            <span className="text-[#81C784] font-bold">
                              {item.confirmationCount || 0}
                            </span>{' '}
                            warga
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={onNavigateToMap}
                              className="py-1 px-3 rounded-lg bg-[#2E7D32]/25 hover:bg-[#2E7D32]/45 text-[#81C784] border border-[#2E7D32]/40 text-xs font-semibold transition-all cursor-pointer"
                            >
                              Lihat di Peta →
                            </button>
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
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#1B5E20]/20 border border-[#2E7D32]/35 text-xs text-[#81C784] leading-relaxed">
              <strong>Catatan Metodologi:</strong> Data di bawah mengkorelasikan proyek rehabilitasi pada dokumen APBD terbuka (SatuData Jakarta) dengan titik laporan aktual di lapangan yang belum terselesaikan sesuai target tahun anggaran.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_APBD_DATA.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-[#9BA39E]">
                        {proj.id} • TA {proj.fiscalYear}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-[#F2F2F0] mt-0.5">
                        {proj.projectName}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/35 whitespace-nowrap">
                      {proj.statusField}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#2A2E2C]">
                    <div>
                      <span className="text-[#9BA39E] block text-[11px]">Dinas Terkait:</span>
                      <strong className="text-[#F2F2F0]">{proj.agency}</strong>
                    </div>
                    <div>
                      <span className="text-[#9BA39E] block text-[11px]">Alokasi Anggaran:</span>
                      <strong className="text-amber-300 font-mono">{proj.budgetAllocated}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2A2E2C]">
                    <span className="text-[#9BA39E] flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#81C784]" />
                      {proj.matchedLocation}
                    </span>
                    <span className="font-mono text-rose-400 font-bold">
                      ⏱ {proj.daysNeglected} hari tanpa penyelesaian
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FEED AI NEWS CRAWLER */}
        {selectedTab === 'crawler' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-3">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-[#81C784]" />
                <h3 className="text-sm font-bold text-[#F2F2F0]">
                  Sistem AI News Crawler Otonom (US-05)
                </h3>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Fixora menjalankan cron job otomatis yang memantau portal media nasional (Kompas, Detik, Antara, Poskota). Setiap artikel yang menyebutkan kerusakan jalan, jembatan, atau banjir diekstrak koordinat lokasi, kategori, dan tingkat keparahannya menggunakan Multimodal LLM Structured JSON.
              </p>
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
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/35 text-[10px] font-mono">
                          SUMBER: MEDIA ONLINE
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
                      <span className="text-[#81C784] font-semibold uppercase text-[11px]">
                        Kategori: {aiItem.category}
                      </span>
                      <button
                        onClick={onNavigateToMap}
                        className="text-[#81C784] hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        Buka di Peta →
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
