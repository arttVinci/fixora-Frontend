import type { IssueCategory, SeverityLevel, ReportSubmission, IssueReport } from '../types';
import { mockIssueReports } from './mockData';

type ClassificationResult = {
  category: IssueCategory;
  severity: SeverityLevel;
  confidence: number;
  description: string;
};

const CATEGORY_MESSAGES: Record<IssueCategory, string[]> = {
  jalan: ['jalan rusak/berlubang', 'permukaan jalan retak', 'jalan bergelombang'],
  jembatan: ['kerusakan jembatan', 'struktur jembatan bermasalah'],
  sampah: ['penumpukan sampah', 'tempat pembuangan liar'],
  bangunan: ['bangunan rusak/ambruk', 'fasilitas umum rusak'],
  drainase: ['saluran tersumbat', 'drainase bocor/meluap'],
};

const SEVERITY_LABELS: SeverityLevel[] = ['rendah', 'sedang', 'tinggi', 'kritis'];

export async function simulateCvClassifier(imageFile: File): Promise<ClassificationResult> {
  await new Promise(resolve => setTimeout(resolve, 2200));

  const filename = imageFile.name.toLowerCase();
  let category: IssueCategory = 'jalan';
  if (filename.includes('sampah') || filename.includes('trash')) category = 'sampah';
  else if (filename.includes('jembatan') || filename.includes('bridge')) category = 'jembatan';
  else if (filename.includes('drainase') || filename.includes('drain')) category = 'drainase';
  else if (filename.includes('bangunan') || filename.includes('building')) category = 'bangunan';
  else {
    const cats: IssueCategory[] = ['jalan', 'jalan', 'sampah', 'drainase', 'jembatan', 'bangunan'];
    category = cats[Math.floor(Math.random() * cats.length)];
  }

  const severityIdx = Math.floor(Math.random() * SEVERITY_LABELS.length);
  const severity = SEVERITY_LABELS[severityIdx];
  const confidence = Math.round(75 + Math.random() * 20);
  const msgs = CATEGORY_MESSAGES[category];
  const description = msgs[Math.floor(Math.random() * msgs.length)];

  return { category, severity, confidence, description };
}

let reportCounter = mockIssueReports.length + 1;

export function submitReport(data: ReportSubmission): IssueReport {
  const id = `${String(reportCounter).padStart(3, '0')}-2025`;
  reportCounter++;
  const severityScoreMap: Record<SeverityLevel, number> = {
    rendah: 3,
    sedang: 6,
    tinggi: 8,
    kritis: 10,
  };

  const newReport: IssueReport = {
    id,
    title: `Laporan ${data.finalCategory.charAt(0).toUpperCase() + data.finalCategory.slice(1)} — ${data.locationLabel || 'Lokasi tidak diketahui'}`,
    description: data.description || '',
    category: data.finalCategory,
    severityScore: severityScoreMap[data.finalSeverity],
    status: 'new' as const,
    source: 'citizen' as const,
    imageUrl: data.imagePreviewUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    latitude: data.latitude || -6.2088,
    longitude: data.longitude || 106.8456,
    reportedAt: new Date().toISOString(),
    lastConfirmedAt: new Date().toISOString(),
    confirmationCount: 1,
    location: data.locationLabel || 'Lokasi tidak diketahui',
    statusHistory: [
      {
        status: 'new' as const,
        timestamp: new Date().toISOString(),
        message: 'Laporan baru diterima. Konfirmasi akan dikirim ke email Anda.',
      },
    ],
  };

  return newReport;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Selamat pagi';
  if (hour >= 12 && hour < 15) return 'Selamat siang';
  if (hour >= 15 && hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}
