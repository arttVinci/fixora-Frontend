import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MapBounds } from '../../types/api';
import {
  MapPinIcon,
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

/* ── Leaflet helper hooks ─────────────────────────────────── */

function MapControlsHelper({
  onRegisterFlyTo,
  sidebarOpen,
}: {
  onRegisterFlyTo: (
    flyFn: (lat: number, lng: number) => void,
    zoomInFn: () => void,
    zoomOutFn: () => void
  ) => void;
  sidebarOpen: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    onRegisterFlyTo(
      (lat, lng) => {
        // Offset to account for:
        // 1. Floating sidebar covering the left side (horizontal)
        // 2. Popup opening above the marker needs room (vertical)
        const SIDEBAR_WIDTH = 400; // sidebar ~380px + padding
        const POPUP_HEIGHT_OFFSET = 200; // push map center up so tall popup has room
        const xOffset = sidebarOpen ? SIDEBAR_WIDTH / 2 : 0;
        const targetPoint = map.project([lat, lng], 15);
        const offsetPoint = L.point(targetPoint.x - xOffset, targetPoint.y - POPUP_HEIGHT_OFFSET);
        const offsetLatLng = map.unproject(offsetPoint, 15);
        map.flyTo(offsetLatLng, 15, { animate: true });
      },
      () => map.zoomIn(),
      () => map.zoomOut()
    );
  }, [map, onRegisterFlyTo, sidebarOpen]);
  return null;
}

function BoundsWatcher({ onBoundsChange }: { onBoundsChange?: (b: MapBounds) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const map = useMapEvents({
    moveend() {
      if (!onBoundsChange) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const b = map.getBounds();
        onBoundsChange({
          minLat: b.getSouth(), maxLat: b.getNorth(),
          minLng: b.getWest(), maxLng: b.getEast(),
        });
      }, 600);
    },
  });
  return null;
}

function MapClickHandler({
  isPinMode, onMapClick,
}: {
  isPinMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    click(e) { if (isPinMode) onMapClick(e.latlng.lat, e.latlng.lng); },
  });
  useEffect(() => { map.getContainer().style.cursor = isPinMode ? 'crosshair' : ''; }, [isPinMode, map]);
  return null;
}

/* ── Marker with auto-open popup ──────────────────────────── */

function IssueMarker({
  issue,
  isSelected,
  onSelect,
  onViewDetail,
}: {
  issue: IssueReport;
  isSelected: boolean;
  onSelect: (issue: IssueReport) => void;
  onViewDetail: (issue: IssueReport) => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      // Wait for flyTo animation to settle before opening popup
      const timer = setTimeout(() => {
        markerRef.current?.openPopup();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[issue.latitude, issue.longitude]}
      icon={createCustomMarkerIcon({
        category: issue.category,
        source: issue.source,
        durationDays: getDurationDays(issue.reportedAt),
        imageUrl: issue.imageUrl,
        title: issue.title,
      })}
      eventHandlers={{ click: () => onSelect(issue) }}
    >
      <MarkerPopup issue={issue} onViewDetail={onViewDetail} />
    </Marker>
  );
}

/* ── Main component ───────────────────────────────────────── */

export default function InteractiveMap({
  issues, onAddIssue, onBoundsChange,
}: InteractiveMapProps) {
  const [isPinMode, setIsPinMode] = useState(false);
  const [pinLocation, setPinLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isHeatmapEnabled, setIsHeatmapEnabled] = useState(false);
  const [mapTheme, setMapTheme] = useState<'dark' | 'light'>('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Sidebar filter state
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedDuration, setSelectedDuration] = useState<'all' | 'lt30' | 'gt30' | 'gt90'>('all');

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
      flyToRef.current = fly; zoomInRef.current = inFn; zoomOutRef.current = outFn;
    }, []
  );

  const pinMarkerIcon = L.divIcon({
    className: '',
    html: '<div style="width:36px;height:36px;background:linear-gradient(135deg,#2E7D32,#1B5E20);border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #F2F2F0;box-shadow:0 6px 20px rgba(0,0,0,0.6)"></div>',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

  const filteredIssues = issues.filter((issue) => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    const d = getDurationDays(issue.reportedAt);
    if (selectedDuration === 'lt30' && d >= 30) return false;
    if (selectedDuration === 'gt30' && d < 30) return false;
    if (selectedDuration === 'gt90' && d < 90) return false;
    return true;
  });

  const navigate = useNavigate();

  const handleSelectIssue = (issue: IssueReport) => {
    setSelectedIssueId(issue.id);
    flyToFn(issue.latitude, issue.longitude);
  };

  const handleViewDetail = (issue: IssueReport) => {
    navigate(`/laporan/${issue.id}`);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => flyToFn(p.coords.latitude, p.coords.longitude),
      () => flyToFn(DEFAULT_CENTER[0], DEFAULT_CENTER[1])
    );
  };

  /* ── Tile URL: Stadia Maps dark (free, no API key required for localhost) ── */
  const tileUrl = mapTheme === 'dark'
    ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
    : 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';

  return (
    <div className="relative w-full h-full bg-[#0D0F0E] select-none">

      {/* ━━━ 1. FLOATING SIDEBAR OVERLAY ━━━ */}
      <MapSidebar
        issues={issues}
        totalIssues={issues.length}
        onSelectIssue={handleSelectIssue}
        selectedIssueId={selectedIssueId}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedDuration={selectedDuration}
        onSelectDuration={setSelectedDuration}
        isOpen={isSidebarOpen}
        onToggleOpen={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* ━━━ 2. FULL-WIDTH MAP CANVAS ━━━ */}
      <div className="relative w-full h-full overflow-hidden">

        {/* ── Floating top-right toolbar ── */}
        <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-[#161918]/90 backdrop-blur-lg p-1 rounded-2xl border border-[#2A2E2C] shadow-2xl">
          <button
            onClick={() => { setIsPinMode(!isPinMode); setPinLocation(null); }}
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
              isPinMode
                ? 'bg-amber-500 text-black border-amber-400 font-bold animate-pulse'
                : 'bg-[#0D0F0E] hover:bg-[#1F2422] text-[#F2F2F0] border-[#2A2E2C]'
            }`}
          >
            <MapPinIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isPinMode ? 'Klik Peta...' : 'Pin'}</span>
          </button>

          <button
            onClick={() => setIsHeatmapEnabled(!isHeatmapEnabled)}
            title="Toggle Heatmap"
            className={`py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
              isHeatmapEnabled
                ? 'bg-[#1B5E20]/50 text-[#81C784] border-[#2E7D32]'
                : 'bg-[#0D0F0E] hover:bg-[#1F2422] text-[#9BA39E] border-[#2A2E2C]'
            }`}
          >
            <FlameIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Heatmap</span>
          </button>

          <button onClick={handleLocateMe} title="Lokasi Saya"
            className="w-8 h-8 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] text-[#81C784] border border-[#2A2E2C] flex items-center justify-center cursor-pointer"
          >
            <LocationTargetIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMapTheme(mapTheme === 'dark' ? 'light' : 'dark')}
            title="Ganti Tema"
            className="w-8 h-8 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] text-[#F2F2F0] border border-[#2A2E2C] flex items-center justify-center cursor-pointer"
          >
            {mapTheme === 'dark'
              ? <SunIcon className="w-3.5 h-3.5 text-amber-300" />
              : <MoonIcon className="w-3.5 h-3.5 text-blue-300" />}
          </button>
        </div>

        {/* ── Floating bottom-right zoom ── */}
        <div className="absolute bottom-5 right-3 z-[1000] flex flex-col bg-[#161918]/90 border border-[#2A2E2C] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <button onClick={() => zoomInFn()} title="Zoom In"
            className="w-9 h-9 hover:bg-[#1F2422] text-[#F2F2F0] flex items-center justify-center font-bold text-base border-b border-[#2A2E2C] cursor-pointer">+</button>
          <button onClick={() => zoomOutFn()} title="Zoom Out"
            className="w-9 h-9 hover:bg-[#1F2422] text-[#F2F2F0] flex items-center justify-center font-bold text-base cursor-pointer">−</button>
        </div>

        {/* ── Leaflet Map ── */}
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <MapControlsHelper onRegisterFlyTo={handleRegisterFlyTo} sidebarOpen={isSidebarOpen} />
          <BoundsWatcher onBoundsChange={onBoundsChange} />
          <MapClickHandler isPinMode={isPinMode} onMapClick={handleMapClick} />

          <TileLayer
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OSM</a>'
            url={tileUrl}
          />

          <HeatmapLayer issues={filteredIssues} enabled={isHeatmapEnabled} theme={mapTheme} />

          <MarkerClusterGroup chunkedLoading>
            {filteredIssues.map((issue) => (
              <IssueMarker
                key={issue.id}
                issue={issue}
                isSelected={selectedIssueId === issue.id}
                onSelect={handleSelectIssue}
                onViewDetail={handleViewDetail}
              />
            ))}
          </MarkerClusterGroup>

          {pinLocation && (
            <Marker
              position={[pinLocation.lat, pinLocation.lng]}
              icon={pinMarkerIcon}
              draggable
              eventHandlers={{
                dragend(e) {
                  const ll = (e.target as L.Marker).getLatLng();
                  setPinLocation({ lat: ll.lat, lng: ll.lng });
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* ━━━ 3. MODALS ━━━ */}
      <PinReportModal
        pinLocation={pinLocation}
        onClose={() => setPinLocation(null)}
        onSubmit={(issue) => {
          onAddIssue?.(issue);
          setPinLocation(null);
        }}
      />
    </div>
  );
}
