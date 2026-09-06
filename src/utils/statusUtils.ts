/**
 * Utility functions to handle and display report statuses directly from API payload.
 */

export function formatStatusLabel(status?: string | null): string {
  if (!status) return '-';
  const clean = status.trim();
  if (!clean) return '-';

  return clean
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export interface StatusBadgeStyle {
  label: string;
  badge: string;
  badgeClass: string;
  dot: string;
  dotClass: string;
  textColor: string;
  color: string;
}

export function getStatusBadge(status?: string | null): StatusBadgeStyle {
  const raw = status || '';
  const s = raw.toLowerCase().trim();
  const label = formatStatusLabel(raw);

  if (s === 'resolved' || s === 'closed' || s === 'selesai') {
    return {
      label,
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-400',
      dotClass: 'bg-emerald-400',
      textColor: 'text-emerald-400',
      color: 'bg-emerald-500',
    };
  }

  if (s === 'pending_verification' || s === 'new' || s === 'menunggu_verifikasi') {
    return {
      label,
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dot: 'bg-amber-400 animate-pulse',
      dotClass: 'bg-amber-400 animate-pulse',
      textColor: 'text-amber-400',
      color: 'bg-amber-500',
    };
  }

  if (s === 'verified' || s === 'terverifikasi') {
    return {
      label,
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      dot: 'bg-blue-400',
      dotClass: 'bg-blue-400',
      textColor: 'text-blue-400',
      color: 'bg-blue-500',
    };
  }

  if (s === 'in_progress' || s === 'open' || s === 'sedang_ditangani') {
    return {
      label,
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      dot: 'bg-rose-400 animate-pulse',
      dotClass: 'bg-rose-400 animate-pulse',
      textColor: 'text-rose-400',
      color: 'bg-rose-500',
    };
  }

  if (s === 'rejected' || s === 'ditolak') {
    return {
      label,
      badge: 'bg-red-500/15 text-red-300 border-red-500/30',
      badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30',
      dot: 'bg-red-400',
      dotClass: 'bg-red-400',
      textColor: 'text-red-400',
      color: 'bg-red-500',
    };
  }

  if (s === 'merged' || s === 'archived' || s === 'digabung' || s === 'diarsipkan') {
    return {
      label,
      badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      dot: 'bg-slate-400',
      dotClass: 'bg-slate-400',
      textColor: 'text-slate-400',
      color: 'bg-slate-500',
    };
  }

  return {
    label,
    badge: 'bg-[#161918] text-[#9BA39E] border-[#2A2E2C]',
    badgeClass: 'bg-[#161918] text-[#9BA39E] border-[#2A2E2C]',
    dot: 'bg-[#9BA39E]',
    dotClass: 'bg-[#9BA39E]',
    textColor: 'text-[#9BA39E]',
    color: 'bg-[#2A2E2C]',
  };
}
