import { fetchApi, buildQueryString } from './api';
import type {
  ApiReportMapResponse,
  ApiReportDetailResponse,
  ApiCategoryResponse,
  ApiAnalyzePhotoResponse,
  ApiVerificationSessionResponse,
  CreateReportPayload,
  MapBounds,
} from '../types/api';
import type { IssueReport, SourceType } from '../types';
import { slugToCategory } from './categoryMapping';

function severityToScore(severity: string): number {
  const map: Record<string, number> = {
    ringan: 3,
    rendah: 3,
    sedang: 6,
    parah: 9,
    tinggi: 8,
    kritis: 10,
  };
  return map[severity.toLowerCase()] ?? 5;
}

function sourceToSourceType(source: string): SourceType {
  const s = source.toLowerCase();
  if (s === 'users' || s === 'user' || s === 'user_report' || s === 'citizen') return 'citizen';
  if (s === 'government_data' || s === 'government' || s === 'gov') return 'government_data';
  return 'ai_media';
}

function toIssueReport(api: ApiReportMapResponse): IssueReport {
  return {
    id: api.id,
    title: api.title,
    category: slugToCategory(api.category_slug),
    categorySlug: api.category_slug,
    severityScore: severityToScore(api.severity),
    severity: api.severity,
    status: api.status,
    source: sourceToSourceType(api.source),
    rawSource: api.source,
    imageUrl: api.photo_url || undefined,
    latitude: api.latitude,
    longitude: api.longitude,
    reportedAt: new Date().toISOString(),
    lastConfirmedAt: new Date().toISOString(),
    confirmationCount: 0,
  };
}

export function toDetailIssueReport(api: ApiReportDetailResponse): IssueReport {
  const cat = slugToCategory(api.category_slug);
  const source = sourceToSourceType(api.source);
  const reportedAt = api.first_reported_at || new Date().toISOString();
  const lastConfirmedAt = api.last_confirmed_at || reportedAt;

  return {
    id: api.id,
    title: api.title,
    description: api.description || undefined,
    category: cat,
    categoryName: api.category_name || undefined,
    categorySlug: api.category_slug,
    severityScore: severityToScore(api.severity || 'sedang'),
    severity: api.severity,
    status: api.status,
    source,
    rawSource: api.source,
    sourceUrl: api.source_url,
    imageUrl: api.photo_url || undefined,
    additionalPhotos: api.additional_photos ? api.additional_photos : undefined,
    latitude: api.latitude,
    longitude: api.longitude,
    location: api.address || 'Lokasi Terdaftar',
    address: api.address || undefined,
    reportedAt,
    firstReportedAt: api.first_reported_at || undefined,
    lastConfirmedAt,
    confirmationCount: Number(api.total_confirmations) || 0,
    totalConfirmations: Number(api.total_confirmations) || 0,
    mergedIntoId: api.merged_into_id,
    relatedReports: api.related_reports
      ? api.related_reports.map(toIssueReport)
      : undefined,
  };
}

export async function fetchMapReports(bounds: MapBounds): Promise<IssueReport[]> {
  const qs = buildQueryString({
    min_lat: bounds.minLat,
    max_lat: bounds.maxLat,
    min_lng: bounds.minLng,
    max_lng: bounds.maxLng,
  });

  const data = await fetchApi<ApiReportMapResponse[]>(`/reports/map${qs}`);
  return data.map(toIssueReport);
}

export async function fetchReportDetail(id: string): Promise<IssueReport> {
  const data = await fetchApi<ApiReportDetailResponse>(`/reports/${id}`);
  return toDetailIssueReport(data);
}

export async function fetchCategories(): Promise<ApiCategoryResponse[]> {
  return fetchApi<ApiCategoryResponse[]>('/categories/');
}

export async function analyzePhoto(file: File): Promise<ApiAnalyzePhotoResponse> {
  const form = new FormData();
  form.append('photo', file);
  return fetchApi<ApiAnalyzePhotoResponse>('/reports/analyze-photo', {
    method: 'POST',
    body: form,
  });
}

export async function createReport(payload: CreateReportPayload): Promise<IssueReport> {
  const data = await fetchApi<ApiReportDetailResponse>('/reports/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return toDetailIssueReport(data);
}

export async function confirmReport(id: string): Promise<void> {
  await fetchApi<null>(`/reports/${id}/confirm`, { method: 'POST' });
}

export async function triggerCrawler(): Promise<void> {
  await fetchApi<null>('/crawl/trigger', { method: 'POST' });
}

export async function triggerVerification(reportId: string): Promise<ApiVerificationSessionResponse> {
  return fetchApi<ApiVerificationSessionResponse>(`/crawl/verify/trigger/${reportId}`, {
    method: 'POST',
  });
}

export async function retryVerification(sessionId: string): Promise<ApiVerificationSessionResponse> {
  return fetchApi<ApiVerificationSessionResponse>(`/crawl/verify/retry/${sessionId}`, {
    method: 'POST',
  });
}

export async function getVerificationSessions(reportId: string): Promise<ApiVerificationSessionResponse[]> {
  return fetchApi<ApiVerificationSessionResponse[]>(`/crawl/verify/sessions/${reportId}`);
}
