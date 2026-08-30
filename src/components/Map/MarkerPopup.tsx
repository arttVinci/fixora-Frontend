import { Popup } from 'react-leaflet';
import type { IssueReport } from '../../types';
import { getDurationDays } from '../../utils/dateUtils';

interface MarkerPopupProps {
  issue: IssueReport;
  onViewDetail: (issue: IssueReport) => void;
}

const categoryLabels: Record<IssueReport['category'], string> = {
  jalan: 'Jalan Rusak',
  jembatan: 'Jembatan Rawan',
  sampah: 'Sampah Menumpuk',
  bangunan: 'Bangunan Terbengkalai',
  drainase: 'Drainase Tersumbat',
};

const sourceLabels: Record<IssueReport['source'], string> = {
  citizen: 'Laporan Warga',
  ai_media: 'Terdeteksi AI (Media)',
};

export default function MarkerPopup({ issue, onViewDetail }: MarkerPopupProps) {
  const durationDays = getDurationDays(issue.reportedAt);
  const isCritical = durationDays > 30;

  return (
    <Popup className="fixora-leaflet-popup">
      <div className="w-56 sm:w-64">
        <img
          src={issue.imageUrl}
          alt={issue.title}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <h3 className="font-bold text-lg mb-2 text-[#F2F2F0]">{issue.title}</h3>
        <div className="flex gap-2 mb-2 flex-wrap">
          <span className="px-2 py-1 bg-[#1B5E20]/30 text-[#81C784] text-xs rounded-full border border-[#2E7D32]/40">
            {categoryLabels[issue.category]}
          </span>
          <span className="px-2 py-1 bg-[#0D0F0E] text-[#9BA39E] text-xs rounded-full border border-[#2A2E2C]">
            {sourceLabels[issue.source]}
          </span>
        </div>
        <p className="text-sm text-[#9BA39E] mb-3">
          {issue.description || 'Tidak ada deskripsi.'}
        </p>
        <div className={`text-sm font-medium mb-4 ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
          Durasi Mangkrak: {durationDays} Hari {isCritical && '(Kritis)'}
        </div>
        <button
          onClick={() => onViewDetail(issue)}
          className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          Lihat Detail
        </button>
      </div>
    </Popup>
  );
}
