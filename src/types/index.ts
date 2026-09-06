export type IssueCategory = 'jalan' | 'jembatan' | 'sampah' | 'bangunan' | 'drainase';
export type IssueStatus = string;
export type SourceType = 'citizen' | 'ai_media' | 'government_data';
export type SeverityLevel = 'rendah' | 'sedang' | 'tinggi' | 'kritis';
export type BackendSeverity = 'ringan' | 'sedang' | 'parah';

export interface ReportSubmission {
  reporterName: string;
  reporterEmail: string;
  imageFile?: File;
  imagePreviewUrl?: string;
  aiCategory?: IssueCategory;
  aiSeverity?: SeverityLevel;
  finalCategory: IssueCategory;
  finalSeverity: SeverityLevel;
  latitude?: number;
  longitude?: number;
  locationMethod: 'gps' | 'manual' | null;
  locationLabel?: string;
  description?: string;
  title?: string;
  stagingSessionId?: string;
}

export interface StatusHistory {
  status: string;
  timestamp: string;
  message: string;
}

export interface IssueReport {
  id: string;
  title: string;
  description?: string;
  category: IssueCategory;
  categoryName?: string;
  categorySlug?: string;
  severityScore: number;
  severity?: string;
  status: string;
  source: SourceType;
  rawSource?: string;
  sourceUrl?: string | null;
  imageUrl?: string;
  additionalPhotos?: string[];
  latitude: number;
  longitude: number;
  reportedAt: string;
  firstReportedAt?: string;
  lastConfirmedAt: string;
  confirmationCount: number;
  totalConfirmations?: number;
  location?: string;
  address?: string;
  mergedIntoId?: string | null;
  relatedReports?: IssueReport[];
  statusHistory?: StatusHistory[];
}
