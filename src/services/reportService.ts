import type {
  IssueCategory,
  SeverityLevel,
  ReportSubmission,
  IssueReport,
  BackendSeverity,
} from '../types';
import type { ApiCategoryResponse } from '../types/api';
import {
  fetchCategories,
  analyzePhoto as analyzePhotoApi,
  createReport as createReportApi,
} from './reportApiService';
import {
  slugToCategory,
  categoryToSlug,
  severityToBackend,
  backendSeverityToLevel,
} from './categoryMapping';

export interface AnalyzePhotoResult {
  sessionId: string;
  photoUrl: string;
  title: string;
  description: string;
  category: IssueCategory;
  categorySlug: string;
  severity: SeverityLevel;
  backendSeverity: BackendSeverity;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  reason?: string | null;
  isRelevant: boolean;
}

let categoryCache: ApiCategoryResponse[] | null = null;

async function getCategoriesCached(): Promise<ApiCategoryResponse[]> {
  if (!categoryCache) {
    categoryCache = await fetchCategories();
  }
  return categoryCache;
}

export async function resolveCategoryId(category: IssueCategory): Promise<string> {
  const slug = categoryToSlug(category);
  const categories = await getCategoriesCached();
  const match = categories.find((c) => c.slug === slug);
  if (!match) {
    throw new Error(`Kategori "${category}" belum tersedia pada sistem backend`);
  }
  return match.id;
}

/** Analyze a photo via the backend CV classifier (multipart upload). */
export async function analyzePhoto(file: File): Promise<AnalyzePhotoResult> {
  const result = await analyzePhotoApi(file);
  return {
    sessionId: result.session_id,
    photoUrl: result.photo_url,
    title: result.title,
    description: result.description,
    category: slugToCategory(result.category),
    categorySlug: result.category,
    severity: backendSeverityToLevel(result.severity),
    backendSeverity: result.severity as BackendSeverity,
    location: result.location ?? null,
    latitude: result.latitude ?? null,
    longitude: result.longitude ?? null,
    address: result.address ?? null,
    reason: result.reason ?? null,
    isRelevant: result.is_relevant,
  };
}

/** Submit a report through `POST /reports/` using a staged photo session. */
export async function submitReport(data: ReportSubmission): Promise<IssueReport> {
  if (!data.latitude || !data.longitude) {
    throw new Error('Lokasi laporan belum ditentukan');
  }
  if (!data.stagingSessionId) {
    throw new Error('Foto belum dianalisis oleh sistem');
  }

  const categoryId = await resolveCategoryId(data.finalCategory);

  const title = (data.title || data.description || 'Laporan Warga').trim().slice(0, 200);

  return createReportApi({
    category_id: categoryId,
    title,
    description: data.description,
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.locationLabel,
    severity: severityToBackend(data.finalSeverity),
    staging_session_id: data.stagingSessionId,
    reporter_email: data.reporterEmail?.trim() || undefined,
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Selamat pagi';
  if (hour >= 12 && hour < 15) return 'Selamat siang';
  if (hour >= 15 && hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}
