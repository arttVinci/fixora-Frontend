import { useState } from 'react';
import { CloseIcon } from '../Icons';

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
        className="absolute bottom-4 left-4 z-[1000] backdrop-blur-xl bg-[#161918]/90 text-[#F2F2F0] p-3 rounded-2xl shadow-xl border border-[#2A2E2C] hover:border-[#2E7D32] hover:bg-[#1F2422] transition-all flex items-center gap-2 group cursor-pointer"
        title="Buka Ringkasan"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#81C784] animate-pulse"></span>
        <span className="text-xs font-semibold">
          {stats.total} Laporan Terpantau
        </span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-[1000] backdrop-blur-xl bg-[#161918]/95 text-[#F2F2F0] rounded-2xl shadow-xl border border-[#2A2E2C] p-4 w-72">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#F2F2F0]">Ringkasan Laporan</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#9BA39E] hover:text-[#F2F2F0] hover:bg-[#1F2422] rounded-full p-1.5 transition-all text-xs cursor-pointer"
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-[#9BA39E] text-xs font-medium">Total Laporan</span>
          <span className="text-lg font-bold text-[#81C784]">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-rose-400 text-xs font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0"></span>
            Kritis (&gt; 30 Hari)
          </span>
          <span className="text-lg font-bold text-rose-400">{stats.critical}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#81C784] text-xs font-medium flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] flex-shrink-0"></span>
            Dalam Proses (&lt; 30 Hari)
          </span>
          <span className="text-lg font-bold text-[#81C784]">{stats.inProcess}</span>
        </div>
      </div>
    </div>
  );
}
