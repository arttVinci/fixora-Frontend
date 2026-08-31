import React, { useState, useRef } from 'react';
import type { IssueCategory, IssueReport, SeverityLevel } from '../../types';
import { analyzePhoto, submitReport } from '../../services/reportService';
import {
  MapPinIcon,
  RoadIcon,
  BridgeIcon,
  TrashIcon,
  BuildingIcon,
  DrainageIcon,
  CheckIcon,
  CloseIcon,
  SendIcon,
  CameraIcon,
} from '../Icons';

export interface PinLocation {
  lat: number;
  lng: number;
}

export type SeverityType = 'ringan' | 'sedang' | 'parah';

interface PinReportModalProps {
  pinLocation: PinLocation | null;
  onClose: () => void;
  onSubmit: (issue: IssueReport) => void;
}

const categories: { id: IssueCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'jalan', label: 'Jalan Rusak', icon: <RoadIcon className="w-4 h-4" /> },
  { id: 'jembatan', label: 'Jembatan', icon: <BridgeIcon className="w-4 h-4" /> },
  { id: 'sampah', label: 'Sampah', icon: <TrashIcon className="w-4 h-4" /> },
  { id: 'bangunan', label: 'Bangunan', icon: <BuildingIcon className="w-4 h-4" /> },
  { id: 'drainase', label: 'Drainase', icon: <DrainageIcon className="w-4 h-4" /> },
];

const severityOptions: { id: SeverityType; label: string; desc: string; activeClass: string; textClass: string }[] = [
  {
    id: 'ringan',
    label: 'Ringan',
    desc: 'Kerusakan kecil / minor',
    activeClass: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300',
    textClass: 'text-emerald-400',
  },
  {
    id: 'sedang',
    label: 'Sedang',
    desc: 'Cukup mengganggu aktivitas',
    activeClass: 'bg-amber-500/20 border-amber-500/60 text-amber-300',
    textClass: 'text-amber-400',
  },
  {
    id: 'parah',
    label: 'Parah',
    desc: 'Sangat membahayakan warga',
    activeClass: 'bg-rose-500/20 border-rose-500/60 text-rose-300',
    textClass: 'text-rose-400',
  },
];

const SEVERITY_TO_LEVEL: Record<SeverityType, SeverityLevel> = {
  ringan: 'rendah',
  sedang: 'sedang',
  parah: 'tinggi',
};

export default function PinReportModal({ pinLocation, onClose, onSubmit }: PinReportModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory | ''>('');
  const [severity, setSeverity] = useState<SeverityType>('sedang');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<IssueReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!pinLocation) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) return;
    if (!photoFile) {
      setSubmitError('Foto bukti wajib diunggah untuk analisis & verifikasi laporan.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const analysis = await analyzePhoto(photoFile);
      const issue = await submitReport({
        reporterName: 'Warga Anonim',
        reporterEmail: '',
        finalCategory: category as IssueCategory,
        finalSeverity: SEVERITY_TO_LEVEL[severity],
        aiCategory: category as IssueCategory,
        aiSeverity: SEVERITY_TO_LEVEL[severity],
        latitude: pinLocation.lat,
        longitude: pinLocation.lng,
        locationLabel: `Koordinat (${pinLocation.lat.toFixed(5)}, ${pinLocation.lng.toFixed(5)})`,
        locationMethod: 'manual',
        title: title.trim(),
        description: description.trim(),
        stagingSessionId: analysis.sessionId,
      });
      setSubmittedReport(issue);
      onSubmit(issue);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Gagal mengirim laporan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-[#0D0F0E]/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-[#161918] border border-[#2E7D32]/50 rounded-2xl p-6 shadow-2xl text-center animate-slide-up">
          <div className="w-14 h-14 rounded-full bg-[#1B5E20]/40 border border-[#2E7D32]/60 text-[#81C784] flex items-center justify-center mx-auto mb-3.5 shadow-lg">
            <CheckIcon className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-bold text-[#F2F2F0] text-lg mb-1">Laporan Berhasil Dibuat!</h3>
          <p className="text-[#9BA39E] text-xs leading-relaxed">
            Laporan <span className="font-mono text-[#81C784]">#{submittedReport.id}</span> telah tercatat dan masuk antrean verifikasi tim.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] text-xs font-bold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-[#0D0F0E]/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-[#161918] border border-[#2A2E2C] rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up overflow-hidden">
        {/* Subtle accent header line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent" />

        {/* Modal Header */}
        <div className="px-5 pt-5 pb-4 border-b border-[#2A2E2C] flex items-center justify-between bg-[#121514]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1B5E20]/30 border border-[#2E7D32]/50 flex items-center justify-center text-[#81C784] shadow-sm">
              <MapPinIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-[#F2F2F0] text-base leading-tight">
                Tandai Lokasi Masalah
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-[#81C784]">
                  {pinLocation.lat.toFixed(5)}, {pinLocation.lng.toFixed(5)}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0D0F0E] text-[#9BA39E] border border-[#2A2E2C]">
                  Sumber: Warga
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] flex items-center justify-center text-[#9BA39E] hover:text-[#F2F2F0] transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin text-left">
          {/* Category selection */}
          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-2 block font-mono">
              Kategori Kerusakan <span className="text-[#81C784]">*</span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1B5E20]/35 border-[#2E7D32] text-[#81C784] shadow-sm shadow-[#2E7D32]/20'
                        : 'bg-[#0D0F0E] border-[#2A2E2C] text-[#9BA39E] hover:bg-[#1F2422] hover:text-[#F2F2F0]'
                    }`}
                  >
                    <span className={isSelected ? 'text-[#81C784]' : 'text-[#9BA39E]'}>
                      {cat.icon}
                    </span>
                    <span className="leading-tight text-center truncate w-full" style={{ fontSize: '10.5px' }}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-1.5 block font-mono">
              Judul Laporan <span className="text-[#81C784]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Aspal amblas di persimpangan jalan"
              className="w-full bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl px-3.5 py-2.5 text-sm text-[#F2F2F0] placeholder-[#9BA39E]/50 focus:outline-none focus:border-[#4CAF50] transition-colors"
              required
            />
          </div>

          {/* Severity selector */}
          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-1.5 block font-mono">
              Tingkat Keparahan <span className="text-[#81C784]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {severityOptions.map((opt) => {
                const isSelected = severity === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSeverity(opt.id)}
                    className={`py-2 px-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? opt.activeClass
                        : 'bg-[#0D0F0E] border-[#2A2E2C] text-[#9BA39E] hover:bg-[#1F2422]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{opt.label}</span>
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-current' : 'bg-[#2A2E2C]'}`} />
                    </div>
                    <p className="text-[10px] text-[#9BA39E] mt-0.5 leading-tight">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo upload / preview */}
          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-1.5 block font-mono">
              Foto Bukti <span className="text-[#81C784]">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {photoPreview ? (
              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#2A2E2C] group bg-[#0D0F0E]">
                <img src={photoPreview} alt="Preview Bukti" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-lg bg-[#161918]/90 text-xs text-[#F2F2F0] border border-[#2A2E2C] hover:bg-[#1F2422] cursor-pointer"
                  >
                    Ganti Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(''); }}
                    className="px-3 py-1 rounded-lg bg-rose-500/80 text-xs text-white hover:bg-rose-600 cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-[#2A2E2C] hover:border-[#2E7D32]/60 rounded-xl p-3.5 bg-[#0D0F0E]/60 text-center transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#161918] border border-[#2A2E2C] flex items-center justify-center text-[#81C784]">
                    <CameraIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-[#F2F2F0] font-medium">Unggah Foto Lokasi</p>
                    <p className="text-[10px] text-[#9BA39E]">Format JPG / PNG</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#1B5E20]/30 hover:bg-[#1B5E20]/50 border border-[#2E7D32]/50 text-xs text-[#81C784] font-semibold cursor-pointer transition-all"
                >
                  Pilih File
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-1.5 block font-mono">
              Deskripsi Tambahan <span className="text-[#9BA39E]/60 font-normal lowercase">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan rincian kerusakan atau patokan jalan..."
              rows={2}
              className="w-full bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl px-3.5 py-2 text-xs text-[#F2F2F0] placeholder-[#9BA39E]/50 focus:outline-none focus:border-[#4CAF50] transition-colors resize-none"
            />
          </div>

          {/* Error banner */}
          {submitError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {submitError}
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] text-[#9BA39E] text-xs font-semibold hover:bg-[#1F2422] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !category || !photoFile}
              className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] text-xs font-bold shadow-lg shadow-[#2E7D32]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <SendIcon className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Mengirim…' : 'Kirim Laporan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
