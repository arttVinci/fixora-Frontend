import { useState } from 'react';
import type { IssueCategory } from '../../types';
import {
  CameraIcon,
  MapPinIcon,
  LocationTargetIcon,
  CheckIcon,
  CloseIcon,
  SparklesIcon,
} from '../Icons';

interface PhotoReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categories: { id: IssueCategory; label: string }[] = [
  { id: 'jalan', label: 'Jalan Rusak' },
  { id: 'jembatan', label: 'Jembatan Rawan' },
  { id: 'sampah', label: 'Sampah Menumpuk' },
  { id: 'bangunan', label: 'Bangunan Terbengkalai' },
  { id: 'drainase', label: 'Drainase Tersumbat' },
];

export default function PhotoReportModal({ isOpen, onClose }: PhotoReportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      processPhotoUpload(url);
    }
  };

  const handleDemoPhotoSelect = () => {
    const demoPhoto = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800';
    processPhotoUpload(demoPhoto);
  };

  const processPhotoUpload = (photoUrl: string) => {
    if (uploadedPhotos.length >= 3) return;

    setUploadedPhotos(prev => [...prev, photoUrl]);
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setSelectedCategory('jalan');
      setDescription('Terdeteksi kerusakan permukaan jalan berlubang dengan kedalaman ~8cm. Potensi bahaya bagi pengguna jalan.');
      if (!location) setLocation('Jl. Jend. Sudirman No. 42, Jakarta Pusat');
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setUploadedPhotos([]);
      setSelectedCategory('');
      setDescription('');
      setLocation('');
      setEmail('');
      onClose();
    }, 2000);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Lokasi Saat Ini)`);
        },
        () => setLocation('Jakarta Pusat, DKI Jakarta')
      );
    } else {
      setLocation('Jakarta Pusat, DKI Jakarta');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 animate-slide-up">

        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <h2 className="text-xl font-bold text-white">Laporan foto</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 transition-all text-sm"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/40 text-green-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Laporan Berhasil Terkirim!</h3>
              <p className="text-sm text-slate-400">
                Terima kasih telah berkontribusi. Laporan kamu sedang diverifikasi oleh tim & AI.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                <span>Didukung oleh AI</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Foto <span className="text-red-500">*</span>
                </label>

                <div className="border border-slate-800 bg-slate-900/50 rounded-2xl p-5 text-center space-y-3">
                  {uploadedPhotos.length > 0 && (
                    <div className="flex gap-3 justify-center mb-3 flex-wrap">
                      {uploadedPhotos.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
                          <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <CloseIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {isAnalyzing ? (
                    <div className="py-4 space-y-2">
                      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-red-400 font-medium flex items-center justify-center gap-1">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Fixora AI sedang menganalisis foto...</span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <label className="inline-flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all">
                        <CameraIcon className="w-5 h-5" />
                        <span>Klik untuk mengunggah</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSimulateUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="text-xs text-slate-400 space-y-1">
                        <p>atau melalui seret & lepas · {uploadedPhotos.length}/3</p>
                        <p className="text-slate-500 text-[11px]">Dilarang memotret orang/plat nomor kendaraan.</p>
                        <p className="text-slate-500 text-[11px] flex items-center justify-center gap-1">
                          <span>Analisis melalui Fixora AI (Indonesia)</span>
                          <span className="cursor-pointer text-slate-400">ⓘ</span>
                        </p>
                      </div>

                      {uploadedPhotos.length === 0 && (
                        <button
                          type="button"
                          onClick={handleDemoPhotoSelect}
                          className="text-xs text-red-400 hover:text-red-300 underline font-medium pt-1 block mx-auto"
                        >
                          (Atau klik di sini untuk simulasi contoh foto jalan rusak)
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1">
                  Keterangan <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Ini dihasilkan secara otomatis dari foto. Anda dapat menyesuaikan teksnya.
                </p>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Teks dihasilkan dari foto..."
                  required
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:border-red-500 transition-colors resize-none placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Masukkan alamat atau gunakan lokasi Anda saat ini.
                </p>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-500">
                    <MapPinIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Temukan lokasi..."
                    required
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-red-500 transition-colors placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    title="Gunakan lokasi saya"
                    className="absolute right-3 top-3 text-slate-400 hover:text-red-400 p-1"
                  >
                    <LocationTargetIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-1">
                  e-mail
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Alamat email kontak Anda
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email Anda"
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors placeholder-slate-500"
                />
              </div>

              <div className="text-xs text-slate-400">
                Anda dapat menemukan informasi tentang perlindungan data di sini.{' '}
                <a href="#" className="text-red-400 underline font-medium hover:text-red-300">
                  Di Sini
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-base transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Kirim pesan
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
