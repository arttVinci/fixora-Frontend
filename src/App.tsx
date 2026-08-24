import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/landing/HeroSection';
import MapSection from './components/landing/MapSection';
import HowItWorksSection from './components/landing/HowItWorksSection';
import AnalyticsSection from './components/landing/AnalyticsSection';
import CTASection from './components/landing/CTASection';
import Footer from './components/Footer';

import { mockIssueReports } from './services/mockData';
import { fetchMapReports } from './services/reportApiService';
import type { IssueReport } from './types';
import type { MapBounds } from './types/api';

const DEFAULT_BOUNDS: MapBounds = {
  minLat: -6.4,
  maxLat: -6.0,
  minLng: 106.6,
  maxLng: 107.1,
};

function App() {
  const [issues, setIssues] = useState<IssueReport[]>(mockIssueReports);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialReports() {
      try {
        setIsApiLoading(true);
        const apiReports = await fetchMapReports(DEFAULT_BOUNDS);
        if (!cancelled) {
          if (apiReports.length > 0) {
            setIssues(apiReports);
            setIsUsingMock(false);
          } else {
            setIsUsingMock(true);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[Fixora] Backend tidak tersedia, menggunakan data mock.', err);
          setIsUsingMock(true);
          setIssues(mockIssueReports);
        }
      } finally {
        if (!cancelled) {
          setIsApiLoading(false);
        }
      }
    }

    loadInitialReports();
    return () => { cancelled = true; };
  }, []);

  const handleBoundsChange = useCallback(async (bounds: MapBounds) => {
    if (isUsingMock) return;
    try {
      const apiReports = await fetchMapReports(bounds);
      if (apiReports.length > 0) {
        setIssues(apiReports);
      }
    } catch {
    }
  }, [isUsingMock]);

  const { totalReports, criticalReports, resolutionRate } = useMemo(() => {
    const t = issues.length;
    const c = issues.filter(i => i.status === 'open').length;
    const r = issues.filter(i => i.status === 'closed' || i.status === 'archived').length;
    const rate = t > 0 ? Math.round((r / t) * 100) : 0;
    return { totalReports: t, criticalReports: c, resolutionRate: rate };
  }, [issues]);

  const mapSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToMap = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLaporMasalah = () => {
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReportSubmitted = (newReport: IssueReport) => {
    setIssues(prev => [...prev, newReport]);
  };

  return (
    <div className="min-h-screen bg-dark-surface">
      <Navbar />
      {import.meta.env.DEV && (
        <div
          className={`fixed bottom-4 left-4 z-[9999] px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg transition-all ${
            isApiLoading
              ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
              : isUsingMock
              ? 'bg-slate-700/80 border border-slate-600 text-slate-400'
              : 'bg-green-500/20 border border-green-500/50 text-green-400'
          }`}
        >
          {isApiLoading ? '⏳ Memuat dari API...' : isUsingMock ? '📦 Data Mock' : '🟢 Terhubung ke API'}
        </div>
      )}
      <main>
        <HeroSection
          onLaporMasalah={handleLaporMasalah}
          onReportSubmitted={handleReportSubmitted}
          onScrollToMap={handleScrollToMap}
        />
        <div ref={mapSectionRef}>
          <MapSection
            issues={issues}
            onAddIssue={handleReportSubmitted}
            onBoundsChange={handleBoundsChange}
          />
        </div>
        <HowItWorksSection />
        <AnalyticsSection
          issues={issues}
          totalReports={totalReports}
          criticalReports={criticalReports}
          resolutionRate={resolutionRate}
        />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
