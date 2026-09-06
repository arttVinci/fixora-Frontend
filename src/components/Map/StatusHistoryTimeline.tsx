import type { StatusHistory } from '../../types';
import { getStatusBadge } from '../../utils/statusUtils';

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

interface StatusHistoryTimelineProps {
  history?: StatusHistory[];
}

export default function StatusHistoryTimeline({ history = [] }: StatusHistoryTimelineProps) {
  if (!history || history.length === 0) return null;
  const reversed = [...history].reverse();

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-[#9BA39E] uppercase tracking-wider mb-4 font-mono">
        Riwayat Status
      </h4>
      <div className="relative">
        {reversed.map((item, index) => {
          const config = getStatusBadge(item.status);
          const isLast = index === reversed.length - 1;
          return (
            <div key={index} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 ${config.color} bg-opacity-20 border-2 border-opacity-50`}
                  style={{ borderColor: config.dot.replace('bg-', '') }}>
                  <div className={`w-3 h-3 rounded-full ${config.dot}`}></div>
                </div>
                {!isLast && <div className="w-px flex-1 bg-[#2A2E2C] my-1"></div>}
              </div>
              <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                <div className={`text-sm font-bold mb-0.5 ${config.textColor}`}>
                  {config.label}
                </div>
                <div className="text-xs text-[#9BA39E]/80 mb-1">
                  {formatDateTime(item.timestamp)}
                </div>
                <div className="text-sm text-[#F2F2F0]">
                  {item.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
