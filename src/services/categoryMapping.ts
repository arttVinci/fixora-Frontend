import type { IssueCategory, SeverityLevel, BackendSeverity } from '../types';

/**
 * Map a backend category slug to the frontend's IssueCategory union.
 * Backend slugs: sampah, jalan-rusak, jembatan-rusak, bangunan-terbengkalai.
 */
export function slugToCategory(slug: string): IssueCategory {
  const s = slug.toLowerCase();
  if (s.startsWith('jalan')) return 'jalan';
  if (s.startsWith('jembatan')) return 'jembatan';
  if (s.startsWith('sampah')) return 'sampah';
  if (s.startsWith('bangunan') || s.startsWith('gedung') || s.startsWith('fasilitas')) return 'bangunan';
  if (s.startsWith('drainase') || s.startsWith('saluran') || s.startsWith('sungai')) return 'drainase';
  return 'jalan';
}

/**
 * Map a frontend IssueCategory to its backend category slug.
 * `drainase` has no backend counterpart (seeded categories are 4); it returns a
 * placeholder slug so `resolveCategoryId` can produce a clear error.
 */
export function categoryToSlug(category: IssueCategory): string {
  switch (category) {
    case 'jalan':
      return 'jalan-rusak';
    case 'jembatan':
      return 'jembatan-rusak';
    case 'sampah':
      return 'sampah';
    case 'bangunan':
      return 'bangunan-terbengkalai';
    case 'drainase':
      return 'drainase';
  }
}

/** Map frontend severity to the backend `ringan|sedang|parah` contract. */
export function severityToBackend(severity: SeverityLevel): BackendSeverity {
  switch (severity) {
    case 'rendah':
      return 'ringan';
    case 'sedang':
      return 'sedang';
    case 'tinggi':
    case 'kritis':
      return 'parah';
  }
}

/** Map a backend severity string back to a frontend SeverityLevel. */
export function backendSeverityToLevel(severity: string): SeverityLevel {
  switch (severity.toLowerCase()) {
    case 'ringan':
      return 'rendah';
    case 'sedang':
      return 'sedang';
    case 'parah':
      return 'tinggi';
    default:
      return 'sedang';
  }
}
