import InteractiveMap from '../Map/InteractiveMap';
import type { IssueReport } from '../../types';
import type { MapBounds } from '../../types/api';
import { MapPinIcon } from '../Icons';
import Reveal from '../Reveal';

type MapSectionProps = {
  issues: IssueReport[];
  onAddIssue?: (issue: IssueReport) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
};

export default function MapSection({ issues, onAddIssue, onBoundsChange }: MapSectionProps) {
  return (
    <section
      id="map"
      className="relative bg-dark-surface-low"
    >
      <Reveal className="py-16 sm:py-24 text-center px-4">
        <div className="inline-flex items-center gap-2 badge-primary mb-4">
          <MapPinIcon className="w-4 h-4" />
          <span>Peta Interaktif</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
          Lihat Laporan di Sekitarmu
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Jelajahi peta untuk melihat infrastruktur mangkrak yang dilaporkan oleh warga.
          Gunakan sidebar untuk melihat daftar dan statistik laporan.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="relative h-[600px] sm:h-[700px] w-full overflow-hidden border-y border-white/10">
        <InteractiveMap
          issues={issues}
          onAddIssue={onAddIssue}
          onBoundsChange={onBoundsChange}
        />
      </Reveal>

      <div className="py-6 text-center">
        <p className="text-slate-500 text-sm">
          Klik marker di peta atau laporan di sidebar untuk melihat detail
        </p>
      </div>
    </section>
  );
}
