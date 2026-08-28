import { useEffect } from 'react';
import type { IssueReport } from '../../types';
import StatusHistoryTimeline from './StatusHistoryTimeline';

const categoryLabels: Record<string, string> = {
  jalan: '🚧 Jalan Rusak',
  jembatan: '🌉 Jembatan',
  sampah: '🗑️ Sampah',
  bangunan: '🏗️ Bangunan',
  drainase: '🌊 Drainase',
};

const sourceLabels: Record<IssueReport['source'], string> = {
  citizen: 'Laporan Warga',
  ai_media: 'Media Online',
};

const statusConfig: Record<string, { label: string; badge: string }> = {
  new: { label: 'New', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  open: { label: 'Open', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  closed: { label: 'Closed', badge: 'bg-green-500/20 text-green-400 border-green-500/30' },
  archived: { label: 'Archived', badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

interface ReportDetailModalProps {
  issue: IssueReport | null;
  onClose: () => void;
}

export default function ReportDetailModal({ issue, onClose }: ReportDetailModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!issue) return null;

  const status = statusConfig[issue.status];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-hidden glass-card rounded-3xl animate-slide-up flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-slate-500 font-mono">#{issue.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${status.badge}`}>
                {status.label}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{issue.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
            aria-label="Tutup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 scrollbar-hide">
          {issue.imageUrl && (
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="w-full h-48 object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}

          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge-primary text-xs">{categoryLabels[issue.category]}</span>
              <span className="badge-outline text-xs">{sourceLabels[issue.source]}</span>
              {issue.location && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {issue.location}
                </span>
              )}
            </div>

            {issue.description && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Deskripsi</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{issue.description}</p>
              </div>
            )}

            <StatusHistoryTimeline history={issue.statusHistory} />
          </div>
        </div>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Bagikan
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm px-3 py-2 rounded-lg hover:bg-white/5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak
          </button>
          <button
            onClick={onClose}
            className="ml-auto btn-outline text-sm py-2 px-4"
          >
            Tutup
          </button>
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Ikuti
          </button>
        </div>
      </div>
    </div>
  );
}
