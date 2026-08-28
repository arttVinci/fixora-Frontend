export interface ApiCreateReportRequest {
  category_id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  severity: 'ringan' | 'sedang' | 'parah';
  primary_photo_url: string;
  reporter_email?: string;
}

export interface ApiReportDetailResponse {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  severity: 'ringan' | 'sedang' | 'parah';
  status: string;
  source: string;
  category_id: string;
  category_slug: string;
  created_at: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ApiAnalyzePhotoResponse {
  title: string;
  description: string;
  category: string;
  severity: 'ringan' | 'sedang' | 'parah';
  is_relevant: boolean;
}

export interface WebResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ApiReportMapResponse {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  severity: 'ringan' | 'sedang' | 'parah';
  category_slug: string;
  status: string;
  photo_url: string;
  source: string;
}

export interface MapReportQuery {
  min_lat: number;
  max_lat: number;
  min_lng: number;
  max_lng: number;
  category_id?: string;
  status?: string;
  severity?: 'ringan' | 'sedang' | 'parah';
  source?: string;
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
