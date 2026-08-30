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
      <div className="absolute inset-0 bg-[#0D0F0E]/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-[#161918] backdrop-blur-2xl border border-[#2A2E2C] rounded-t-3xl sm:rounded-2xl shadow-2xl animate-float-in overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent" />

        <div className="px-5 pt-5 pb-4 border-b border-[#2A2E2C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1B5E20]/30 border border-[#2E7D32]/50 flex items-center justify-center text-[#81C784]">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-[#F2F2F0] text-base">Tandai Lokasi Masalah</h2>
                <p className="text-[#9BA39E] text-xs mt-0.5">
                  {pinLocation.lat.toFixed(5)}, {pinLocation.lng.toFixed(5)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#0D0F0E] hover:bg-[#1F2422] border border-[#2A2E2C] flex items-center justify-center text-[#9BA39E] hover:text-[#F2F2F0] transition-all text-sm active:scale-95"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-2 block">
              Jenis Masalah
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
                    category === cat.id
                      ? 'bg-[#1B5E20]/30 border-[#2E7D32] text-[#81C784]'
                      : 'bg-[#0D0F0E] border-[#2A2E2C] text-[#9BA39E] hover:bg-[#1F2422] hover:text-[#F2F2F0]'
                  }`}
                >
                  <span className="text-[#81C784]">{cat.icon}</span>
                  <span className="leading-tight text-center" style={{ fontSize: '10px' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-2 block">
              Judul Laporan <span className="text-[#81C784]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Jalan berlubang depan sekolah"
              className="w-full bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl px-4 py-2.5 text-sm text-[#F2F2F0] placeholder-[#9BA39E]/60 focus:outline-none focus:border-[#4CAF50] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9BA39E] uppercase tracking-wider mb-2 block">
              Deskripsi <span className="text-[#9BA39E]/70 font-normal normal-case">(opsional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi masalah secara singkat..."
              rows={3}
              className="w-full bg-[#0D0F0E] border border-[#2A2E2C] rounded-xl px-4 py-2.5 text-sm text-[#F2F2F0] placeholder-[#9BA39E]/60 focus:outline-none focus:border-[#4CAF50] transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] text-[#9BA39E] text-sm font-semibold hover:bg-[#1F2422] transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !category}
              className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] text-sm font-bold shadow-lg shadow-[#2E7D32]/25 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
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
