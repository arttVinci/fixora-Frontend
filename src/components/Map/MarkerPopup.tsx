import { Link } from 'react-router-dom';
import { Popup } from 'react-leaflet';
import type { IssueReport, IssueCategory, IssueStatus, SourceType } from '../../types';
import { getDurationDays } from '../../utils/dateUtils';
import {
  MapPinIcon,
  CheckIcon,
  RoadIcon,
  BridgeIcon,
  TrashIcon,
  BuildingIcon,
  DrainageIcon,
  AiRobotIcon,
  UserIcon,
  ClockIcon,
} from '../Icons';

interface MarkerPopupProps {
  issue: IssueReport;
  onViewDetail?: (issue: IssueReport) => void;
}

const categoryConfig: Record<
  IssueCategory,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  jalan: {
    label: 'Jalan Rusak',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    icon: <RoadIcon className="w-3.5 h-3.5" />,
  },
  jembatan: {
    label: 'Jembatan Rawan',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    icon: <BridgeIcon className="w-3.5 h-3.5" />,
  },
  sampah: {
    label: 'Sampah Menumpuk',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    icon: <TrashIcon className="w-3.5 h-3.5" />,
  },
  bangunan: {
    label: 'Bangunan Terbengkalai',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    icon: <BuildingIcon className="w-3.5 h-3.5" />,
  },
  drainase: {
    label: 'Drainase Tersumbat',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    icon: <DrainageIcon className="w-3.5 h-3.5" />,
  },
};

const statusConfig: Record<
  IssueStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  open: {
    label: 'Sedang Berlangsung',
    dotClass: 'bg-rose-400 animate-pulse',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  },
  new: {
    label: 'Menunggu Verifikasi',
    dotClass: 'bg-amber-400 animate-pulse',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  closed: {
    label: 'Telah Ditangani',
    dotClass: 'bg-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  archived: {
    label: 'Diarsipkan',
    dotClass: 'bg-slate-400',
    badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  },
};

const sourceConfig: Record<
  SourceType,
  { label: string; badgeClass: string; icon: React.ReactNode }
> = {
  citizen: {
    label: 'Laporan Warga',
    badgeClass: 'bg-[#161918]/80 text-[#F2F2F0] border-[#2A2E2C]',
    icon: <UserIcon className="w-3 h-3 text-[#81C784]" />,
  },
  ai_media: {
    label: 'AI Scanner',
    badgeClass: 'bg-[#1B5E20]/40 text-[#81C784] border-[#2E7D32]/50',
    icon: <AiRobotIcon className="w-3.5 h-3.5" />,
  },
  government_data: {
    label: 'Data Pemerintah',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: <BuildingIcon className="w-3 h-3 text-blue-300" />,
  },
};

function getSeverityBadge(severityScore: number) {
  if (severityScore >= 80) {
    return {
      label: 'Kritis',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    };
  }
  if (severityScore >= 60) {
    return {
      label: 'Tinggi',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    };
  }
  if (severityScore >= 40) {
    return {
      label: 'Sedang',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    };
  }
  return {
    label: 'Rendah',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  };
}

export default function MarkerPopup({ issue, onViewDetail }: MarkerPopupProps) {
  const durationDays = getDurationDays(issue.reportedAt);
  const isCritical = durationDays > 30 || issue.severityScore >= 8;

  const category = categoryConfig[issue.category] || categoryConfig.jalan;
  const status = statusConfig[issue.status] || statusConfig.open;
  const source = sourceConfig[issue.source] || sourceConfig.citizen;
  const severity = getSeverityBadge(issue.severityScore);

  // Truncate long IDs like "RPT-jalan-rusak-20260830-a943" to "RPT-...a943"
  const displayId = (() => {
    const raw = issue.id;
    if (raw.length <= 12) return `#${raw}`;
    return `#${raw.slice(0, 4)}…${raw.slice(-4)}`;
  })();

  // Severity as readable text from backend (ringan/sedang/parah) instead of raw score
  const severityLabel = issue.severity
    ? issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1).toLowerCase()
    : severity.label;

  return (
    <Popup className="fixora-leaflet-popup" minWidth={290} maxWidth={320}>
      <div className="w-[290px] sm:w-[310px] bg-[#161918] text-[#F2F2F0] rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans select-none">
        
        {/* ── 1. Hero Image / No-Photo State ── */}
        <div className="relative w-full h-36 bg-[#0D0F0E] overflow-hidden group">
          {issue.imageUrl ? (
            <img
              src={issue.imageUrl}
              alt={issue.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1B5E20]/10 via-[#0D0F0E] to-[#161918] gap-2">
              <div className="w-14 h-14 rounded-2xl bg-[#1B5E20]/15 border border-[#2E7D32]/20 flex items-center justify-center">
                {category.icon ? (
                  <span className="text-[#81C784]/60 scale-[2]">{category.icon}</span>
                ) : (
                  <MapPinIcon className="w-7 h-7 text-[#81C784]/40" />
                )}
              </div>
              <span className="text-[10px] font-mono text-[#9BA39E]/60 tracking-wider uppercase">
                Tanpa Foto
              </span>
            </div>
          )}

          {/* Image Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161918] via-transparent to-black/30 pointer-events-none" />

          {/* Floating Top Left Category Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md flex items-center gap-1 shadow-md ${category.badgeClass}`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </span>
          </div>

          {/* Floating Bottom Info Bar */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between z-10">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md flex items-center gap-1.5 shadow-md ${status.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
              <span>{status.label}</span>
            </span>

            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border backdrop-blur-md shadow-md inline-flex items-center gap-1 ${source.badgeClass}`}
            >
              <span>{source.icon}</span>
              <span>{source.label}</span>
            </span>
          </div>
        </div>

        {/* ── 2. Content Body ── */}
        <div className="p-3.5 space-y-2.5">
          
          {/* Header: Truncated ID + Coords */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#9BA39E] gap-2">
            <span
              className="font-semibold text-[#81C784] bg-[#1B5E20]/25 px-1.5 py-0.5 rounded border border-[#2E7D32]/40 truncate max-w-[120px]"
              title={issue.id}
            >
              {displayId}
            </span>
            <span className="opacity-80 flex-shrink-0 flex items-center gap-1">
              <MapPinIcon className="w-3 h-3 text-[#9BA39E]" />
              {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-sm text-[#F2F2F0] leading-snug line-clamp-2">
            {issue.title}
          </h3>

          {/* Location if available */}
          {issue.location && (
            <div className="flex items-center gap-1.5 text-xs text-[#9BA39E] truncate">
              <MapPinIcon className="w-3.5 h-3.5 text-[#81C784] flex-shrink-0" />
              <span className="truncate">{issue.location}</span>
            </div>
          )}

          {/* Metric Chips (Severity + Duration) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Severity */}
            <div className="flex flex-col p-2 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C]">
              <span className="text-[9px] font-mono text-[#9BA39E] uppercase tracking-wider">
                Keparahan
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${severity.badgeClass}`}
                >
                  {severityLabel}
                </span>
              </div>
            </div>

            {/* Duration Mangkrak */}
            <div className="flex flex-col p-2 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C]">
              <span className="text-[9px] font-mono text-[#9BA39E] uppercase tracking-wider">
                Durasi Mangkrak
              </span>
              <span
                className={`text-xs font-bold font-mono mt-1 inline-flex items-center gap-1 ${
                  isCritical ? 'text-rose-400' : durationDays > 0 ? 'text-amber-400' : 'text-[#9BA39E]'
                }`}
              >
                <ClockIcon className="w-3 h-3" />
                <span>{durationDays > 0 ? `${durationDays} Hari` : 'Baru'}</span>
              </span>
            </div>
          </div>

          {/* Citizen Verification Counter */}
          {issue.confirmationCount > 0 && (
            <div className="flex items-center justify-between text-[11px] text-[#9BA39E] px-2 py-1.5 rounded-lg bg-[#0D0F0E]/70 border border-[#2E7D32]/25">
              <span className="flex items-center gap-1">
                <CheckIcon className="w-3 h-3 text-[#81C784]" />
                <span>Verifikasi Komunitas:</span>
              </span>
              <span className="font-bold text-[#81C784] font-mono">
                {issue.confirmationCount} warga
              </span>
            </div>
          )}

          {/* ── 3. Action Button ── */}
          <div className="pt-1">
            <Link
              to={`/laporan/${issue.id}`}
              onClick={() => onViewDetail?.(issue)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] hover:from-[#388E3C] hover:to-[#2E7D32] !text-white text-xs font-bold font-heading shadow-[0_4px_18px_rgba(46,125,50,0.35)] flex items-center justify-center gap-2 transition-all active:scale-[0.98] group cursor-pointer border border-[#81C784]/40"
            >
              <span className="!text-white font-bold text-xs tracking-wide">
                Lihat Detail Laporan
              </span>
              <svg
                className="w-4 h-4 !text-white group-hover:translate-x-1 transition-transform flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </Popup>
  );
}
