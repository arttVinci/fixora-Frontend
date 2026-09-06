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
  severity: string;
  category_slug: string;
  status: string;
  photo_url: string;
  source: string;
}

export interface ApiReportDetailResponse {
  id: string;
  title: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  address?: string | null;
  severity: string;
  status: string;
  source: string;
  source_url?: string | null;
  category_name: string;
  category_slug: string;
  photo_url?: string | null;
  additional_photos?: string[] | null;
  total_confirmations: number;
  merged_into_id?: string | null;
  related_reports?: ApiReportMapResponse[] | null;
  first_reported_at?: string | null;
  last_confirmed_at?: string | null;
}

export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface ApiCategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface ApiAnalyzePhotoResponse {
  session_id: string;
  photo_url: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  reason?: string | null;
  is_relevant: boolean;
}

export type IssueAnalysisResultResponse = ApiAnalyzePhotoResponse;

export interface CreateReportPayload {
  category_id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  address?: string;
  severity: string;
  staging_session_id: string;
  reporter_email?: string;
}

export interface ApiVerificationLogResponse {
  id: string;
  session_id: string;
  agent_role: string;
  llm_provider: string;
  llm_model: string;
  verdict?: boolean | null;
  confidence: number;
  category_slug?: string | null;
  severity?: string | null;
  raw_argument: string;
  prompt_used: string;
  latency_ms: number;
  error_message?: string | null;
  created_at?: string | null;
}

export interface ApiVerificationSessionResponse {
  id: string;
  report_id: string;
  status: string;
  final_verdict?: boolean | null;
  final_category_slug?: string | null;
  final_severity?: string | null;
  final_reasoning?: string | null;
  reject_reason?: string | null;
  decided_by?: string | null;
  skip_reason?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  logs?: ApiVerificationLogResponse[] | null;
}

