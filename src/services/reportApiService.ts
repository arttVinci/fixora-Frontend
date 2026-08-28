import { fetchApi, buildQueryString } from './api';
import type { ApiReportMapResponse, MapBounds, ApiCategory, ApiAnalyzePhotoResponse, ApiCreateReportRequest, ApiReportDetailResponse } from '../types/api';
import type { IssueReport, IssueCategory, SourceType } from '../types';

function severityToScore(severity: 'ringan' | 'sedang' | 'parah'): number {
  const map: Record<string, number> = {
    ringan: 3,
    sedang: 6,
    parah: 9,
  };
  return map[severity] ?? 5;
}

function sourceToSourceType(source: string): SourceType {
  if (source === 'users' || source === 'user' || source === 'user_report') return 'citizen';
  return 'ai_media';
}

function mapStatus(status: string): IssueReport['status'] {
  const statusMap: Record<string, IssueReport['status']> = {
    pending_verification: 'new',
    verified: 'open',
    in_progress: 'open',
    resolved: 'closed',
    rejected: 'archived',
    merged: 'archived',
  };
  return statusMap[status] ?? 'new';
}

function slugToCategory(slug: string): IssueCategory {
  if (slug.startsWith('jalan')) return 'jalan';
  if (slug.startsWith('jembatan')) return 'jembatan';
  if (slug.startsWith('sampah')) return 'sampah';
  if (slug.startsWith('bangunan') || slug.startsWith('gedung') || slug.startsWith('fasilitas')) return 'bangunan';
  if (slug.startsWith('drainase') || slug.startsWith('saluran') || slug.startsWith('sungai')) return 'drainase';
  return 'jalan';
}

function toIssueReport(api: ApiReportMapResponse): IssueReport {
  return {
    id: api.id,
    title: api.title,
    category: slugToCategory(api.category_slug),
    severityScore: severityToScore(api.severity),
    status: mapStatus(api.status),
    source: sourceToSourceType(api.source),
    imageUrl: api.photo_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    latitude: api.latitude,
    longitude: api.longitude,
    reportedAt: new Date().toISOString(),
    lastConfirmedAt: new Date().toISOString(),
    confirmationCount: 0,
    statusHistory: [
      {
        status: mapStatus(api.status),
        timestamp: new Date().toISOString(),
        message: 'Data diambil dari database.',
      },
    ],
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

export async function triggerCrawler(): Promise<void> {
  await fetchApi<null>('/crawl/trigger', { method: 'POST' });
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  return fetchApi<ApiCategory[]>('/categories/');
}

export async function analyzePhoto(file: File): Promise<ApiAnalyzePhotoResponse> {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/reports/analyze-photo', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Gagal menganalisis foto: ${response.statusText}`);
  }

  const body = await response.json();
  if (!body.success) {
    throw new Error(body.message || 'Gagal menganalisis foto');
  }

  return body.data;
}

export async function createReport(payload: ApiCreateReportRequest): Promise<ApiReportDetailResponse> {
  const response = await fetch('/api/reports/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = await response.json();

  if (!response.ok || !body.success) {
    throw new Error(body.message || `Gagal mengirim laporan (HTTP ${response.status})`);
  }

  return body.data as ApiReportDetailResponse;
}
