export type IssueCategory = 'jalan' | 'jembatan' | 'sampah' | 'bangunan' | 'drainase';
export type IssueStatus = 'mangkrak' | 'dalam_perbaikan' | 'selesai';
export type SourceType = 'citizen' | 'ai_media';

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
}
