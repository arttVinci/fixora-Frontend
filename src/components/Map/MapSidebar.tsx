import { useState } from 'react';
import type { IssueReport } from '../../types';
import { getDurationDays } from '../../utils/dateUtils';

const statusConfig: Record<string, { label: string; badge: string; dot: string }> = {
  new: { label: 'New', badge: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', dot: 'bg-yellow-400' },
  open: { label: 'Open', badge: 'bg-orange-500/20 text-orange-400 border border-orange-500/30', dot: 'bg-orange-400' },
  closed: { label: 'Closed', badge: 'bg-green-500/20 text-green-400 border border-green-500/30', dot: 'bg-green-400' },
  archived: { label: 'Archived', badge: 'bg-slate-500/20 text-slate-400 border border-slate-500/30', dot: 'bg-slate-400' },
};

const categoryLabels: Record<string, string> = {
  jalan: 'Jalan',
  jembatan: 'Jembatan',
  sampah: 'Sampah',
  bangunan: 'Bangunan',
  drainase: 'Drainase',
};

type TabType = 'list' | 'statistics';

interface MapSidebarProps {
  issues: IssueReport[];
  totalIssues: number;
  onSelectIssue: (issue: IssueReport) => void;
  selectedIssueId?: string | null;
}

export default function MapSidebar({ issues, totalIssues, onSelectIssue, selectedIssueId }: MapSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [search, setSearch] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(search.toLowerCase()) ||
    issue.location?.toLowerCase().includes(search.toLowerCase()) ||
    issue.id.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    new: issues.filter(i => i.status === 'new').length,
    open: issues.filter(i => i.status === 'open').length,
    closed: issues.filter(i => i.status === 'closed').length,
    archived: issues.filter(i => i.status === 'archived').length,
  };

  const categoryStats = Object.entries(categoryLabels).map(([key, label]) => ({
    key, label, count: issues.filter(i => i.category === key).length
  }));

  const handleSelectAndClose = (issue: IssueReport) => {
    onSelectIssue(issue);
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden absolute top-16 left-3 z-[1000] bg-dark-surface/90 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5 hover:bg-dark-surface active:scale-95 transition-all"
      >
        <span>Laporan ({filteredIssues.length})</span>
      </button>

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-[1001] animate-fade-in"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-[1002] md:relative md:z-auto flex flex-col h-full bg-dark-surface-low/95 backdrop-blur-2xl border-r border-white/10 w-80 max-w-[85vw] md:w-72 flex-shrink-0 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/logo.png" alt="Fixora Logo" className="w-8 h-8 object-contain" />
              <span className="font-heading font-bold text-white">Fixora</span>
            </div>
            <div className="text-xs text-slate-400">
              Menampilkan <span className="text-white font-semibold">{filteredIssues.length}</span> dari <span className="text-white font-semibold">{totalIssues}</span> total laporan
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === 'list' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            List
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${activeTab === 'statistics' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Statistik
          </button>
        </div>

        {activeTab === 'list' && (
          <>
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center gap-2 bg-dark-surface/80 border border-white/10 rounded-xl px-3 py-2">
                <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari laporan..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="text-slate-500 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 scrollbar-hide">
              {filteredIssues.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-sm">Tidak ada laporan ditemukan</div>
              ) : (
                filteredIssues.map(issue => {
                  const status = statusConfig[issue.status];
                  const durationDays = getDurationDays(issue.reportedAt);
                  const isSelected = selectedIssueId === issue.id;
                  return (
                    <button
                      key={issue.id}
                      onClick={() => handleSelectAndClose(issue)}
                      className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors group ${isSelected ? 'bg-primary-500/10 border-l-2 border-l-primary-400' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs text-slate-500 font-mono">#{issue.id}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${status.badge}`}>
                          {status.label}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors line-clamp-2 mb-1">
                        {issue.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        {issue.location && (
                          <span className="flex items-center gap-1 truncate">
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="truncate">{issue.location}</span>
                          </span>
                        )}
                        <span className="flex-shrink-0">{durationDays} hari lalu</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}

        {activeTab === 'statistics' && (
          <div className="overflow-y-auto flex-1 p-4 scrollbar-hide">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Berdasarkan Status</h3>
              <div className="space-y-2">
                {Object.entries(stats).map(([status, count]) => {
                  const cfg = statusConfig[status];
                  const pct = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold w-20 text-center flex-shrink-0 ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${cfg.dot}`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white font-semibold w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Berdasarkan Kategori</h3>
              <div className="space-y-2">
                {categoryStats.map(({ key, label, count }) => {
                  const pct = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-slate-300 w-20 flex-shrink-0 truncate">{label}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-primary-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white font-semibold w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
