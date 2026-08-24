export type IssueCategory = 'jalan' | 'jembatan' | 'sampah' | 'bangunan' | 'drainase';
export type IssueStatus = 'new' | 'open' | 'closed' | 'archived';
export type SourceType = 'citizen' | 'ai_media';
export type SeverityLevel = 'rendah' | 'sedang' | 'tinggi' | 'kritis';

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
}

export interface StatusHistory {
  status: IssueStatus;
  timestamp: string;
  message: string;
}

export interface IssueReport {
  id: string;
  title: string;
  description?: string;
  category: IssueCategory;
  severityScore: number;
  status: IssueStatus;
  source: SourceType;
  imageUrl: string;
  latitude: number;
  longitude: number;
  reportedAt: string;
  lastConfirmedAt: string;
  confirmationCount: number;
  location?: string;
  statusHistory: StatusHistory[];
}
