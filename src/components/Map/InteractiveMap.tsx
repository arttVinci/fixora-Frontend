import { useState, useCallback, useEffect, useRef } from 'react';
import type { MapBounds } from '../../types/api';
import {
  MapPinIcon,
  SearchIcon,
  CameraIcon,
  LocationTargetIcon,
  FlameIcon,
  SunIcon,
  MoonIcon,
} from '../Icons';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { IssueReport, IssueCategory, SourceType } from '../../types';
import { createCustomMarkerIcon } from './CustomMarker';
import MarkerPopup from './MarkerPopup';
import MapSidebar from './MapSidebar';
import ReportDetailModal from './ReportDetailModal';
import PhotoReportModal from './PhotoReportModal';
import PinReportModal from './PinReportModal';
import HeatmapLayer from './HeatmapLayer';
import { getDurationDays } from '../../utils/dateUtils';

export interface FilterState {
  categories: IssueCategory[];
  duration: 'all' | 'lt7' | '7to30' | 'gt30';
  source: 'all' | SourceType;
}

const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];
const DEFAULT_ZOOM = 12;

interface InteractiveMapProps {
  issues: IssueReport[];
  onViewDetail?: (issue: IssueReport) => void;
  externalFilters?: FilterState;
  onExternalFiltersChange?: (filters: FilterState) => void;
  onAddIssue?: (issue: IssueReport) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
}

function MapControlsHelper({
  onRegisterFlyTo
}: {
  onRegisterFlyTo: (flyFn: (lat: number, lng: number) => void, zoomInFn: () => void, zoomOutFn: () => void) => void
}) {
  const map = useMap();

  useEffect(() => {
    onRegisterFlyTo(
      (lat: number, lng: number) => map.flyTo([lat, lng], 15, { animate: true }),
      () => map.zoomIn(),
      () => map.zoomOut()
    );
  }, [map, onRegisterFlyTo]);

  return null;
}

function BoundsWatcher({ onBoundsChange }: { onBoundsChange?: (bounds: MapBounds) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const map = useMapEvents({
    moveend() {
      if (!onBoundsChange) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const b = map.getBounds();
        onBoundsChange({
          minLat: b.getSouth(),
          maxLat: b.getNorth(),
          minLng: b.getWest(),
          maxLng: b.getEast(),
        });
      }, 600);
    },
  });

  return null;
}

function MapClickHandler({
  isPinMode,
  onMapClick,
}: {
  isPinMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) {
      if (isPinMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  useEffect(() => {
    map.getContainer().style.cursor = isPinMode ? 'crosshair' : '';
  }, [isPinMode, map]);

  return null;
}

export default function InteractiveMap({ issues, externalFilters, onAddIssue, onBoundsChange }: InteractiveMapProps) {
  const [internalFilters] = useState<FilterState>({
    categories: ['jalan', 'jembatan', 'sampah', 'bangunan', 'drainase'],
    duration: 'all',
    source: 'all',
  });
  const [selectedIssue, setSelectedIssue] = useState<IssueReport | null>(null);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [isHeatmapEnabled, setIsHeatmapEnabled] = useState(true);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');

  const flyToRef = useRef<((lat: number, lng: number) => void) | null>(null);
  const zoomInRef = useRef<(() => void) | null>(null);
  const zoomOutRef = useRef<(() => void) | null>(null);

  const flyToFn = useCallback((lat: number, lng: number) => flyToRef.current?.(lat, lng), []);
  const zoomInFn = useCallback(() => zoomInRef.current?.(), []);
  const zoomOutFn = useCallback(() => zoomOutRef.current?.(), []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setPinLocation({ lat, lng });
    setIsPinMode(false);
  }, []);

  const handleRegisterFlyTo = useCallback(
    (fly: (lat: number, lng: number) => void, inFn: () => void, outFn: () => void) => {
      flyToRef.current = fly;
      zoomInRef.current = inFn;
      zoomOutRef.current = outFn;
    },
    []
  );

  const pinMarkerIcon = L.divIcon({
    className: '',
    html: `<div style="width:36px;height:36px;background:linear-gradient(135deg,#ef4444,#dc2626);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 16px rgba(239,68,68,0.5)"></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  const filters = externalFilters || internalFilters;

  const filteredIssues = issues.filter((issue) => {
    if (!filters.categories.includes(issue.category)) return false;
    if (filters.source !== 'all' && issue.source !== filters.source) return false;
    const durationDays = getDurationDays(issue.reportedAt);
    if (filters.duration === 'lt7' && durationDays >= 7) return false;
    if (filters.duration === '7to30' && (durationDays < 7 || durationDays > 30)) return false;
    if (filters.duration === 'gt30' && durationDays <= 30) return false;
    return true;
  });

  const handleSelectIssue = (issue: IssueReport) => {
    setSelectedIssue(issue);
    flyToFn(issue.latitude, issue.longitude);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = issues.find(i =>
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.location && i.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    if (match) {
      flyToFn(match.latitude, match.longitude);
      setSelectedIssue(match);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          flyToFn(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          flyToFn(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
        }
      );
    } else {
      flyToFn(DEFAULT_CENTER[0], DEFAULT_CENTER[1]);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-1 flex overflow-hidden">
        <MapSidebar
          issues={filteredIssues}
          totalIssues={issues.length}
          onSelectIssue={handleSelectIssue}
          selectedIssueId={selectedIssue?.id}
        />

        <div className="relative flex-1 pointer-events-none">
          <div className="hidden sm:flex absolute top-4 right-4 z-[1000] items-center gap-3 pointer-events-none">
            <form onSubmit={handleSearchSubmit} className="relative pointer-events-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Temukan lokasi..."
                className="bg-slate-950/85 text-white placeholder-slate-400 text-sm px-4 py-2.5 pl-10 pr-8 rounded-full border border-slate-700/60 focus:outline-none focus:border-red-500 transition-all shadow-lg w-56"
              />
              <span className="absolute left-3.5 top-3 text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </span>
            </form>

            <button
              onClick={() => { setIsPinMode(!isPinMode); setPinLocation(null); }}
              title="Tandai Lokasi"
              className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 pointer-events-auto ${
                isPinMode
                  ? 'bg-amber-500 hover:bg-amber-400 text-white animate-pulse'
                  : 'bg-slate-950/85 hover:bg-slate-800 text-white border border-slate-700/60'
              }`}
            >
              <MapPinIcon className="w-4 h-4" />
              <span>{isPinMode ? 'Klik peta...' : 'Tandai Lokasi'}</span>
            </button>

            <button
              onClick={() => setIsPhotoMode(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 pointer-events-auto"
            >
              <CameraIcon className="w-4 h-4" />
              <span>Laporan foto</span>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-extrabold">AI</span>
            </button>
          </div>

          {/* === MOBILE TOP SEARCH BAR === */}
          <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] pointer-events-none">
            <form onSubmit={handleSearchSubmit} className="relative pointer-events-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Temukan lokasi..."
                className="bg-slate-950/90 text-white placeholder-slate-400 text-sm px-4 py-2.5 pl-9 rounded-full border border-slate-700/60 focus:outline-none focus:border-red-500 transition-all shadow-xl w-full backdrop-blur-md"
              />
              <span className="absolute left-3 top-3 text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </span>
            </form>
          </div>

          {/* === MOBILE BOTTOM ACTION BAR === */}
          <div className="sm:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 pointer-events-none">
            <button
              onClick={() => { setIsPinMode(!isPinMode); setPinLocation(null); }}
              title="Tandai Lokasi"
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2.5 rounded-full shadow-xl transition-all active:scale-95 pointer-events-auto ${
                isPinMode
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-950/90 text-white border border-slate-700/60'
              }`}
            >
              <MapPinIcon className="w-4 h-4" />
              <span>{isPinMode ? 'Tap peta' : 'Tandai'}</span>
            </button>
            <button
              onClick={() => setIsPhotoMode(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl transition-all active:scale-95 pointer-events-auto"
            >
              <CameraIcon className="w-4 h-4" />
              <span>Foto AI</span>
            </button>
            <button
              onClick={handleLocateMe}
              title="Lokasi Saya"
              className="w-10 h-10 bg-slate-950/90 hover:bg-slate-800 text-white rounded-full border border-slate-700/60 shadow-xl flex items-center justify-center transition-all pointer-events-auto"
            >
              <LocationTargetIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsHeatmapEnabled(!isHeatmapEnabled)}
              title="Toggle Heatmap"
              className={`w-10 h-10 rounded-full border shadow-xl flex items-center justify-center transition-all pointer-events-auto ${isHeatmapEnabled
                  ? 'bg-red-500/20 text-red-400 border-red-500/50'
                  : 'bg-slate-950/90 text-slate-400 border-slate-700/60'
                }`}
            >
              <FlameIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
              title="Ganti Tema Peta"
              className="w-10 h-10 bg-slate-950/90 hover:bg-slate-800 text-white rounded-full border border-slate-700/60 shadow-xl flex items-center justify-center transition-all pointer-events-auto"
            >
              {mapTheme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>

          {/* === DESKTOP RIGHT SIDE CONTROLS === */}
          <div className="hidden sm:flex absolute right-4 top-24 z-[1000] flex-col gap-2 pointer-events-none">
            <button
              onClick={handleLocateMe}
              title="Lokasi Saya"
              className="w-10 h-10 bg-slate-950/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700/60 shadow-lg flex items-center justify-center transition-all pointer-events-auto"
            >
              <LocationTargetIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsHeatmapEnabled(!isHeatmapEnabled)}
              title="Toggle Heatmap"
              className={`w-10 h-10 rounded-xl border shadow-lg flex items-center justify-center transition-all pointer-events-auto ${isHeatmapEnabled
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-red-500/20'
                  : 'bg-slate-950/90 hover:bg-slate-800 text-slate-400 border-slate-700/60'
                }`}
            >
              <FlameIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
              title="Ganti Tema Peta"
              className="w-10 h-10 bg-slate-950/90 hover:bg-slate-800 text-white rounded-xl border border-slate-700/60 shadow-lg flex items-center justify-center transition-all pointer-events-auto"
            >
              {mapTheme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <div className="flex flex-col bg-slate-950/90 border border-slate-700/60 rounded-xl shadow-lg overflow-hidden mt-2 pointer-events-auto">
              <button
                onClick={() => zoomInFn()}
                className="w-10 h-10 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-lg border-b border-slate-700/60 transition-colors"
              >
                +
              </button>
              <button
                onClick={() => zoomOutFn()}
                className="w-10 h-10 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-lg transition-colors"
              >
                −
              </button>
            </div>
          </div>

          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%', pointerEvents: 'auto' }}
            zoomControl={false}
          >
            <MapControlsHelper
              onRegisterFlyTo={handleRegisterFlyTo}
            />

            <BoundsWatcher onBoundsChange={onBoundsChange} />

            <MapClickHandler isPinMode={isPinMode} onMapClick={handleMapClick} />

            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={
                mapTheme === 'dark'
                  ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
            />

            <HeatmapLayer issues={filteredIssues} enabled={isHeatmapEnabled} theme={mapTheme} />

            <MarkerClusterGroup chunkedLoading>
              {filteredIssues.map((issue) => (
                <Marker
                  key={issue.id}
                  position={[issue.latitude, issue.longitude]}
                  icon={createCustomMarkerIcon({
                    category: issue.category,
                    source: issue.source,
                    durationDays: getDurationDays(issue.reportedAt),
                    imageUrl: issue.imageUrl,
                    title: issue.title,
                  })}
                  eventHandlers={{ click: () => handleSelectIssue(issue) }}
                >
                  <MarkerPopup issue={issue} onViewDetail={handleSelectIssue} />
                </Marker>
              ))}
            </MarkerClusterGroup>

            {pinLocation && (
              <Marker
                position={[pinLocation.lat, pinLocation.lng]}
                icon={pinMarkerIcon}
                draggable
                eventHandlers={{
                  dragend(e) {
                    const latlng = (e.target as L.Marker).getLatLng();
                    setPinLocation({ lat: latlng.lat, lng: latlng.lng });
                  },
                }}
              />
            )}
          </MapContainer>
        </div>

        <ReportDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />

        <PhotoReportModal
          isOpen={isPhotoMode}
          onClose={() => setIsPhotoMode(false)}
        />

        <PinReportModal
          pinLocation={pinLocation}
          onClose={() => { setPinLocation(null); }}
          onSubmit={({ title, category, description, lat, lng }) => {
            const newReport: IssueReport = {
              id: `REPORT-${Date.now().toString().slice(-4)}`,
              title,
              description: description || 'Laporan baru ditambahkan via lokasi pin peta.',
              category,
              severityScore: 7.5,
              status: 'new',
              source: 'citizen',
              imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800',
              latitude: lat,
              longitude: lng,
              reportedAt: new Date().toISOString(),
              lastConfirmedAt: new Date().toISOString(),
              confirmationCount: 1,
              location: `Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
              statusHistory: [
                {
                  status: 'new',
                  timestamp: new Date().toISOString(),
                  message: 'Laporan baru dibuat melalui lokasi pin peta',
                },
              ],
            };
            if (onAddIssue) {
              onAddIssue(newReport);
            }
            setPinLocation(null);
          }}
        />
      </div>
    </div>
  );
}
