import { useState } from 'react';

type SummaryStats = {
  total: number;
  critical: number;
  inProcess: number;
};

type StatSummaryBarProps = {
  stats: SummaryStats;
};

export default function StatSummaryBar({ stats }: StatSummaryBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute bottom-4 left-4 z-[1000] bg-slate-950/90 text-white rounded-full shadow-xl px-4 py-3 flex items-center gap-2 font-bold hover:bg-slate-900 transition-all border border-slate-700/50"
      >
        <span className="text-xl">📊</span>
        <span>Statistik</span>
        <span className="bg-fixora-primary text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
          {stats.total}
        </span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-[1000] backdrop-blur-xl bg-slate-950/90 text-white rounded-2xl shadow-xl border border-slate-700/50 p-4 w-72">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Ringkasan Laporan</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full p-1.5 transition-all"
        >
          ✕
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-300 font-medium">Total Laporan</span>
          <span className="text-xl font-bold text-fixora-primary">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-red-400 font-medium flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"></span>
            Kritis (&gt; 30 Hari)
          </span>
          <span className="text-xl font-bold text-red-400">{stats.critical}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-green-400 font-medium flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0"></span>
            Dalam Proses (&lt; 30 Hari)
          </span>
          <span className="text-xl font-bold text-green-400">{stats.inProcess}</span>
        </div>
      </div>
    </div>
  );
}
