import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const FIXORA_REPORTS_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [106.8272, -6.1754] } },
    { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [106.8240, -6.1780] } },
    { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [106.8300, -6.1720] } },
    { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [106.8096, -6.2255] } },
    { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [106.8120, -6.2280] } },
    { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [106.7461, -6.1112] } },
    { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [106.8326, -6.2222] } },
  ],
};

const JAKARTA_LOCATIONS = [
  { center: [106.8272, -6.1754] as [number, number], zoom: 13.5, pitch: 55, bearing: 20 },
  { center: [106.8096, -6.2255] as [number, number], zoom: 14.0, pitch: 60, bearing: -35 },
  { center: [106.7461, -6.1112] as [number, number], zoom: 13.0, pitch: 45, bearing: 40 },
  { center: [106.8326, -6.2222] as [number, number], zoom: 13.8, pitch: 50, bearing: -15 },
];

export default function HeroMapBackground() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
  if (!mapContainerRef.current) return;


  const map = new maplibregl.Map({
    container: mapContainerRef.current,
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [106.8272, -6.1754],
    zoom: 13,
    pitch: 50,
    interactive: false,
  });

  map.setPadding({ top: 0, bottom: 0, left: 450, right: 0 });

  let currentIndex = 0;

  let intervalId: number;

  map.on('load', () => {
    map.addSource('fixora-reports', {
      type: 'geojson',
      data: FIXORA_REPORTS_GEOJSON,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });


    const animateMap = () => {
      currentIndex = (currentIndex + 1) % JAKARTA_LOCATIONS.length;
      const target = JAKARTA_LOCATIONS[currentIndex];

      map.flyTo({
        center: target.center,
        zoom: target.zoom,
        pitch: target.pitch,
        bearing: target.bearing,
        speed: 0.2,
        curve: 1.3,
        padding: { top: 0, bottom: 0, left: 450, right: 0 },
        essential: true,
      });
    };


    intervalId = window.setInterval(animateMap, 8000);
  });

  return () => {
    if (intervalId) window.clearInterval(intervalId);
    map.remove();
  };
}, []);
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to right, 
              #080c14 0%, 
              #080c14 38%, 
              rgba(8, 12, 20, 0.8) 60%, 
              rgba(8, 12, 20, 0.25) 85%,
              rgba(8, 12, 20, 0.5) 100%
            ),
            linear-gradient(to bottom,
              #080c14 0%,
              transparent 12%,
              transparent 88%,
              #080c14 100%
            )
          `
        }}
      />
    </div>
  );
}