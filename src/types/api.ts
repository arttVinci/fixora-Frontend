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
