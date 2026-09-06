import type { IssueCategory, IssueReport } from '../types';
import { getDurationDays } from './dateUtils';

export function isUnresolvedStatus(status?: string | null): boolean {
  if (!status) return true;
  const s = status.toLowerCase().trim();
  return s !== 'resolved' && s !== 'closed' && s !== 'selesai' && s !== 'archived' && s !== 'rejected';
}

export function isCriticalReport(issue: IssueReport): boolean {
  return isUnresolvedStatus(issue.status) && getDurationDays(issue.reportedAt) > 30;
}

export type ReportStats = {
  totalReports: number;
  criticalReports: number;
  resolvedReports: number;
  resolutionRate: number;
  activeReports: number;
  categoryCounts: Record<IssueCategory, number>;
};

export function computeReportStats(issues: IssueReport[]): ReportStats {
  const totalReports = issues.length;
  const criticalReports = issues.filter(isCriticalReport).length;
  const resolvedReports = issues.filter((i) => {
    const s = i.status?.toLowerCase().trim();
    return s === 'resolved' || s === 'closed' || s === 'selesai';
  }).length;
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
  const activeReports = issues.filter((i) => isUnresolvedStatus(i.status)).length;

  const categoryCounts: Record<IssueCategory, number> = {
    jalan: 0,
    jembatan: 0,
    sampah: 0,
    bangunan: 0,
    drainase: 0,
  };
  for (const issue of issues) {
    categoryCounts[issue.category]++;
  }

  return {
    totalReports,
    criticalReports,
    resolvedReports,
    resolutionRate,
    activeReports,
    categoryCounts,
  };
}
