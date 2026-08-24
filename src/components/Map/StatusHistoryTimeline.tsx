import type { StatusHistory } from '../../types';

const statusConfig = {
  new: { label: 'New', color: 'bg-yellow-500', textColor: 'text-yellow-400', icon: '🔵', dot: 'bg-yellow-400' },
  open: { label: 'Open', color: 'bg-orange-500', textColor: 'text-orange-400', icon: '🟠', dot: 'bg-orange-400' },
  closed: { label: 'Closed', color: 'bg-green-500', textColor: 'text-green-400', icon: '✅', dot: 'bg-green-400' },
  archived: { label: 'Archived', color: 'bg-slate-500', textColor: 'text-slate-400', icon: '📦', dot: 'bg-slate-400' },
};

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

interface StatusHistoryTimelineProps {
  history: StatusHistory[];
}

export default function StatusHistoryTimeline({ history }: StatusHistoryTimelineProps) {
  const reversed = [...history].reverse();

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
        Riwayat Status
      </h4>
      <div className="relative">
        {reversed.map((item, index) => {
          const config = statusConfig[item.status];
          const isLast = index === reversed.length - 1;
          return (
            <div key={index} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 ${config.color} bg-opacity-20 border-2 border-opacity-50`}
                  style={{ borderColor: config.dot.replace('bg-', '') }}>
                  <div className={`w-3 h-3 rounded-full ${config.dot}`}></div>
                </div>
                {!isLast && <div className="w-px flex-1 bg-white/10 my-1"></div>}
              </div>
              <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                <div className={`text-sm font-bold mb-0.5 ${config.textColor}`}>
                  {config.label}
                </div>
                <div className="text-xs text-slate-500 mb-1">
                  {formatDateTime(item.timestamp)}
                </div>
                <div className="text-sm text-slate-300">
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
