import { useState } from 'react';
import type { IssueReport, IssueCategory } from '../../types';
import { getDurationDays } from '../../utils/dateUtils';
import { MapPinIcon, SearchIcon } from '../Icons';

const categoryLabels: Record<IssueCategory, string> = {
  jalan: 'Jalan',
  jembatan: 'Jembatan',
  sampah: 'Sampah',
  bangunan: 'Bangunan',
  drainase: 'Drainase',
};

interface MapSidebarProps {
  issues: IssueReport[];
  totalIssues: number;
  onSelectIssue: (issue: IssueReport) => void;
  selectedIssueId?: string | null;
  selectedCategory: IssueCategory | 'all';
  onSelectCategory: (cat: IssueCategory | 'all') => void;
  selectedDuration: 'all' | 'lt30' | 'gt30' | 'gt90';
  onSelectDuration: (dur: 'all' | 'lt30' | 'gt30' | 'gt90') => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export default function MapSidebar({
  issues,
  onSelectIssue,
  selectedIssueId,
  selectedCategory,
  onSelectCategory,
  selectedDuration,
  onSelectDuration,
  isOpen,
  onToggleOpen,
}: MapSidebarProps) {
  const [search, setSearch] = useState('');

  const filteredIssues = issues.filter((issue) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (
        !issue.title.toLowerCase().includes(q) &&
        !(issue.location && issue.location.toLowerCase().includes(q)) &&
        !issue.id.toLowerCase().includes(q)
      ) return false;
    }
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    const days = getDurationDays(issue.reportedAt);
    if (selectedDuration === 'lt30' && days >= 30) return false;
    if (selectedDuration === 'gt30' && days < 30) return false;
    if (selectedDuration === 'gt90' && days < 90) return false;
    return true;
  });

  const totalActive = issues.filter((i) => i.status === 'open' || i.status === 'new').length;

  /* ══════════════════════════════════════════════
     COLLAPSED STATE: Show a vertical tab to reopen
     ══════════════════════════════════════════════ */
  if (!isOpen) {
    return (
      <div className="h-full flex-shrink-0 z-20 flex items-stretch">
        <button
          onClick={onToggleOpen}
          className="w-10 h-full bg-[#161918] hover:bg-[#1F2422] border-r border-[#2A2E2C] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors group"
          title="Tampilkan Panel Laporan"
        >
          {/* Arrow icon pointing right */}
          <svg className="w-5 h-5 text-[#81C784] group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {/* Vertical text */}
          <span className="text-[10px] font-bold text-[#9BA39E] group-hover:text-[#F2F2F0] tracking-widest uppercase [writing-mode:vertical-lr] rotate-180">
            Laporan ({filteredIssues.length})
          </span>
        </button>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     EXPANDED STATE: Full sidebar panel
     ══════════════════════════════════════════════ */
  return (
    <div className="w-96 h-full bg-[#161918] border-r border-[#2A2E2C] flex flex-col flex-shrink-0 z-20 select-none">

      {/* ── Header ── */}
      <div className="p-4 border-b border-[#2A2E2C] space-y-3 flex-shrink-0 bg-[#121514]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#2E7D32]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
              <MapPinIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#F2F2F0] leading-none">
                Radar Laporan Publik
              </h2>
              <span className="text-[11px] text-[#81C784] font-mono mt-0.5 inline-block">
                {totalActive} Isu Aktif • Jabodetabek
              </span>
            </div>
          </div>

          {/* ★ MINIMIZE BUTTON ★ */}
          <button
            onClick={onToggleOpen}
            className="w-8 h-8 rounded-lg bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] text-[#9BA39E] hover:text-[#F2F2F0] flex items-center justify-center transition-colors cursor-pointer"
            title="Sembunyikan Panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari jalan, lokasi, atau ID..."
            className="w-full bg-[#0D0F0E] text-[#F2F2F0] placeholder-[#9BA39E]/70 text-xs rounded-xl py-2.5 pl-9 pr-8 border border-[#2A2E2C] outline-none focus:border-[#2E7D32] transition-colors"
          />
          <SearchIcon className="w-4 h-4 text-[#9BA39E] absolute left-3 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9BA39E] hover:text-[#F2F2F0] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              selectedCategory === 'all'
                ? 'bg-[#2E7D32]/30 text-[#81C784] border-[#2E7D32]/60'
                : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:text-[#F2F2F0]'
            }`}
          >
            Semua ({issues.length})
          </button>
          {(Object.keys(categoryLabels) as IssueCategory[]).map((cat) => {
            const count = issues.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#2E7D32]/30 text-[#81C784] border-[#2E7D32]/60'
                    : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:text-[#F2F2F0]'
                }`}
              >
                {categoryLabels[cat]} ({count})
              </button>
            );
          })}
        </div>

        {/* Duration Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#9BA39E] font-mono mr-0.5">Durasi:</span>
          {[
            { id: 'all', label: 'Semua' },
            { id: 'gt30', label: '> 30 Hari' },
            { id: 'gt90', label: '> 90 Hari' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => onSelectDuration(d.id as typeof selectedDuration)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold transition-all cursor-pointer border ${
                selectedDuration === d.id
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:text-[#F2F2F0]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable Report List ── */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
        {filteredIssues.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9BA39E] space-y-2">
            <MapPinIcon className="w-8 h-8 mx-auto text-[#9BA39E]/40" />
            <p>Tidak ada laporan yang sesuai dengan filter.</p>
            <button
              onClick={() => { setSearch(''); onSelectCategory('all'); onSelectDuration('all'); }}
              className="text-[#81C784] hover:underline font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const isSelected = selectedIssueId === issue.id;
            const days = getDurationDays(issue.reportedAt);
            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer space-y-2 group ${
                  isSelected
                    ? 'bg-[#1B5E20]/25 border-[#2E7D32] shadow-lg'
                    : 'bg-[#0D0F0E]/70 border-[#2A2E2C] hover:border-[#2E7D32]/50 hover:bg-[#141816]'
                }`}
              >
                {/* Tags row */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#161918] text-[#81C784] border border-[#2A2E2C] font-semibold uppercase">
                      {categoryLabels[issue.category] || issue.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#9BA39E]">
                      #{issue.id}
                    </span>
                  </div>
                  {days > 0 && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                      days > 60 ? 'bg-rose-500/20 text-rose-300 border-rose-500/35'
                        : days > 30 ? 'bg-amber-500/20 text-amber-300 border-amber-500/35'
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/35'
                    }`}>
                      ⏱ {days} Hari
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#F2F2F0] leading-snug line-clamp-2 group-hover:text-[#81C784] transition-colors">
                  {issue.title}
                </h3>

                {/* Footer */}
                <div className="flex items-center justify-between text-[11px] text-[#9BA39E] pt-1.5 border-t border-[#2A2E2C]/50">
                  <span className="flex items-center gap-1 truncate max-w-[170px]">
                    <MapPinIcon className="w-3 h-3 text-[#81C784] flex-shrink-0" />
                    <span className="truncate">{issue.location || 'Lokasi terdaftar'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#81C784]">
                    {issue.confirmationCount || 0} Konfirmasi
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
