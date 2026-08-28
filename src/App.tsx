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

  useEffect(() => {
    let cancelled = false;

    async function loadInitialReports() {
      try {
        const apiReports = await fetchMapReports(DEFAULT_BOUNDS);
        if (!cancelled && apiReports.length > 0) {
          setIssues(apiReports);
        }
      } catch {
        // Fallback to mock issues if API is unreachable
      }
    }

    loadInitialReports();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBoundsChange = useCallback(async (bounds: MapBounds) => {
    try {
      const apiReports = await fetchMapReports(bounds);
      if (apiReports.length > 0) {
        setIssues(apiReports);
      }
    } catch {
    }
  }, []);

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
      <main>
        <HeroSection
          issues={issues}
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
