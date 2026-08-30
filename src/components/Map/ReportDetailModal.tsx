import { useEffect, useState } from 'react';
import type { IssueReport } from '../../types';
import StatusHistoryTimeline from './StatusHistoryTimeline';
import { getDurationDays } from '../../utils/dateUtils';
import { CheckIcon, MapPinIcon } from '../Icons';

const categoryLabels: Record<string, string> = {
  jalan: 'Jalan Rusak',
  jembatan: 'Jembatan',
  sampah: 'Sampah',
  bangunan: 'Bangunan',
  drainase: 'Drainase',
};

const sourceLabels: Record<string, string> = {
  citizen: 'Laporan Warga',
  ai_media: 'Terdeteksi AI (Media)',
};

const statusConfig: Record<string, { label: string; badge: string }> = {
  new: { label: 'Menunggu Verifikasi', badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
  open: { label: 'Sedang Berlangsung', badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40' },
  closed: { label: 'Telah Ditangani', badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
  archived: { label: 'Diarsipkan', badge: 'bg-[#161918] text-[#9BA39E] border border-[#2A2E2C]' },
};

interface ReportDetailModalProps {
  issue: IssueReport | null;
  onClose: () => void;
  onConfirmIssue?: (issueId: string) => void;
}

export default function ReportDetailModal({ issue, onClose, onConfirmIssue }: ReportDetailModalProps) {
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(issue?.confirmationCount || 0);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  useEffect(() => {
    if (issue) {
      setConfirmCount(issue.confirmationCount || 0);
      setHasConfirmed(false);
    }
  }, [issue]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!issue) return null;

  const status = statusConfig[issue.status] || statusConfig.new;
  const durationDays = getDurationDays(issue.reportedAt);

  const handleConfirm = () => {
    if (hasConfirmed) return;
    setHasConfirmed(true);
    setConfirmCount(prev => prev + 1);
    if (onConfirmIssue) {
      onConfirmIssue(issue.id);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0D0F0E]/85 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-hidden bg-[#161918] border border-[#2A2E2C] rounded-3xl shadow-2xl animate-slide-up flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#2A2E2C]">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs text-[#9BA39E] font-mono">#{issue.id}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${status.badge}`}>
                {status.label}
              </span>
              {durationDays > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
                  ⏱ Dibiarkan {durationDays} Hari
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#F2F2F0] leading-snug">{issue.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-[#9BA39E] hover:text-[#F2F2F0] hover:bg-[#1F2422] rounded-full transition-all cursor-pointer"
            aria-label="Tutup"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {issue.imageUrl && (
            <div className="relative w-full h-52 bg-[#0D0F0E] overflow-hidden">
              <img
                src={issue.imageUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161918] via-transparent to-transparent" />
            </div>
          )}

          <div className="p-5 sm:p-6 space-y-5">
            {/* Tags & Metadata */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#1B5E20]/30 text-[#81C784] border border-[#2E7D32]/40 rounded-full text-xs font-semibold">
                {categoryLabels[issue.category] || issue.category}
              </span>
              <span className="px-3 py-1 bg-[#0D0F0E] text-[#9BA39E] border border-[#2A2E2C] rounded-full text-xs font-medium">
                {sourceLabels[issue.source] || issue.source}
              </span>
              {issue.location && (
                <span className="flex items-center gap-1.5 text-xs text-[#9BA39E] bg-[#0D0F0E] px-3 py-1 rounded-full border border-[#2A2E2C]">
                  <MapPinIcon className="w-3.5 h-3.5 text-[#81C784]" />
                  <span>{issue.location}</span>
                </span>
              )}
            </div>

            {/* Description */}
            {issue.description && (
              <div>
                <h3 className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-2 font-mono">
                  Deskripsi Kerusakan
                </h3>
                <p className="text-sm text-[#F2F2F0] leading-relaxed bg-[#0D0F0E]/60 p-3.5 rounded-xl border border-[#2A2E2C]">
                  {issue.description}
                </p>
              </div>
            )}

            {/* Verification Status (US-04 PRD) */}
            <div className="p-4 rounded-2xl bg-[#0D0F0E]/80 border border-[#2E7D32]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#81C784] flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4" />
                  <span>Akuntabilitas Publik</span>
                </div>
                <div className="text-xs text-[#9BA39E] mt-0.5">
                  <strong className="text-[#F2F2F0]">{confirmCount} warga</strong> telah memverifikasi titik ini masih bermasalah
                </div>
              </div>
              <button
                onClick={handleConfirm}
                disabled={hasConfirmed}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  hasConfirmed
                    ? 'bg-[#1B5E20]/40 text-[#81C784] border border-[#2E7D32]/50 cursor-default'
                    : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] shadow-md active:scale-95'
                }`}
              >
                <CheckIcon className="w-4 h-4" />
                <span>{hasConfirmed ? 'Sudah Dikonfirmasi' : 'Konfirmasi Masih Rusak (+1)'}</span>
              </button>
            </div>

            {/* Status History Timeline */}
            <div>
              <h3 className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-3 font-mono">
                Riwayat & Progres Penanganan
              </h3>
              <StatusHistoryTimeline history={issue.statusHistory} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#2A2E2C] flex items-center justify-between bg-[#121514]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-[#9BA39E] hover:text-[#F2F2F0] transition-colors text-xs px-3 py-2 rounded-xl hover:bg-[#1F2422] border border-[#2A2E2C] cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span>{showCopiedToast ? 'Tautan Disalin!' : 'Bagikan'}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold py-2 px-5 rounded-xl bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-[#F2F2F0] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
