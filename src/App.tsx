import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import TransparencyPage from "./pages/TransparencyPage";
import AboutPage from "./pages/AboutPage";
import ReportDetailPage from "./pages/ReportDetailPage";

import { fetchMapReports } from "./services/reportApiService";
import type { IssueReport } from "./types";
import type { MapBounds } from "./types/api";

const WEST_JAVA_BOUNDS: MapBounds = {
  minLat: -8.5,
  maxLat: -5.5,
  minLng: 105.5,
  maxLng: 109.5,
};

function App() {
  const [allReports, setAllReports] = useState<IssueReport[]>([]);
  const [mapReports, setMapReports] = useState<IssueReport[]>([]);
  const location = useLocation();

  const isMapPage = location.pathname === "/peta";

  // Load all reports across West Java for global metrics, homepage stats, and transparency
  useEffect(() => {
    let cancelled = false;

    async function loadAllReports() {
      try {
        const apiReports = await fetchMapReports(WEST_JAVA_BOUNDS);
        if (!cancelled) {
          setAllReports(apiReports);
          setMapReports(apiReports);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[Fixora] Gagal memuat data laporan dari backend.", err);
        }
      }
    }

    loadAllReports();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBoundsChange = useCallback(async (bounds: MapBounds) => {
    try {
      const apiReports = await fetchMapReports(bounds);
      setMapReports(apiReports);
    } catch (err) {
      console.warn("[Fixora] Gagal memuat data peta untuk area ini.", err);
    }
  }, []);

  const handleReportSubmitted = (newReport: IssueReport) => {
    setAllReports((prev) => [newReport, ...prev]);
    setMapReports((prev) => [newReport, ...prev]);
  };

  const handleConfirmIssue = (issueId: string) => {
    const updateFn = (prev: IssueReport[]) =>
      prev.map((i) =>
        i.id === issueId
          ? { ...i, confirmationCount: (i.confirmationCount || 0) + 1 }
          : i,
      );
    setAllReports(updateFn);
    setMapReports(updateFn);
  };

  return (
    <div
      className={`bg-[#0D0F0E] text-[#F2F2F0] font-sans antialiased selection:bg-[#2E7D32] selection:text-[#F2F2F0] ${
        isMapPage ? "h-screen overflow-hidden flex flex-col" : "min-h-screen"
      }`}
    >
      {/* Universal Header Navbar */}
      <Navbar />

      {/* Main Routed Page Content */}
      <main
        className={`w-full ${
          isMapPage ? "flex-1 overflow-hidden h-[calc(100vh-64px)]" : ""
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                issues={allReports}
                onReportSubmitted={handleReportSubmitted}
              />
            }
          />
          <Route
            path="/peta"
            element={
              <MapPage
                issues={mapReports.length > 0 ? mapReports : allReports}
                onAddIssue={handleReportSubmitted}
                onBoundsChange={handleBoundsChange}
              />
            }
          />
          <Route
            path="/transparansi"
            element={<TransparencyPage issues={allReports} />}
          />
          <Route path="/tentang" element={<AboutPage />} />
          <Route
            path="/laporan/:id"
            element={
              <ReportDetailPage
                issues={allReports}
                onConfirmIssue={handleConfirmIssue}
              />
            }
          />
          <Route
            path="*"
            element={
              <HomePage
                issues={allReports}
                onReportSubmitted={handleReportSubmitted}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
