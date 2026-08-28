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
  ai_media: 'Media Online',
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
        <h3 className="font-bold text-lg mb-2 text-white">{issue.title}</h3>
        <div className="flex gap-2 mb-2 flex-wrap">
          <span className="px-2 py-1 bg-fixora-primary/20 text-fixora-primary text-xs rounded-full border border-fixora-primary/30">
            {categoryLabels[issue.category]}
          </span>
          <span className="px-2 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full border border-slate-700">
            {sourceLabels[issue.source]}
          </span>
        </div>
        <p className="text-sm text-slate-400 mb-3">
          {issue.description || 'Tidak ada deskripsi.'}
        </p>
        <div className={`text-sm font-medium mb-4 ${isCritical ? 'text-red-400' : 'text-orange-400'}`}>
          Durasi Mangkrak: {durationDays} Hari {isCritical && '⚠️'}
        </div>
        <button
          onClick={() => onViewDetail(issue)}
          className="w-full bg-fixora-primary text-white py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all"
        >
          Lihat Detail
        </button>
      </div>
    </Popup>
  );
}
