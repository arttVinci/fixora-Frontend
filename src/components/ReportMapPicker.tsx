import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

type ReportMapPickerProps = {
  onLocationSelect: (lat: number, lng: number, label: string) => void;
  initialLat?: number;
  initialLng?: number;
};

export default function ReportMapPicker({ onLocationSelect, initialLat = -6.2088, initialLng = 106.8456 }: ReportMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: initialLat, lng: initialLng });

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
    marker.bindPopup('Seret pin ke lokasi yang tepat').openPopup();

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setCoords({ lat: pos.lat, lng: pos.lng });
      onLocationSelect(pos.lat, pos.lng, `${pos.lat.toFixed(5)}, ${pos.lng.toFixed(5)}`);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      onLocationSelect(e.latlng.lat, e.latlng.lng, `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`);
    });

    leafletMapRef.current = map;
    markerRef.current = marker;

    onLocationSelect(initialLat, initialLng, `${initialLat.toFixed(5)}, ${initialLng.toFixed(5)}`);

    return () => {
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
    };
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: '220px' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <div className="px-3 py-1.5 bg-dark-surface/90 text-xs text-slate-400 text-center">
        📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)} — Klik atau seret pin
      </div>
    </div>
  );
}
