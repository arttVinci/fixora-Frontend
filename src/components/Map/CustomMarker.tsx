import L from 'leaflet';
import type { IssueCategory, SourceType } from '../../types';

interface CustomMarkerIconProps {
  category: IssueCategory;
  source: SourceType;
  durationDays: number;
  imageUrl?: string;
  title?: string;
}

const categoryColors: Record<IssueCategory, string> = {
  jalan: '#ef4444',
  jembatan: '#F37023',
  sampah: '#22c55e',
  bangunan: '#0077C0',
  drainase: '#06b6d4',
};

const categorySvgIcons: Record<IssueCategory, string> = {
  jalan: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
  </svg>`,
  jembatan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="20" height="20">
    <path d="M3 12h18"/>
    <path d="M3 18V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10"/>
    <path d="M7 12v6M17 12v6M12 12v6"/>
  </svg>`,
  sampah: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="20" height="20">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>`,
  bangunan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" width="20" height="20">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="9" y1="10" x2="9" y2="10.01"/>
    <line x1="15" y1="10" x2="15" y2="10.01"/>
    <line x1="9" y1="14" x2="9" y2="14.01"/>
    <line x1="15" y1="14" x2="15" y2="14.01"/>
    <line x1="9" y1="18" x2="15" y2="18"/>
  </svg>`,
  drainase: `<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>`,
};

const sourceSvgIcons: Record<SourceType, string> = {
  citizen: `<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>`,
  ai_media: `<svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-3.5-6.5l-2 2m-7 7l-2 2m11 0l-2-2m-7-7l-2-2"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`,
};

const getDurationBorderColor = (durationDays: number): string => {
  if (durationDays > 30) return '#EF4444';
  if (durationDays >= 7 && durationDays <= 30) return '#F59E0B';
  return '#10B981';
};

export const createCustomMarkerIcon = ({ category, source, durationDays, imageUrl, title }: CustomMarkerIconProps): L.DivIcon => {
  const color = categoryColors[category];
  const svgIcon = categorySvgIcons[category];
  const sourceSvg = sourceSvgIcons[source];
  const sourceColor = source === 'citizen' ? '#10b981' : '#8b5cf6';
  const borderColor = getDurationBorderColor(durationDays);

  const tooltipHtml = imageUrl ? `
    <div style="
      position: absolute;
      bottom: 58px;
      left: 50%;
      transform: translateX(-50%);
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 6px;
      width: 160px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      z-index: 999;
    " class="marker-hover-tooltip">
      <img src="${imageUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;display:block;" alt="foto laporan"/>
      <div style="color:white;font-size:10px;margin-top:5px;line-height:1.4;font-family:Inter,sans-serif;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
        ${title || 'Laporan Infrastruktur'}
      </div>
    </div>
  ` : '';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="position:relative; width:44px; height:52px;" class="marker-wrapper">
        ${tooltipHtml}
        <div style="
          background-color: ${color};
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(0,0,0,0.35);
          border: 3px solid ${borderColor};
          position: relative;
          color: white;
          cursor: pointer;
        ">
          <div style="
            background-color: white;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${color};
          ">
            ${svgIcon}
          </div>
        </div>
        <div style="
          width: 6px;
          height: 8px;
          background-color: ${color};
          border-bottom-left-radius: 50%;
          border-bottom-right-radius: 50%;
          margin: 0 auto;
        "></div>
        <div style="
          position: absolute;
          bottom: 8px;
          right: -4px;
          background-color: ${sourceColor};
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          color: white;
        ">
          ${sourceSvg}
        </div>
      </div>`,
    iconSize: [44, 52],
    iconAnchor: [22, 52],
    popupAnchor: [0, -52],
  });
};
