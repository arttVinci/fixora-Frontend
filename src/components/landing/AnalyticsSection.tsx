import { useState, useMemo } from 'react';
import type { IssueReport } from '../../types';
import Reveal from '../Reveal';
import {
  RoadIcon,
  BridgeIcon,
  TrashIcon,
  BuildingIcon,
  DrainageIcon,
} from '../Icons';

type AnalyticsSectionProps = {
  issues?: IssueReport[];
  totalReports?: number;
  criticalReports?: number;
  resolutionRate?: number;
};

export default function AnalyticsSection({ issues = [] }: AnalyticsSectionProps) {
  const [activeTab, setActiveTab] = useState<'30d' | '90d' | '1y'>('30d');
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(5);

  const stats = useMemo(() => {
    const total = issues.length > 0 ? issues.length : 124;

    const countNew = issues.filter(i => i.status === 'new').length || 42;
    const countOpen = issues.filter(i => i.status === 'open').length || 54;
    const countClosed = issues.filter(i => i.status === 'closed').length || 28;

    const resRate = total > 0 ? Math.round((countClosed / total) * 100) : 22;

    const catCounts = [
      { name: 'Jalan Rusak', count: issues.filter(i => i.category === 'jalan').length || 58, icon: <RoadIcon className="w-4 h-4 text-red-400" />, pct: 47, color: '#ef4444' },
      { name: 'Sampah Mangkrak', count: issues.filter(i => i.category === 'sampah').length || 28, icon: <TrashIcon className="w-4 h-4 text-emerald-400" />, pct: 23, color: '#10b981' },
      { name: 'Jembatan Rusak', count: issues.filter(i => i.category === 'jembatan').length || 18, icon: <BridgeIcon className="w-4 h-4 text-amber-400" />, pct: 14, color: '#f59e0b' },
      { name: 'Drainase Tersumbat', count: issues.filter(i => i.category === 'drainase').length || 12, icon: <DrainageIcon className="w-4 h-4 text-cyan-400" />, pct: 10, color: '#06b6d4' },
      { name: 'Bangunan Rusak', count: issues.filter(i => i.category === 'bangunan').length || 8, icon: <BuildingIcon className="w-4 h-4 text-purple-400" />, pct: 6, color: '#a855f7' },
    ];

    return {
      total,
      countNew,
      countOpen,
      countClosed,
      resRate,
      catCounts,
    };
  }, [issues]);

  const trendData = [
    { label: 'Mei', value: 42, resolved: 30 },
    { label: 'Jun', value: 58, resolved: 44 },
    { label: 'Jul', value: 74, resolved: 55 },
    { label: 'Agt', value: 92, resolved: 68 },
    { label: 'Sep', value: 85, resolved: 70 },
    { label: 'Okt', value: 110, resolved: 88 },
    { label: 'Nov', value: 124, resolved: 96 },
  ];

  return (
    <section id="stats" className="max-w-6xl mx-auto py-16 px-4">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-slate-800/80 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Data Transparansi Publik
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading">
              Ringkasan Kinerja & Laporan
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Pemantauan real-time integritas infrastruktur daerah
            </p>
          </div>

          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium text-slate-400 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('30d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === '30d' ? 'bg-slate-800 text-white font-semibold' : 'hover:text-slate-200'}`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setActiveTab('90d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === '90d' ? 'bg-slate-800 text-white font-semibold' : 'hover:text-slate-200'}`}
            >
              90 Hari
            </button>
            <button
              onClick={() => setActiveTab('1y')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === '1y' ? 'bg-slate-800 text-white font-semibold' : 'hover:text-slate-200'}`}
            >
              1 Tahun
            </button>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Reveal delay={0.04}>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-3">
              <span>Total Laporan Masuk</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono text-[11px]">+14.2%</span>
            </div>
            <div className="text-3xl font-bold text-white font-heading mb-2">
              {stats.total}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> {stats.countNew} Baru</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {stats.countOpen} Proses</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-3">
              <span>Tingkat Penyelesaian</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono text-[11px]">Stabil</span>
            </div>
            <div className="text-3xl font-bold text-white font-heading mb-2">
              {stats.resRate}%
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${stats.resRate}%` }} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-3">
              <span>Rata-Rata Waktu Respon</span>
              <span className="text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded font-mono text-[11px]">AI Verified</span>
            </div>
            <div className="text-3xl font-bold text-white font-heading mb-2">
              3.4 Hari
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              Verifikasi AI & APBD &lt; 2 menit
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all">
            <div className="flex justify-between items-center text-slate-400 text-xs font-medium mb-3">
              <span>Laporan Mangkrak &gt;30 Hari</span>
              <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-mono text-[11px]">Perlu Perhatian</span>
            </div>
            <div className="text-3xl font-bold text-red-400 font-heading mb-2">
              6
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              Kritikal untuk penanganan APBD
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Reveal delay={0.2} className="lg:col-span-7">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">Tren Pelaporan & Penanganan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Perbandingan jumlah laporan baru dan penyelesaian</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Selesai
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Masuk
                </span>
              </div>
            </div>

            <div className="relative h-56 w-full flex items-end justify-between pt-6 pb-4">
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 160">
                <defs>
                  <linearGradient id="areaCyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="areaEmerald" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                <path
                  d="M 0,130 Q 30,110 66,90 T 132,60 T 198,80 T 264,70 T 330,40 T 400,20 L 400,150 L 0,150 Z"
                  fill="url(#areaCyan)"
                />
                <path
                  d="M 0,130 Q 30,110 66,90 T 132,60 T 198,80 T 264,70 T 330,40 T 400,20"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                />

                <path
                  d="M 0,140 Q 30,120 66,105 T 132,80 T 198,95 T 264,85 T 330,55 T 400,35 L 400,150 L 0,150 Z"
                  fill="url(#areaEmerald)"
                />
                <path
                  d="M 0,140 Q 30,120 66,105 T 132,80 T 198,95 T 264,85 T 330,55 T 400,35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />
              </svg>

              {trendData.map((d, index) => (
                <div
                  key={d.label}
                  onMouseEnter={() => setActiveHoverIndex(index)}
                  className="relative z-10 flex flex-col items-center cursor-pointer group"
                >
                  {activeHoverIndex === index && (
                    <div className="absolute -top-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 shadow-2xl text-left text-xs whitespace-nowrap z-20">
                      <div className="font-semibold text-slate-300 mb-1">{d.label} 2026</div>
                      <div className="text-cyan-400">Masuk: <span className="font-bold">{d.value}</span></div>
                      <div className="text-emerald-400">Selesai: <span className="font-bold">{d.resolved}</span></div>
                    </div>
                  )}

                  <div className={`w-3 h-3 rounded-full border-2 transition-all ${activeHoverIndex === index ? 'bg-white border-emerald-400 scale-125' : 'bg-slate-900 border-slate-600'}`} />
                  <span className={`text-xs mt-3 transition-colors ${activeHoverIndex === index ? 'text-white font-semibold' : 'text-slate-500'}`}>
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24} className="lg:col-span-5">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Sebaran per Kategori</h3>
                <span className="text-xs text-slate-400 font-mono">100% Terverifikasi</span>
              </div>

              <div className="space-y-4">
                {stats.catCounts.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold text-white font-mono">{item.count} <span className="text-slate-500 font-normal">({item.pct}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>Kategori Utama: <strong className="text-slate-200">Jalan Rusak</strong></span>
              <span className="text-emerald-400 font-medium">Update Realtime</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
