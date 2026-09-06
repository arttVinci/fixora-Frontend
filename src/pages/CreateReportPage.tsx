import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type {
  IssueCategory,
  SeverityLevel,
  IssueReport,
} from '../types';
import {
  analyzePhoto,
  submitReport,
} from '../services/reportService';
import ReportMapPicker from '../components/ReportMapPicker';
import Footer from '../components/Footer';
import {
  CameraIcon,
  SparklesIcon,
  MapPinIcon,
  CheckIcon,
  RoadIcon,
  BridgeIcon,
  TrashIcon,
  BuildingIcon,
  DrainageIcon,
  CloseIcon,
  AlertTriangleIcon,
  GooglePlayIcon,
  ClockIcon,
} from '../components/Icons';

interface CreateReportPageProps {
  onReportSubmitted?: (report: IssueReport) => void;
}

type Step = 'upload' | 'review';

const CATEGORIES: { id: IssueCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'jalan', label: 'Jalan Rusak', icon: <RoadIcon className="w-4 h-4" /> },
  { id: 'jembatan', label: 'Jembatan', icon: <BridgeIcon className="w-4 h-4" /> },
  { id: 'sampah', label: 'Sampah Liar', icon: <TrashIcon className="w-4 h-4" /> },
  { id: 'bangunan', label: 'Fasilitas / Bangunan', icon: <BuildingIcon className="w-4 h-4" /> },
  { id: 'drainase', label: 'Drainase / Saluran Air', icon: <DrainageIcon className="w-4 h-4" /> },
];

const SEVERITIES: { id: SeverityLevel; label: string; desc: string }[] = [
  { id: 'rendah', label: 'Rendah', desc: 'Kerusakan kecil / tidak membahayakan' },
  { id: 'sedang', label: 'Sedang', desc: 'Mengganggu kenyamanan & mobilitas' },
  { id: 'tinggi', label: 'Tinggi', desc: 'Berisiko kecelakaan atau kerusakan fatal' },
  { id: 'kritis', label: 'Kritis', desc: 'Darurat / jalan putus / roboh' },
];

export default function CreateReportPage({ onReportSubmitted }: CreateReportPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stepper state: 'upload' (Step 1) -> 'review' (Step 2: Auto-filled form + Map)
  const [currentStep, setCurrentStep] = useState<Step>('upload');

  // Photo & Session State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [stagingSessionId, setStagingSessionId] = useState<string | null>(null);

  // Auto-filled AI Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>('jalan');
  const [severity, setSeverity] = useState<SeverityLevel>('sedang');
  const [reporterEmail, setReporterEmail] = useState('');

  // Location State
  const [latitude, setLatitude] = useState<number>(-6.2088);
  const [longitude, setLongitude] = useState<number>(106.8456);
  const [locationLabel, setLocationLabel] = useState<string>('Jawa Barat');
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  // Processing & UI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<IssueReport | null>(null);

  // Handle Photo Selection & AI Vision Analysis (Triggers Step 1 -> Step 2)
  const handlePhotoSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Format berkas tidak didukung. Harap pilih berkas foto gambar (JPG, PNG, WebP).');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    // Create local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call Backend AI Vision Classifier
    setIsAnalyzing(true);
    try {
      const result = await analyzePhoto(file);

      if (!result.isRelevant) {
        const errorReason = result.reason?.trim()
          ? (result.reason.charAt(0).toUpperCase() + result.reason.slice(1))
          : (result.description || 'Foto yang Anda unggah tidak terdeteksi sebagai kerusakan fasilitas publik. Silakan unggah foto lain.');
        setErrorMessage(`Foto ditolak: ${errorReason}`);
        setSelectedFile(null);
        setPhotoPreview(null);
        setStagingSessionId(null);
        return;
      }

      setStagingSessionId(result.sessionId);
      if (result.title) setTitle(result.title);
      if (result.description) {
        setDescription(result.description);
      } else if (result.reason) {
        setDescription(result.reason);
      }
      if (result.category) setCategory(result.category);
      if (result.severity) setSeverity(result.severity);

      // Auto-fill coordinates and address extracted from watermark/metadata
      if (result.latitude != null && !isNaN(Number(result.latitude))) {
        setLatitude(Number(result.latitude));
      }
      if (result.longitude != null && !isNaN(Number(result.longitude))) {
        setLongitude(Number(result.longitude));
      }
      if (result.address) {
        setLocationLabel(result.address);
      } else if (result.location) {
        setLocationLabel(result.location);
      }

      // Move to Step 2 with auto-filled data from actual backend
      setCurrentStep('review');
    } catch (err: unknown) {
      console.error('[Fixora] Analisis AI gagal:', err);
      const errorMsg = err instanceof Error ? err.message : 'Gagal menghubungi server AI backend. Pastikan server backend Fixora sedang berjalan.';
      setErrorMessage(errorMsg);
      setSelectedFile(null);
      setPhotoPreview(null);
      setStagingSessionId(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Browser GPS Geolocation
  const handleDetectDeviceGps = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Fitur GPS tidak didukung oleh peramban Anda.');
      return;
    }

    setIsDetectingGps(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setLocationLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        setIsDetectingGps(false);
      },
      (err) => {
        console.warn('Gagal mendeteksi lokasi:', err);
        setErrorMessage('Tidak dapat mengakses GPS. Pastikan izin lokasi aktif pada peramban Anda.');
        setIsDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !stagingSessionId) {
      setErrorMessage('Silakan unggah foto bukti kerusakan terlebih dahulu.');
      setCurrentStep('upload');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Judul laporan tidak boleh kosong.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const newReport = await submitReport({
        reporterName: 'Warga',
        reporterEmail: reporterEmail.trim(),
        latitude,
        longitude,
        locationMethod: 'manual',
        locationLabel,
        description: description.trim() || title.trim(),
        finalCategory: category,
        finalSeverity: severity,
        title: title.trim(),
        stagingSessionId: stagingSessionId || 'session_' + Date.now(),
      });

      setSubmittedReport(newReport);
      onReportSubmitted?.(newReport);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengirim laporan. Silakan coba lagi.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetToUpload = () => {
    setSelectedFile(null);
    setPhotoPreview(null);
    setStagingSessionId(null);
    setTitle('');
    setDescription('');
    setCategory('jalan');
    setSeverity('sedang');
    setReporterEmail('');
    setErrorMessage(null);
    setSubmittedReport(null);
    setCurrentStep('upload');
  };

  // ── SCREEN 3: SUCCESS CONFIRMATION ──
  if (submittedReport) {
    return (
      <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
        <div className="max-w-3xl mx-auto w-full space-y-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#161918] border border-[#2E7D32]/60 shadow-2xl text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="w-16 h-16 rounded-full bg-[#1B5E20]/30 border border-[#2E7D32]/60 flex items-center justify-center text-[#81C784] mx-auto shadow-lg shadow-[#2E7D32]/20 animate-bounce">
              <CheckIcon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#81C784] tracking-wide uppercase">
                Laporan Berhasil Diterbitkan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F2F0] tracking-tight">
                Laporan Anda Telah Masuk ke Radar Publik
              </h2>
              <p className="text-sm text-[#9BA39E] max-w-lg mx-auto leading-relaxed">
                Terima kasih atas partisipasi Anda dalam menjaga fasilitas publik. Laporan telah tercatat dan dapat dipantau oleh seluruh masyarakat.
              </p>
            </div>

            {/* Summary Details Box */}
            <div className="p-5 rounded-2xl bg-[#0D0F0E] border border-[#2A2E2C] text-left space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between border-b border-[#2A2E2C] pb-2.5">
                <span className="text-[#9BA39E]">Judul Laporan:</span>
                <span className="font-semibold text-[#F2F2F0] text-right truncate max-w-[240px]">
                  {submittedReport.title}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#2A2E2C] pb-2.5">
                <span className="text-[#9BA39E]">Kategori:</span>
                <span className="font-semibold text-[#81C784] capitalize">
                  {submittedReport.category}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[#2A2E2C] pb-2.5">
                <span className="text-[#9BA39E]">Koordinat Titik:</span>
                <span className="text-[#F2F2F0]">
                  {submittedReport.latitude.toFixed(5)}, {submittedReport.longitude.toFixed(5)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9BA39E]">Status Awal:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1B5E20]/30 text-[#81C784] border border-[#2E7D32]/40 text-xs font-semibold">
                  {submittedReport.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                to="/peta"
                className="py-3 px-6 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <MapPinIcon className="w-4 h-4" />
                <span>Lihat di Peta Radar</span>
              </Link>
              <Link
                to={`/laporan/${submittedReport.id}`}
                className="py-3 px-6 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] hover:border-[#81C784]/50 text-xs sm:text-sm font-semibold text-[#81C784] transition-all flex items-center gap-2"
              >
                <span>Halaman Rincian</span>
              </Link>
              <button
                onClick={handleResetToUpload}
                className="py-3 px-6 rounded-xl bg-[#161918] hover:bg-[#1F2422] border border-[#2A2E2C] text-xs sm:text-sm font-semibold text-[#9BA39E] hover:text-[#F2F2F0] transition-all cursor-pointer"
              >
                Buat Laporan Lain
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ── MAIN CREATION FLOW (STEP-BY-STEP) ──
  return (
    <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full pt-28 pb-32 sm:pb-40 px-4 sm:px-6 lg:px-8 space-y-8 flex-1">
        
        {/* Header Title & Progress Stepper */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#9BA39E]">
            <Link to="/" className="hover:text-[#F2F2F0] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <span className="text-[#81C784] font-semibold">Buat Laporan Baru</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="space-y-1.5 flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F2F2F0] tracking-tight">
                Buat Laporan Fasilitas
              </h1>
              <p className="text-sm sm:text-base text-[#9BA39E] leading-relaxed max-w-2xl">
                {currentStep === 'upload'
                  ? 'Langkah 1 dari 2: Unggah foto bukti kerusakan. AI Fixora akan memindai jenis masalah dan mengunci koordinat GPS secara otomatis.'
                  : 'Langkah 2 dari 2: Periksa hasil analisis AI dan pastikan titik pin pada peta sudah tepat sebelum diterbitkan.'}
              </p>
            </div>

            {/* Stepper Pill Indicator - Single line nowrap */}
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#161918] border border-[#2A2E2C] self-start sm:self-center flex-shrink-0 text-xs font-semibold whitespace-nowrap shadow-sm">
              <div
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  currentStep === 'upload'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-[#81C784]'
                }`}
              >
                <span className="whitespace-nowrap">1. Foto Bukti</span>
                {currentStep === 'review' && <CheckIcon className="w-3.5 h-3.5 flex-shrink-0" />}
              </div>
              <div
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  currentStep === 'review'
                    ? 'bg-[#2E7D32] text-white shadow-sm'
                    : 'text-[#9BA39E]'
                }`}
              >
                <span className="whitespace-nowrap">2. Rincian & Lokasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-[fadeIn_0.3s_ease-out]">
            <AlertTriangleIcon className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 cursor-pointer p-0.5"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STEP 1: UPLOAD FOTO BUKTI (FOCUSED INITIAL STAGE)
           ═══════════════════════════════════════════════════════════ */}
        {currentStep === 'upload' && (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#161918] border border-[#2A2E2C] shadow-2xl space-y-6 animate-[fadeIn_0.4s_ease-out]">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F2F2F0]">
                Unggah Foto Bukti Kerusakan
              </h2>
              <p className="text-xs sm:text-sm text-[#9BA39E] leading-relaxed">
                Pilih atau seret foto fasilitas publik yang rusak. Sistem AI kami akan mendeteksi kategori kerusakan dan mengunci koordinat GPS tanpa pengisian formulir manual.
              </p>
            </div>

            {/* Timestamp Camera Announcement Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#161918] to-[#161918] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Wajib
                    </span>
                    <h3 className="text-sm font-bold text-[#F2F2F0]">
                      Gunakan Foto dengan Timestamp Camera
                    </h3>
                  </div>
                  <p className="text-xs text-[#9BA39E] leading-relaxed">
                    Foto laporan wajib memiliki stempel tanggal, waktu, dan koordinat lokasi (GPS watermark) agar AI Fixora dapat memverifikasi dan memetakan laporan secara akurat.
                  </p>
                </div>
              </div>
              <a
                href="https://play.google.com/store/apps/details?id=com.jeyluta.timestampcamerafree"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] hover:border-[#81C784] text-[#F2F2F0] hover:text-[#81C784] text-xs font-semibold flex items-center gap-2 transition-all shadow-md group cursor-pointer self-stretch sm:self-auto justify-center"
              >
                <GooglePlayIcon className="w-4 h-4" />
                <span>Unduh di Play Store</span>
                <span className="text-[#9BA39E] group-hover:translate-x-0.5 transition-transform text-xs">↗</span>
              </a>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoSelect(file);
              }}
            />

            {/* Big Interactive Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handlePhotoSelect(file);
              }}
              className="border-2 border-dashed border-[#2E7D32]/40 hover:border-[#81C784] bg-[#0D0F0E]/90 hover:bg-[#0D0F0E] rounded-3xl p-10 sm:p-16 text-center cursor-pointer transition-all duration-300 space-y-4 group relative overflow-hidden"
            >
              {/* Scanning Animation State when analyzing */}
              {isAnalyzing ? (
                <div className="space-y-4 py-8">
                  <div className="w-12 h-12 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#81C784] flex items-center justify-center gap-2">
                      <SparklesIcon className="w-5 h-5 animate-pulse" />
                      <span>AI Sedang Memindai Foto...</span>
                    </h3>
                    <p className="text-xs text-[#9BA39E]">
                      Menganalisis objek kerusakan, estimasi keparahan, dan membaca koordinat watermark.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-[#1B5E20]/20 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] mx-auto group-hover:scale-110 group-hover:bg-[#1B5E20]/40 transition-all shadow-lg">
                    <CameraIcon className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-base sm:text-lg font-bold text-[#F2F2F0] block">
                      Pilih Foto Bukti atau Seret ke Sini
                    </span>
                    <span className="text-xs text-[#9BA39E] block">
                      Mendukung format JPG, PNG, atau WebP (Maksimal 10MB)
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161918] border border-[#2E7D32]/40 text-xs text-[#81C784] font-semibold">
                    <SparklesIcon className="w-4 h-4" />
                    <span>AI otomatis mendeteksi masalah & lokasi presisi</span>
                  </div>
                </>
              )}
            </div>

            {/* Timestamp Camera Guidance Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0D0F0E] border border-[#2A2E2C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#1B5E20]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] flex-shrink-0 mt-0.5">
                  <SparklesIcon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#F2F2F0] block">
                    Tips: Gunakan Aplikasi Timestamp Camera
                  </span>
                  <span className="text-[#9BA39E] leading-relaxed">
                    Foto dengan watermark tanggal, waktu, dan koordinat GPS membantu AI memetakan lokasi secara akurat tanpa perlu mengisi formulir panjang.
                  </span>
                </div>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-[#161918] border border-[#2E7D32]/40 text-[11px] text-[#81C784] font-semibold whitespace-nowrap self-start sm:self-center">
                Otomatis & Akurat
              </span>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            STEP 2: FORMULIR AUTO-FILL + MAP PICKER (UNLOCKED AFTER PHOTO)
           ═══════════════════════════════════════════════════════════ */}
        {currentStep === 'review' && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            
            {/* Top Bar: Photo Preview & Change Photo Action */}
            <div className="p-4 sm:p-5 rounded-3xl bg-[#161918] border border-[#2E7D32]/50 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4 min-w-0">
                {photoPreview && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#2E7D32]/60 bg-[#0D0F0E] flex-shrink-0 shadow-md">
                    <img
                      src={photoPreview}
                      alt="Foto Terunggah"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1B5E20]/30 border border-[#2E7D32]/40 text-[11px] text-[#81C784] font-semibold">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>Foto Berhasil Dianalisis AI</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#F2F2F0] truncate">
                    {title || 'Laporan Kerusakan Terdeteksi'}
                  </h3>
                  <p className="text-xs text-[#9BA39E]">
                    Data di bawah telah terisi otomatis. Anda dapat menyesuaikannya bila diperlukan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetToUpload}
                className="py-2 px-3.5 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] hover:border-[#81C784]/50 text-xs font-semibold text-[#81C784] transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
              >
                <CameraIcon className="w-3.5 h-3.5" />
                <span>Ganti Foto</span>
              </button>
            </div>

            {/* ── CARD 1: FORMULIR AUTO-FILL (KLASIFIKASI & RINCIAN) ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#161918] border border-[#2A2E2C] shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-[#2A2E2C] pb-4">
                <div className="w-9 h-9 rounded-xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#F2F2F0]">
                    Rincian & Klasifikasi Laporan
                  </h2>
                  <p className="text-xs text-[#9BA39E]">
                    AI Fixora telah mengisi otomatis data berikut. Anda bebas menyuntingnya.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Judul Laporan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F2F0] block">
                    Judul Laporan <span className="text-[#81C784]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Jalan Berlubang Parah di Depan Pasar"
                    className="w-full bg-[#0D0F0E] text-[#F2F2F0] placeholder-[#9BA39E]/60 text-xs sm:text-sm rounded-xl py-3 px-4 border border-[#2A2E2C] outline-none focus:border-[#2E7D32] transition-colors font-medium"
                  />
                </div>

                {/* Kategori Kerusakan */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#F2F2F0] block">
                    Kategori Kerusakan <span className="text-[#81C784]">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {CATEGORIES.map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1B5E20]/40 border-[#2E7D32] text-[#81C784] shadow-sm font-semibold'
                              : 'bg-[#0D0F0E] border-[#2A2E2C] text-[#9BA39E] hover:text-[#F2F2F0] hover:border-[#2A2E2C]/80'
                          }`}
                        >
                          <span className={isSelected ? 'text-[#81C784]' : 'text-[#9BA39E]'}>
                            {cat.icon}
                          </span>
                          <span className="text-xs">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tingkat Keparahan */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#F2F2F0] block">
                    Tingkat Keparahan <span className="text-[#81C784]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {SEVERITIES.map((sev) => {
                      const isSelected = severity === sev.id;
                      return (
                        <button
                          key={sev.id}
                          type="button"
                          onClick={() => setSeverity(sev.id)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                            isSelected
                              ? 'bg-[#1B5E20]/40 border-[#2E7D32] text-[#81C784] shadow-sm'
                              : 'bg-[#0D0F0E] border-[#2A2E2C] text-[#9BA39E] hover:text-[#F2F2F0]'
                          }`}
                        >
                          <div className="text-xs font-bold capitalize flex items-center justify-between">
                            <span>{sev.label}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#81C784]" />}
                          </div>
                          <p className="text-[11px] text-[#9BA39E] leading-tight">
                            {sev.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deskripsi Tambahan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F2F0] block">
                    Deskripsi Kondisi (Opsional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tambahkan detail kondisi, patokan lokasi, atau dampak bagi warga..."
                    className="w-full bg-[#0D0F0E] text-[#F2F2F0] placeholder-[#9BA39E]/60 text-xs sm:text-sm rounded-xl py-3 px-4 border border-[#2A2E2C] outline-none focus:border-[#2E7D32] transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* ── CARD 2: PENENTUAN TITIK LOKASI PETA ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#161918] border border-[#2A2E2C] shadow-xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2A2E2C] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784]">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#F2F2F0]">
                      Penentuan Titik Lokasi Peta
                    </h2>
                    <p className="text-xs text-[#9BA39E]">
                      Klik atau seret pin pada peta untuk menyesuaikan titik presisi di lapangan.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDetectDeviceGps}
                  disabled={isDetectingGps}
                  className="py-2 px-3.5 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] hover:border-[#2E7D32] text-xs font-semibold text-[#81C784] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>{isDetectingGps ? 'Mendeteksi GPS...' : 'Gunakan GPS Perangkat'}</span>
                </button>
              </div>

              {/* Interactive Leaflet Map Picker */}
              <div className="space-y-3">
                <ReportMapPicker
                  initialLat={latitude}
                  initialLng={longitude}
                  onLocationSelect={(lat, lng, label) => {
                    setLatitude(lat);
                    setLongitude(lng);
                    setLocationLabel(label);
                  }}
                />

                <div className="p-3 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-[#9BA39E]">
                    <span>Koordinat Terpilih:</span>
                    <span className="text-[#81C784] font-semibold">
                      {latitude.toFixed(5)}, {longitude.toFixed(5)}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#9BA39E]">
                    Lokasi otomatis dipetakan ke wilayah Jawa Barat
                  </span>
                </div>
              </div>
            </div>

            {/* ── CARD 3: IDENTITAS PELAPOR & SUBMIT ── */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#161918] border border-[#2A2E2C] shadow-xl space-y-6">
              <div className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-[#F2F2F0]">
                  Informasi Pelapor (Opsional)
                </h2>
                <p className="text-xs text-[#9BA39E] leading-relaxed">
                  Anda tidak wajib login. Masukkan email jika ingin menerima notifikasi ketika laporan diverifikasi atau ditindaklanjuti.
                </p>

                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="nama@email.com (Opsional)"
                  className="w-full bg-[#0D0F0E] text-[#F2F2F0] placeholder-[#9BA39E]/60 text-xs sm:text-sm rounded-xl py-3 px-4 border border-[#2A2E2C] outline-none focus:border-[#2E7D32] transition-colors max-w-md"
                />
              </div>

              {/* Submit Action Bar */}
              <div className="pt-4 border-t border-[#2A2E2C] flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[#9BA39E] max-w-sm">
                  Dengan mengirimkan laporan, data akan ditampilkan secara terbuka di peta radar publik Fixora.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetToUpload}
                    className="py-3 px-5 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] text-xs sm:text-sm font-semibold text-[#9BA39E] hover:text-[#F2F2F0] transition-all cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isAnalyzing}
                    className="py-3 px-7 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-[#2E7D32]/30 active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim Laporan...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>Kirim Laporan Sekarang</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

      </div>

      <Footer />
    </div>
  );
}
