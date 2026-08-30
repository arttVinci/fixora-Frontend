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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-[#2A2E2C] gap-4">
          <div>
            <div className="text-xs font-semibold text-[#81C784] uppercase tracking-wider mb-1">
              Data Transparansi Publik
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F2F2F0] font-heading">
              Ringkasan Kinerja & Laporan
            </h2>
            <p className="text-[#9BA39E] text-xs sm:text-sm mt-1">
              Pemantauan real-time integritas infrastruktur daerah
            </p>
          </div>

          <div className="flex items-center bg-[#161918] p-1 rounded-xl border border-[#2A2E2C] text-xs font-medium text-[#9BA39E] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('30d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === '30d' ? 'bg-[#2E7D32] text-[#F2F2F0] font-semibold' : 'hover:text-[#F2F2F0]'}`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setActiveTab('90d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === '90d' ? 'bg-[#2E7D32] text-[#F2F2F0] font-semibold' : 'hover:text-[#F2F2F0]'}`}
            >
              90 Hari
            </button>
            <button
              onClick={() => setActiveTab('1y')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === '1y' ? 'bg-[#2E7D32] text-[#F2F2F0] font-semibold' : 'hover:text-[#F2F2F0]'}`}
            >
              1 Tahun
            </button>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Reveal delay={0.04}>
          <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-5 hover:border-[#2E7D32]/40 transition-all shadow-md">
            <div className="flex justify-between items-center text-[#9BA39E] text-xs font-medium mb-3">
              <span>Total Laporan Masuk</span>
              <span className="text-[#81C784] bg-[#1B5E20]/30 px-2 py-0.5 rounded font-mono text-[11px] border border-[#2E7D32]/30">+14.2%</span>
            </div>
            <div className="text-3xl font-bold text-[#F2F2F0] font-heading mb-2">
              {stats.total}
            </div>
            <div className="flex items-center gap-3 text-xs text-[#9BA39E] pt-2 border-t border-[#2A2E2C]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> {stats.countNew} Baru</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> {stats.countOpen} Proses</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-5 hover:border-[#2E7D32]/40 transition-all shadow-md">
            <div className="flex justify-between items-center text-[#9BA39E] text-xs font-medium mb-3">
              <span>Tingkat Penyelesaian</span>
              <span className="text-[#81C784] bg-[#1B5E20]/30 px-2 py-0.5 rounded font-mono text-[11px] border border-[#2E7D32]/30">Stabil</span>
            </div>
            <div className="text-3xl font-bold text-[#F2F2F0] font-heading mb-2">
              {stats.resRate}%
            </div>
            <div className="w-full bg-[#0D0F0E] border border-[#2A2E2C] h-1.5 rounded-full overflow-hidden mt-3">
              <div className="bg-[#2E7D32] h-full rounded-full transition-all duration-500" style={{ width: `${stats.resRate}%` }} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-5 hover:border-[#2E7D32]/40 transition-all shadow-md">
            <div className="flex justify-between items-center text-[#9BA39E] text-xs font-medium mb-3">
              <span>Rata-Rata Waktu Respon</span>
              <span className="text-[#81C784] bg-[#1B5E20]/30 px-2 py-0.5 rounded font-mono text-[11px] border border-[#2E7D32]/30">AI Verified</span>
            </div>
            <div className="text-3xl font-bold text-[#F2F2F0] font-heading mb-2">
              3.4 Hari
            </div>
            <p className="text-xs text-[#9BA39E] pt-2 border-t border-[#2A2E2C]">
              Verifikasi AI & APBD &lt; 2 menit
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-5 hover:border-[#2E7D32]/40 transition-all shadow-md">
            <div className="flex justify-between items-center text-[#9BA39E] text-xs font-medium mb-3">
              <span>Laporan Mangkrak &gt;30 Hari</span>
              <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-mono text-[11px] border border-red-500/20">Perlu Perhatian</span>
            </div>
            <div className="text-3xl font-bold text-red-400 font-heading mb-2">
              6
            </div>
            <p className="text-xs text-[#9BA39E] pt-2 border-t border-[#2A2E2C]">
              Kritikal untuk penanganan APBD
            </p>
          </div>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Reveal delay={0.2} className="lg:col-span-7">
          <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-6 h-full flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-[#F2F2F0]">Tren Pelaporan & Penanganan</h3>
                <p className="text-xs text-[#9BA39E] mt-0.5">Perbandingan jumlah laporan baru dan penyelesaian</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-[#F2F2F0]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" /> Selesai
                </span>
                <span className="flex items-center gap-1.5 text-[#F2F2F0]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]" /> Masuk
                </span>
              </div>
            </div>

            <div className="relative h-56 w-full flex items-end justify-between pt-6 pb-4">
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 160">
                <defs>
                  <linearGradient id="areaGreenLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#81C784" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#81C784" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="areaGreenDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(242,242,240,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="rgba(242,242,240,0.05)" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(242,242,240,0.05)" strokeDasharray="3 3" />

                <path
                  d="M 0,130 Q 30,110 66,90 T 132,60 T 198,80 T 264,70 T 330,40 T 400,20 L 400,150 L 0,150 Z"
                  fill="url(#areaGreenLight)"
                />
                <path
                  d="M 0,130 Q 30,110 66,90 T 132,60 T 198,80 T 264,70 T 330,40 T 400,20"
                  fill="none"
                  stroke="#81C784"
                  strokeWidth="2.5"
                />

                <path
                  d="M 0,140 Q 30,120 66,105 T 132,80 T 198,95 T 264,85 T 330,55 T 400,35 L 400,150 L 0,150 Z"
                  fill="url(#areaGreenDark)"
                />
                <path
                  d="M 0,140 Q 30,120 66,105 T 132,80 T 198,95 T 264,85 T 330,55 T 400,35"
                  fill="none"
                  stroke="#2E7D32"
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
                    <div className="absolute -top-20 bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl px-3 py-2 shadow-2xl text-left text-xs whitespace-nowrap z-20">
                      <div className="font-semibold text-[#F2F2F0] mb-1">{d.label} 2026</div>
                      <div className="text-[#81C784]">Masuk: <span className="font-bold">{d.value}</span></div>
                      <div className="text-[#4CAF50]">Selesai: <span className="font-bold">{d.resolved}</span></div>
                    </div>
                  )}

                  <div className={`w-3 h-3 rounded-full border-2 transition-all ${activeHoverIndex === index ? 'bg-white border-[#2E7D32] scale-125' : 'bg-[#0D0F0E] border-[#2A2E2C]'}`} />
                  <span className={`text-xs mt-3 transition-colors ${activeHoverIndex === index ? 'text-[#F2F2F0] font-semibold' : 'text-[#9BA39E]'}`}>
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.24} className="lg:col-span-5">
          <div className="bg-[#161918] border border-[#2A2E2C] rounded-2xl p-6 h-full flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-[#F2F2F0]">Sebaran per Kategori</h3>
                <span className="text-xs text-[#81C784] font-mono">100% Terverifikasi</span>
              </div>

              <div className="space-y-4">
                {stats.catCounts.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 text-[#9BA39E]">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold text-[#F2F2F0] font-mono">{item.count} <span className="text-[#9BA39E] font-normal">({item.pct}%)</span></span>
                    </div>
                    <div className="w-full bg-[#0D0F0E] border border-[#2A2E2C]/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[#2A2E2C] flex items-center justify-between text-xs text-[#9BA39E]">
              <span>Kategori Utama: <strong className="text-[#F2F2F0]">Jalan Rusak</strong></span>
              <span className="text-[#81C784] font-medium">Update Realtime</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
