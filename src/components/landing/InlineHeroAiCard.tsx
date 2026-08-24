import { useState, useEffect, useRef } from 'react';
import type { IssueCategory, SeverityLevel, ReportSubmission, IssueReport } from '../../types';
import { simulateCvClassifier, submitReport, getGreeting } from '../../services/reportService';
import ReportMapPicker from '../ReportMapPicker';
import {
  SparklesIcon,
  CameraIcon,
  MapPinIcon,
  GpsIcon,
  CheckIcon,
  EditIcon,
  PlusIcon,
  ArrowRightIcon,
  SendIcon,
} from '../Icons';

type Step =
  | 'greeting'
  | 'name'
  | 'email'
  | 'photo'
  | 'classifying'
  | 'confirm_ai'
  | 'manual_category'
  | 'location'
  | 'map_picker'
  | 'description'
  | 'submitting'
  | 'done';

type ChatMessage = {
  from: 'ai' | 'user';
  text: string;
  type?: 'normal' | 'success' | 'error' | 'ai_result';
};

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  jalan: 'Jalan Rusak',
  jembatan: 'Jembatan',
  sampah: 'Sampah',
  bangunan: 'Bangunan',
  drainase: 'Drainase',
};

const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  rendah: 'Rendah',
  sedang: 'Sedang',
  tinggi: 'Tinggi',
  kritis: 'Kritis',
};

type InlineHeroAiCardProps = {
  onReportSubmitted?: (report: IssueReport) => void;
  onScrollToMap?: () => void;
};

const emptyReport = (): Partial<ReportSubmission> => ({
  locationMethod: null,
});

export default function InlineHeroAiCard({ onReportSubmitted, onScrollToMap }: InlineHeroAiCardProps) {
  const [step, setStep] = useState<Step>('greeting');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [report, setReport] = useState<Partial<ReportSubmission>>(emptyReport());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ category: IssueCategory; severity: SeverityLevel; confidence: number; description: string } | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const greeting = getGreeting();

  useEffect(() => {
    setMessages([
      { from: 'ai', text: `${greeting}! Saya AI Fixora. Ada kerusakan jalan, jembatan, atau fasilitas umum di sekitarmu? Tuliskan di sini atau upload foto langsung.` }
    ]);
  }, [greeting]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addAiMessage = (text: string, type: ChatMessage['type'] = 'normal') =>
    setMessages(prev => [...prev, { from: 'ai', text, type }]);

  const addUserMessage = (text: string) =>
    setMessages(prev => [...prev, { from: 'user', text }]);

  const handleStartReport = () => {
    addUserMessage('Buat Laporan Baru 🚀');
    setTimeout(() => {
      addAiMessage('Siap! Siapa nama kamu? (akan disimpan secara internal)');
      setStep('name');
    }, 300);
  };

  const handleNameSubmit = () => {
    const name = inputValue.trim();
    if (!name) return;
    addUserMessage(name);
    setReport(r => ({ ...r, reporterName: name }));
    setInputValue('');
    setTimeout(() => {
      addAiMessage(`Halo ${name}! Masukkan email kamu untuk menerima pembaruan status laporan:`);
      setStep('email');
    }, 300);
  };

  const handleEmailSubmit = () => {
    const email = inputValue.trim();
    if (!email || !email.includes('@')) {
      addAiMessage('⚠️ Format email tidak valid. Coba lagi ya!', 'error');
      setInputValue('');
      return;
    }
    addUserMessage(email);
    setReport(r => ({ ...r, reporterEmail: email }));
    setInputValue('');
    setTimeout(() => {
      addAiMessage('📸 Mantap! Sekarang pilih foto kerusakan. Klik tombol 📷 di bawah ini:');
      setStep('photo');
    }, 300);
  };

  const handlePhotoUpload = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    addUserMessage(`📎 ${file.name}`);
    setReport(r => ({ ...r, imageFile: file, imagePreviewUrl: previewUrl }));
    setTimeout(() => {
      addAiMessage('⚙️ Menganalisis foto dengan AI Vision Classifier…');
      setStep('classifying');
    }, 300);
    try {
      const result = await simulateCvClassifier(file);
      setAiResult(result);
      setReport(r => ({ ...r, aiCategory: result.category, aiSeverity: result.severity, finalCategory: result.category, finalSeverity: result.severity }));
      setStep('confirm_ai');
      addAiMessage(
        `🤖 Hasil Analisis AI: **${result.description}** (Kategori: ${result.category.toUpperCase()}, Keparahan: ${result.severity.toUpperCase()}, Kepercayaan: ${result.confidence}%). Apakah sesuai?`,
        'ai_result'
      );
    } catch {
      addAiMessage('⚠️ Gagal menganalisis foto. Silakan pilih kategori secara manual.', 'error');
      setStep('manual_category');
    }
  };

  const handleConfirmAi = (accepted: boolean) => {
    if (accepted) {
      addUserMessage('Ya, sesuai ✓');
      setStep('location');
      setTimeout(() => addAiMessage('Bagaimana lokasi masalah ini ditentukan?'), 300);
    } else {
      addUserMessage('Tidak, koreksi kategori');
      setStep('manual_category');
      setTimeout(() => addAiMessage('Silakan pilih kategori dan tingkat keparahan yang paling tepat:'), 300);
    }
  };

  const handleManualCategory = (category: IssueCategory, severity: SeverityLevel) => {
    addUserMessage(`Kategori: ${CATEGORY_LABELS[category]}, Keparahan: ${SEVERITY_LABELS[severity]}`);
    setReport(r => ({ ...r, finalCategory: category, finalSeverity: severity }));
    setStep('location');
    setTimeout(() => addAiMessage('Bagaimana lokasi masalah ini ditentukan?'), 300);
  };

  const handleGpsLocation = () => {
    addUserMessage('Gunakan GPS Otomatis 📡');
    if (!navigator.geolocation) {
      addAiMessage('⚠️ Geolocation tidak didukung di browser ini. Gunakan pin manual.', 'error');
      setStep('map_picker');
      return;
    }
    addAiMessage('Mengambil koordinat GPS…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setReport(r => ({ ...r, latitude: lat, longitude: lng, locationMethod: 'gps', locationLabel: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}` }));
        addAiMessage(`📍 Lokasi GPS terdeteksi: (${lat.toFixed(4)}, ${lng.toFixed(4)})`, 'success');
        setStep('description');
        setTimeout(() => addAiMessage('Ada catatan atau deskripsi tambahan? (opsional, tekan Enter untuk lewati)'), 300);
      },
      () => {
        addAiMessage('⚠️ Gagal mendapatkan GPS. Silakan tentukan lokasi di peta.', 'error');
        setStep('map_picker');
      }
    );
  };

  const handleManualPin = () => {
    addUserMessage('Pin lokasi manual di peta 🗺️');
    setStep('map_picker');
    setTimeout(() => addAiMessage('Pilih atau seret titik lokasi pada peta di bawah ini:'), 300);
  };

  const handleMapConfirmButton = () => {
    addUserMessage(`📍 Lokasi dipilih: ${report.locationLabel || 'Peta Manual'}`);
    setStep('description');
    setTimeout(() => addAiMessage('Ada catatan atau deskripsi tambahan? (opsional, tekan Enter untuk lewati)'), 300);
  };

  const handleDescriptionSubmit = async () => {
    const desc = inputValue.trim();
    addUserMessage(desc || '(tanpa keterangan tambahan)');
    setReport(r => ({ ...r, description: desc }));
    setInputValue('');
    setStep('submitting');
    addAiMessage('📤 Mengirim laporan ke sistem Fixora…');
    await new Promise(res => setTimeout(res, 1000));
    try {
      const newReport = submitReport({
        ...report,
        reporterName: report.reporterName || 'Warga Anonim',
        reporterEmail: report.reporterEmail || 'warga@fixora.id',
        finalCategory: report.finalCategory || 'jalan',
        finalSeverity: report.finalSeverity || 'sedang',
        locationMethod: report.locationMethod || 'manual',
        description: desc,
      });
      setReportId(newReport.id);
      setStep('done');
      addAiMessage(`🎉 Laporan #${newReport.id} berhasil terkirim dan telah ditambahkan ke Peta Interaktif! Terima kasih telah berpartisipasi.`, 'success');
      if (onReportSubmitted) onReportSubmitted(newReport);
    } catch {
      addAiMessage('⚠️ Gagal mengirim laporan. Coba lagi.', 'error');
      setStep('description');
    }
  };

  const handleReset = () => {
    setStep('greeting');
    setReport(emptyReport());
    setImagePreview(null);
    setAiResult(null);
    setReportId(null);
    setInputValue('');
    setMessages([{ from: 'ai', text: `👋 Ada laporan infrastruktur lain yang ingin dibuat?` }]);
  };

  const handleInputFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (step === 'greeting') {
      const text = inputValue.trim();
      setInputValue('');
      addUserMessage(text);
      setReport(r => ({ ...r, description: text }));
      setTimeout(() => {
        addAiMessage('Siap! Masukkan nama kamu dulu ya:');
        setStep('name');
      }, 300);
    } else if (step === 'name') {
      handleNameSubmit();
    } else if (step === 'email') {
      handleEmailSubmit();
    } else if (step === 'description') {
      handleDescriptionSubmit();
    }
  };

  const isInputStep = step === 'greeting' || step === 'name' || step === 'email' || step === 'description';

  return (
    <div className="relative z-10 w-full max-w-lg bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl ring-1 ring-primary-500/30 overflow-hidden flex flex-col text-left">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-rose-500 to-amber-500 rounded-t-2xl" />

      {/* Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-white/10 bg-slate-900/80 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-500/20 border border-primary-500/40 flex items-center justify-center text-primary-400 shadow-glow">
            <SparklesIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-sm">Fixora AI Assistant</h3>
            <p className="text-[10px] text-slate-400">Asisten Pelaporan Interaktif Real-time</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Online
        </span>
      </div>

      {/* Chat Messages Body */}
      <div ref={chatContainerRef} className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3 max-h-[340px] sm:max-h-[380px] scrollbar-thin">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-start gap-2.5 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.from === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-rose-600 flex-shrink-0 flex items-center justify-center text-white shadow-md mt-0.5">
                <SparklesIcon className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.from === 'user'
                  ? 'bg-primary-600 text-white rounded-tr-xs'
                  : msg.type === 'error'
                  ? 'bg-red-500/20 border border-red-500/40 text-red-200 rounded-tl-xs'
                  : msg.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/40 text-green-200 rounded-tl-xs'
                  : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {imagePreview && (
          <div className="flex justify-end">
            <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-primary-500/40 shadow-md" />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Action Controls & Input Bar */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/70 flex-shrink-0 space-y-2">
        {step === 'greeting' && (
          <div className="flex flex-wrap gap-1.5 pb-1">
            <button
              onClick={handleStartReport}
              className="bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Buat Laporan Baru</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
            >
              <CameraIcon className="w-3.5 h-3.5" />
              <span>Upload Foto</span>
            </button>
            <button
              onClick={onScrollToMap}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
            >
              <MapPinIcon className="w-3.5 h-3.5" />
              <span>Lihat Peta</span>
            </button>
          </div>
        )}

        {step === 'photo' && (
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <CameraIcon className="w-4 h-4" />
              <span>Pilih / Ambil Foto</span>
            </button>
          </div>
        )}

        {step === 'confirm_ai' && aiResult && (
          <div className="flex gap-2">
            <button
              onClick={() => handleConfirmAi(true)}
              className="flex-1 py-2 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold hover:bg-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Sesuai</span>
            </button>
            <button
              onClick={() => handleConfirmAi(false)}
              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-1"
            >
              <EditIcon className="w-4 h-4" />
              <span>Ubah Kategori</span>
            </button>
          </div>
        )}

        {step === 'manual_category' && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1">
              {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setReport(r => ({ ...r, finalCategory: cat }))}
                  className={`py-1.5 px-2 rounded-xl text-xs transition-all border ${
                    report.finalCategory === cat ? 'bg-primary-500/30 border-primary-500/50 text-primary-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(Object.keys(SEVERITY_LABELS) as SeverityLevel[]).map(sev => (
                <button
                  key={sev}
                  onClick={() => setReport(r => ({ ...r, finalSeverity: sev }))}
                  className={`py-1 px-1.5 rounded-xl text-[10px] transition-all border ${
                    report.finalSeverity === sev ? 'bg-yellow-500/30 border-yellow-500/50 text-yellow-300 font-bold' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {SEVERITY_LABELS[sev]}
                </button>
              ))}
            </div>
            <button
              disabled={!report.finalCategory || !report.finalSeverity}
              onClick={() => handleManualCategory(report.finalCategory!, report.finalSeverity!)}
              className="w-full py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1"
            >
              <span>Lanjutkan</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === 'location' && (
          <div className="flex gap-2">
            <button onClick={handleGpsLocation} className="flex-1 py-2 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold hover:bg-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-1.5">
              <GpsIcon className="w-4 h-4" />
              <span>GPS Otomatis</span>
            </button>
            <button onClick={handleManualPin} className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-1.5">
              <MapPinIcon className="w-4 h-4" />
              <span>Pin di Peta</span>
            </button>
          </div>
        )}

        {step === 'map_picker' && (
          <div className="space-y-2">
            <ReportMapPicker onLocationSelect={(lat, lng, label) => setReport(r => ({ ...r, latitude: lat, longitude: lng, locationMethod: 'manual', locationLabel: label }))} />
            <button onClick={handleMapConfirmButton} className="w-full py-2 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-500 transition-all flex items-center justify-center gap-1">
              <span>Konfirmasi Lokasi</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === 'done' && reportId && (
          <button onClick={handleReset} className="w-full py-2.5 rounded-xl bg-primary-600/30 border border-primary-500/50 text-primary-200 text-xs font-bold hover:bg-primary-600/40 transition-all flex items-center justify-center gap-1.5">
            <PlusIcon className="w-4 h-4" />
            <span>Buat Laporan Lain</span>
          </button>
        )}

        {/* Input Bar with Camera Icon Button */}
        <form onSubmit={handleInputFormSubmit} className="relative flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload Foto Pelaporan"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
          >
            <CameraIcon className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={!isInputStep}
            placeholder={
              step === 'name'
                ? 'Ketik nama kamu...'
                : step === 'email'
                ? 'Ketik email kamu...'
                : step === 'description'
                ? 'Ketik keterangan tambahan...'
                : 'Tulis pesan atau masalah di sekitarmu...'
            }
            className="flex-1 bg-slate-900/90 text-white placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-primary-500 transition-all shadow-inner disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={!isInputStep || !inputValue.trim()}
            className="w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Kirim"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
