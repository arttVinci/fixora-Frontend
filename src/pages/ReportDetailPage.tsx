import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { IssueReport, IssueCategory, SourceType } from '../types';
import Footer from '../components/Footer';
import { formatIndonesianDate } from '../utils/dateUtils';
import { fetchReportDetail } from '../services/reportApiService';
import VerificationPanel from '../components/Map/VerificationPanel';
import {
  MapPinIcon,
  RoadIcon,
  BridgeIcon,
  TrashIcon,
  BuildingIcon,
  DrainageIcon,
  AiRobotIcon,
  UserIcon,
  ExternalLinkIcon,
  WhatsAppIcon,
  TwitterXIcon,
  LinkIcon,
  CheckIcon,
  CloseIcon,
} from '../components/Icons';

/* ── Leaflet pin icon ── */
const miniPinIcon = L.divIcon({
  className: '',
  html: `<div style="width:30px;height:30px;background:#2E7D32;border:2.5px solid #81C784;border-radius:50%;box-shadow:0 0 16px rgba(46,125,50,0.7);display:flex;align-items:center;justify-content:center;color:#F2F2F0;">
    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

/* ── Haversine distance (meters) ── */
function distanceMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ── Category metadata ── */
const categoryMeta: Record<IssueCategory, { label: string; icon: React.ReactNode }> = {
  jalan:    { label: 'Jalan Rusak',            icon: <RoadIcon className="w-4 h-4" /> },
  jembatan: { label: 'Jembatan Rawan',         icon: <BridgeIcon className="w-4 h-4" /> },
  sampah:   { label: 'Sampah Menumpuk',        icon: <TrashIcon className="w-4 h-4" /> },
  bangunan: { label: 'Bangunan Terbengkalai',  icon: <BuildingIcon className="w-4 h-4" /> },
  drainase: { label: 'Drainase Tersumbat',     icon: <DrainageIcon className="w-4 h-4" /> },
};

/* ── Source metadata ── */
const sourceMeta: Record<SourceType, { label: string; icon: React.ReactNode }> = {
  citizen:         { label: 'Laporan Warga',           icon: <UserIcon className="w-3.5 h-3.5" /> },
  ai_media:        { label: 'AI Media Crawler',        icon: <AiRobotIcon className="w-4 h-4" /> },
  government_data: { label: 'Data Pemerintah',         icon: <BuildingIcon className="w-3.5 h-3.5" /> },
};

import { getStatusBadge } from '../utils/statusUtils';

/* ── Severity helpers ── */
const severityConfig: Record<string, { label: string; badge: string; dot: string }> = {
  ringan: { label: 'Ringan',  badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  rendah: { label: 'Rendah',  badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  sedang: { label: 'Sedang',  badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',     dot: 'bg-amber-400' },
  tinggi: { label: 'Tinggi',  badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',  dot: 'bg-orange-400' },
  parah:  { label: 'Parah',   badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',        dot: 'bg-rose-400' },
  kritis: { label: 'Kritis',  badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',        dot: 'bg-rose-400' },
};

interface ReportDetailPageProps {
  issues: IssueReport[];
  onConfirmIssue?: (issueId: string) => void;
}

export default function ReportDetailPage({ issues }: ReportDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<IssueReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await fetchReportDetail(id);
        if (!cancelled && data) {
          setIssue(data);
          setActivePhoto(data.imageUrl || null);
        }
      } catch {
        const fallback = issues.find((i) => i.id === id) || null;
        if (!cancelled) {
          setIssue(fallback);
          setActivePhoto(fallback?.imageUrl || null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, issues]);

  const toast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  /* ── Loading Skeleton ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] pt-24 pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
          <div className="h-6 w-48 bg-[#161918] rounded-lg" />
          <div className="h-44 w-full bg-[#161918] rounded-2xl border border-[#2A2E2C]" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 h-96 bg-[#161918] rounded-2xl border border-[#2A2E2C]" />
            <div className="lg:col-span-4 h-96 bg-[#161918] rounded-2xl border border-[#2A2E2C]" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Not Found ── */
  if (!issue) {
    return (
      <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md p-8 bg-[#161918] border border-[#2A2E2C] rounded-2xl">
          <MapPinIcon className="w-12 h-12 mx-auto text-[#9BA39E]/40" />
          <h2 className="text-xl font-bold font-heading">Laporan Tidak Ditemukan</h2>
          <p className="text-xs text-[#9BA39E] leading-relaxed">
            Data laporan dengan nomor identifikasi <span className="font-mono text-[#81C784]">#{id}</span> tidak ditemukan pada database Fixora.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/peta" className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-xs font-bold text-white transition-all">
              Kembali ke Peta
            </Link>
            <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-xs text-[#9BA39E] transition-all">
              Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Derived Data ── */
  const cat = categoryMeta[issue.category] || categoryMeta.jalan;
  const src = sourceMeta[issue.source] || sourceMeta.citizen;
  const sev = severityConfig[issue.severity?.toLowerCase() || 'sedang'] || severityConfig.sedang;
  const stat = getStatusBadge(issue.status);

  const hasPhoto = !!issue.imageUrl;
  const allPhotos = [issue.imageUrl, ...(issue.additionalPhotos || [])].filter(
    (p): p is string => !!p
  );
  const currentPhoto = activePhoto || null;
  const isExternalSource = issue.source === 'ai_media' || issue.source === 'government_data';

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast('Tautan berhasil disalin ke clipboard');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Informasi Fasilitas Publik - Fixora\n\n${issue.title}\nLokasi: ${issue.address || issue.location || '-'}\n\nLihat rincian pemantauan: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Pantau informasi kondisi fasilitas publik: ${issue.title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] flex flex-col justify-between">

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[3000] px-4 py-3 rounded-xl bg-[#161918] border border-[#2E7D32] text-[#81C784] text-xs font-semibold flex items-center gap-2 shadow-2xl animate-slide-up">
          <CheckIcon className="w-4 h-4" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Fullscreen Photo Lightbox */}
      {lightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-[4000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#161918] border border-[#2A2E2C] text-white flex items-center justify-center text-base cursor-pointer hover:bg-[#1F2422] transition-colors z-50"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
          <img
            src={currentPhoto}
            alt={issue.title}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto w-full pt-28 pb-24 px-4 sm:px-6 lg:px-12 space-y-6">

        {/* ── Top Bar: Breadcrumb + Minimal Actions ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-[#9BA39E] font-medium">
            <Link to="/" className="hover:text-[#F2F2F0] transition-colors">Beranda</Link>
            <span>/</span>
            <Link to="/peta" className="hover:text-[#F2F2F0] transition-colors">Peta</Link>
            <span>/</span>
            <span className="text-[#81C784] font-mono">#{issue.id}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/peta')}
              className="px-3.5 py-1.5 rounded-lg bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-xs text-[#9BA39E] hover:text-[#F2F2F0] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPinIcon className="w-3.5 h-3.5 text-[#81C784]" />
              <span>Buka di Peta</span>
            </button>
            <button
              onClick={handleCopyLink}
              title="Salin Tautan"
              className="p-2 rounded-lg bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-[#9BA39E] hover:text-[#F2F2F0] transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShareWhatsApp}
              title="Bagikan ke WhatsApp"
              className="p-2 rounded-lg bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-[#9BA39E] hover:text-[#25D366] transition-colors cursor-pointer"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShareTwitter}
              title="Bagikan ke X"
              className="p-2 rounded-lg bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-[#9BA39E] hover:text-[#1DA1F2] transition-colors cursor-pointer"
            >
              <TwitterXIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Consolidation Alert (if merged) ── */}
        {issue.mergedIntoId && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs text-amber-200">
            <div>
              <strong>Laporan Terkonsolidasi:</strong> Masalah ini telah digabungkan ke laporan induk{' '}
              <span className="font-mono font-bold text-amber-300">#{issue.mergedIntoId}</span>
            </div>
            <Link
              to={`/laporan/${issue.mergedIntoId}`}
              className="px-3 py-1.5 rounded-lg bg-amber-500/25 hover:bg-amber-500/40 text-amber-200 font-bold whitespace-nowrap transition-colors"
            >
              Buka Laporan Induk →
            </Link>
          </div>
        )}

        {/* ── Header Section ── */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-[#F2F2F0] leading-tight">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs text-[#9BA39E] border-t border-[#2A2E2C]/80">
            <div className="flex items-center gap-1.5">
              <span className="text-[#9BA39E]/60">ID:</span>
              <span className="font-mono text-[#81C784] font-semibold">#{issue.id}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#9BA39E]/60">Tanggal:</span>
              <span>{formatIndonesianDate(issue.firstReportedAt || issue.reportedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[#F2F2F0]">
                {src.icon}
                <span>{src.label}</span>
              </span>
              {isExternalSource && issue.sourceUrl && (
                <a
                  href={issue.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#81C784] hover:underline font-semibold"
                >
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                  <span>Sumber Resmi</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Main Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left / Main Section (8 cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Photo Showcase */}
            {hasPhoto && currentPhoto ? (
              <div className="rounded-2xl bg-[#161918] border border-[#2A2E2C] overflow-hidden">
                <div
                  className="relative h-72 sm:h-96 cursor-zoom-in group"
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={currentPhoto}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161918] via-transparent to-black/20" />
                  <span className="absolute bottom-3 right-3 text-[11px] px-2.5 py-1 rounded-lg bg-black/60 text-[#F2F2F0] backdrop-blur-sm border border-white/10 font-medium">
                    Klik foto untuk memperbesar
                  </span>
                </div>

                {allPhotos.length > 1 && (
                  <div className="p-3.5 border-t border-[#2A2E2C] flex items-center gap-2.5 overflow-x-auto bg-[#121514]">
                    {allPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActivePhoto(photo)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                          currentPhoto === photo
                            ? 'border-[#81C784] shadow-md shadow-[#2E7D32]/30'
                            : 'border-[#2A2E2C] opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={photo} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : isExternalSource ? (
              <div className="rounded-2xl bg-[#161918] border border-[#2A2E2C] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-[#0D0F0E] border border-[#2A2E2C] flex items-center justify-center text-[#81C784] flex-shrink-0 shadow-inner">
                  {issue.source === 'ai_media' ? <AiRobotIcon className="w-7 h-7" /> : <BuildingIcon className="w-7 h-7" />}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-sm font-bold text-[#F2F2F0]">Informasi Terverifikasi Sistem</h3>
                  <p className="text-xs text-[#9BA39E] leading-relaxed">
                    {issue.source === 'ai_media'
                      ? 'Informasi ini dihimpun secara otomatis dari publikasi media berita sebagai referensi pemantauan fasilitas bersama.'
                      : 'Informasi ini dihimpun dari publikasi data infrastruktur dan keterbukaan informasi pemerintah.'}
                  </p>
                </div>
                {issue.sourceUrl && (
                  <a
                    href={issue.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#1B5E20]/30 hover:bg-[#1B5E20]/50 border border-[#2E7D32]/50 text-xs font-bold text-[#81C784] inline-flex items-center gap-1.5 whitespace-nowrap transition-colors flex-shrink-0"
                  >
                    <span>Laman Berita / Sumber</span>
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : null}

            {/* Description Section */}
            {issue.description && (
              <div className="p-6 sm:p-7 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#9BA39E] font-mono">
                  Deskripsi Kerusakan
                </h2>
                <p className="text-sm sm:text-base text-[#F2F2F0] leading-relaxed whitespace-pre-line">
                  {issue.description}
                </p>
              </div>
            )}

            {/* Location & Map Section */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#9BA39E] font-mono">
                  Lokasi Infrastruktur
                </h2>
                <a
                  href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#81C784] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>Buka di Google Maps</span>
                  <ExternalLinkIcon className="w-3 h-3" />
                </a>
              </div>

              {(issue.address || issue.location) && (
                <div className="flex items-start gap-2.5 text-sm text-[#F2F2F0]">
                  <MapPinIcon className="w-4 h-4 text-[#81C784] flex-shrink-0 mt-0.5" />
                  <span>{issue.address || issue.location}</span>
                </div>
              )}

              <div className="h-56 sm:h-64 w-full rounded-xl overflow-hidden border border-[#2A2E2C]">
                <MapContainer
                  center={[issue.latitude, issue.longitude]}
                  zoom={15}
                  scrollWheelZoom={false}
                  dragging={false}
                  zoomControl={false}
                  attributionControl={false}
                  className="w-full h-full"
                >
                  <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png" />
                  <Marker position={[issue.latitude, issue.longitude]} icon={miniPinIcon} />
                </MapContainer>
              </div>
            </div>

            {/* Verification multi-agent trace */}
            <VerificationPanel reportId={issue.id} />

            {/* ── Related Reports (nearby / merged) ── */}
            {issue.relatedReports && issue.relatedReports.length > 0 && (
              <div className="p-6 sm:p-7 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#9BA39E] font-mono">
                    Laporan Serupa di Sekitar
                  </h2>
                  <span className="text-[11px] font-mono text-[#81C784]">
                    {issue.relatedReports.length} laporan
                  </span>
                </div>

                <div className="space-y-2.5">
                  {issue.relatedReports.map((rel) => {
                    const relCat = categoryMeta[rel.category] || categoryMeta.jalan;
                    const dist = Math.round(
                      distanceMeters(
                        issue.latitude, issue.longitude,
                        rel.latitude, rel.longitude,
                      ),
                    );
                    const relStat = getStatusBadge(rel.status);
                    return (
                      <Link
                        key={rel.id}
                        to={`/laporan/${rel.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#0D0F0E]/60 border border-[#2A2E2C] hover:border-[#2E7D32]/50 hover:bg-[#141816] transition-colors"
                      >
                        {rel.imageUrl ? (
                          <img
                            src={rel.imageUrl}
                            alt={rel.title}
                            className="w-12 h-12 rounded-lg object-cover border border-[#2A2E2C] flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#161918] border border-[#2A2E2C] flex items-center justify-center text-[#81C784] flex-shrink-0">
                            {relCat.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#9BA39E]">
                            <span className="truncate">#{rel.id}</span>
                            <span className="flex-shrink-0 inline-flex items-center gap-1 text-[#81C784]">
                              <MapPinIcon className="w-3 h-3" />
                              {dist} m
                            </span>
                          </div>
                          <h3 className="text-sm font-semibold text-[#F2F2F0] leading-snug truncate mt-0.5">
                            {rel.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${relStat.badge}`}>
                              {relStat.label}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Section / Info Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Structured Info Card */}
            <div className="p-6 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9BA39E] font-mono pb-2 border-b border-[#2A2E2C]">
                Rincian Laporan
              </h3>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#9BA39E]">Status Penanganan</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold border text-[11px] ${stat.badge}`}>
                    {stat.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#9BA39E]">Tingkat Keparahan</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold border text-[11px] ${sev.badge}`}>
                    {sev.label}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#9BA39E]">Kategori Fasilitas</span>
                  <span className="text-[#F2F2F0] font-medium">{issue.categoryName || cat.label}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#9BA39E]">Asal Sumber Data</span>
                  <span className="text-[#F2F2F0] font-medium">{src.label}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#9BA39E]">Pertama Dilaporkan</span>
                  <span className="text-[#F2F2F0] font-mono text-[11px]">
                    {formatIndonesianDate(issue.firstReportedAt || issue.reportedAt)}
                  </span>
                </div>

                {issue.lastConfirmedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#9BA39E]">Terakhir Dikonfirmasi</span>
                    <span className="text-[#F2F2F0] font-mono text-[11px]">
                      {formatIndonesianDate(issue.lastConfirmedAt)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#9BA39E]">Koordinat Titik</span>
                  <span className="text-[#81C784] font-mono text-[11px]">
                    {issue.latitude.toFixed(4)}, {issue.longitude.toFixed(4)}
                  </span>
                </div>
              </div>

              {isExternalSource && issue.sourceUrl && (
                <div className="pt-3 border-t border-[#2A2E2C]">
                  <a
                    href={issue.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3.5 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] text-xs font-semibold text-[#81C784] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
                    <span>Kunjungi Sumber Data</span>
                  </a>
                </div>
              )}
            </div>

            {/* Transparency CTA Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#161918] to-[#121514] border border-[#2E7D32]/30 space-y-2.5">
              <div className="flex items-center gap-2 text-[#81C784] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#81C784] animate-ping" />
                <span>Keterbukaan Informasi Infrastruktur</span>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Pantau statistik sebaran fasilitas publik dan informasi pembangunan daerah secara terpadu.
              </p>
              <Link
                to="/transparansi"
                className="inline-flex items-center gap-1.5 text-xs text-[#81C784] hover:underline font-bold pt-1"
              >
                <span>Lihat Data Transparansi →</span>
              </Link>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
