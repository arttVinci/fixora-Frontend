import React, { useState } from 'react';
import type { IssueCategory } from '../../types';
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
} from '../Icons';

interface PinLocation {
  lat: number;
  lng: number;
}

interface PinReportModalProps {
  pinLocation: PinLocation | null;
  onClose: () => void;
  onSubmit: (data: { title: string; category: IssueCategory; description: string; lat: number; lng: number }) => void;
}

const categories: { id: IssueCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'jalan', label: 'Jalan Rusak', icon: <RoadIcon className="w-5 h-5" /> },
  { id: 'jembatan', label: 'Jembatan', icon: <BridgeIcon className="w-5 h-5" /> },
  { id: 'sampah', label: 'Sampah', icon: <TrashIcon className="w-5 h-5" /> },
  { id: 'bangunan', label: 'Bangunan', icon: <BuildingIcon className="w-5 h-5" /> },
  { id: 'drainase', label: 'Drainase', icon: <DrainageIcon className="w-5 h-5" /> },
];

export default function PinReportModal({ pinLocation, onClose, onSubmit }: PinReportModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<IssueCategory | ''>('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!pinLocation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmit({ title: title.trim(), category: category as IssueCategory, description, lat: pinLocation.lat, lng: pinLocation.lng });
      onClose();
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-sm bg-gradient-to-br from-green-900/90 to-emerald-900/90 backdrop-blur-2xl border border-green-500/30 rounded-2xl p-6 shadow-2xl text-center animate-float-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckIcon className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-white text-lg mb-1">Laporan Terkirim!</h3>
          <p className="text-green-300 text-sm">Terima kasih sudah melaporkan masalah ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-dark-surface/95 backdrop-blur-2xl border border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl animate-float-in overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-white text-base">Tandai Lokasi Masalah</h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  {pinLocation.lat.toFixed(5)}, {pinLocation.lng.toFixed(5)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all text-sm active:scale-95"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Jenis Masalah
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all active:scale-95 ${category === cat.id
                      ? 'bg-red-500/20 border-red-500/60 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <span className="text-slate-200">{cat.icon}</span>
                  <span className="leading-tight text-center" style={{ fontSize: '10px' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Judul Laporan <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jalan berlubang depan sekolah"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:bg-white/8 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Deskripsi <span className="text-slate-500 font-normal normal-case">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi masalah secara singkat..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/60 focus:bg-white/8 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !category}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-rose-500 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <SendIcon className="w-4 h-4" />
              <span>Kirim Laporan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
