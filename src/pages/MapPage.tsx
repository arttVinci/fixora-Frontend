import type { IssueReport } from '../types';
import type { MapBounds } from '../types/api';
import InteractiveMap from '../components/Map/InteractiveMap';

interface MapPageProps {
  issues: IssueReport[];
  onAddIssue: (issue: IssueReport) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  onNavigateHome?: () => void;
}

export default function MapPage({
  issues,
  onAddIssue,
  onBoundsChange,
}: MapPageProps) {
  return (
    <div className="relative w-full h-full bg-[#0D0F0E] overflow-hidden">
      <InteractiveMap
        issues={issues}
        onAddIssue={onAddIssue}
        onBoundsChange={onBoundsChange}
      />
    </div>
  );
}
