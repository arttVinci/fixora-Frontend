import { useState, useMemo, useEffect, useCallback } from 'react';
import Navbar, { type AppPage } from './components/Navbar';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import TransparencyPage from './pages/TransparencyPage';
import AboutPage from './pages/AboutPage';

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

function getPageFromHash(): AppPage {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'peta' || hash === 'map') return 'peta';
  if (hash === 'transparansi' || hash === 'anggaran' || hash === 'stats') return 'transparansi';
  if (hash === 'tentang' || hash === 'about') return 'tentang';
  return 'home';
}

function App() {
  const [page, setPage] = useState<AppPage>(getPageFromHash);
  const [issues, setIssues] = useState<IssueReport[]>(mockIssueReports);
  const [isApiLoading, setIsApiLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);

  // Sync hash changes (e.g. browser back/forward or direct link)
  useEffect(() => {
    const handleHashChange = () => {
      setPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when page state changes
  const handleNavigate = (newPage: AppPage) => {
    setPage(newPage);
    if (newPage === 'home') {
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      window.location.hash = newPage;
    }
  };

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
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBoundsChange = useCallback(
    async (bounds: MapBounds) => {
      if (isUsingMock) return;
      try {
        const apiReports = await fetchMapReports(bounds);
        if (apiReports.length > 0) {
          setIssues(apiReports);
        }
      } catch {
        // Fallback silently if bounds query errors
      }
    },
    [isUsingMock]
  );

  const handleReportSubmitted = (newReport: IssueReport) => {
    setIssues((prev) => [newReport, ...prev]);
  };

  const handleLaporClick = () => {
    handleNavigate('peta');
  };

  return (
    <div className={`bg-[#0D0F0E] text-[#F2F2F0] font-sans antialiased selection:bg-[#2E7D32] selection:text-[#F2F2F0] ${
      page === 'peta' ? 'h-screen overflow-hidden flex flex-col' : 'min-h-screen'
    }`}>
      {/* Universal Header Navbar */}
      <Navbar
        activePage={page}
        onNavigate={handleNavigate}
        onLaporClick={handleLaporClick}
      />


      {/* Main Routed Page Content */}
      <main className={`w-full ${page === 'peta' ? 'flex-1 overflow-hidden h-[calc(100vh-64px)]' : ''}`}>
        {page === 'home' && (
          <HomePage
            issues={issues}
            onLaporMasalah={handleLaporClick}
            onReportSubmitted={handleReportSubmitted}
            onNavigateToMap={() => handleNavigate('peta')}
            onNavigateToTransparency={() => handleNavigate('transparansi')}
            onNavigateToAbout={() => handleNavigate('tentang')}
          />
        )}

        {page === 'peta' && (
          <MapPage
            issues={issues}
            onAddIssue={handleReportSubmitted}
            onBoundsChange={handleBoundsChange}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {page === 'transparansi' && (
          <TransparencyPage
            issues={issues}
            onNavigateToMap={() => handleNavigate('peta')}
          />
        )}

        {page === 'tentang' && <AboutPage />}
      </main>
    </div>
  );
}

export default App;
