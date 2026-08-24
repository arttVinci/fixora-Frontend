import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { IssueReport } from '../../types';

interface HeatmapLayerProps {
  issues: IssueReport[];
  enabled: boolean;
  theme?: 'dark' | 'light';
}

export default function HeatmapLayer({ issues, enabled, theme = 'dark' }: HeatmapLayerProps) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
      return;
    }

    const container = map.getContainer();
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '400';
    canvas.style.opacity = theme === 'dark' ? '0.85' : '0.65';
    canvas.style.mixBlendMode = theme === 'dark' ? 'screen' : 'multiply';
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    container.appendChild(canvas);
    canvasRef.current = canvas;

    const draw = () => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = map.getSize();
      canvas.width = size.x;
      canvas.height = size.y;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      issues.forEach((issue) => {
        const point = map.latLngToContainerPoint([issue.latitude, issue.longitude]);
        const zoom = map.getZoom() || 12;
        const radius = Math.max(40, Math.min(120, zoom * 7));

        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, radius
        );
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
        gradient.addColorStop(0.2, 'rgba(249, 115, 22, 0.8)');
        gradient.addColorStop(0.45, 'rgba(234, 179, 8, 0.6)');
        gradient.addColorStop(0.7, 'rgba(34, 197, 94, 0.35)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    draw();

    const handleMove = () => draw();
    map.on('move moveend zoomend resize', handleMove);

    return () => {
      map.off('move moveend zoomend resize', handleMove);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      canvasRef.current = null;
    };
  }, [map, issues, enabled, theme]);

  return null;
}
