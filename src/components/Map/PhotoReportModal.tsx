import { useState } from 'react';
import type { IssueCategory } from '../../types';
import {
  CameraIcon,
  MapPinIcon,
  LocationTargetIcon,
  CheckIcon,
  CloseIcon,
  SparklesIcon,
  InfoIcon,
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
      <div className="absolute inset-0 bg-[#0D0F0E]/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-[#161918] border border-[#2A2E2C] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#F2F2F0] animate-slide-up">

        <div className="px-6 py-4 border-b border-[#2A2E2C] flex items-center justify-between bg-[#0D0F0E]">
          <h2 className="text-xl font-bold text-[#F2F2F0]">Laporan foto</h2>
          <button
            onClick={onClose}
            className="text-[#9BA39E] hover:text-[#F2F2F0] w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1F2422] transition-all text-sm"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-[#1B5E20]/30 border border-[#2E7D32]/50 text-[#81C784] rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#F2F2F0]">Laporan Berhasil Terkirim!</h3>
              <p className="text-sm text-[#9BA39E]">
                Terima kasih telah berkontribusi. Laporan kamu sedang diverifikasi oleh tim & AI.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="flex items-center gap-2 text-xs font-semibold text-[#81C784]">
                <span className="w-2 h-2 bg-[#2E7D32] rounded-full animate-ping"></span>
                <span>Didukung oleh Fixora AI</span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F2F2F0] mb-2">
                  Foto <span className="text-[#81C784]">*</span>
                </label>

                <div className="border border-[#2A2E2C] bg-[#0D0F0E] rounded-2xl p-5 text-center space-y-3">
                  {uploadedPhotos.length > 0 && (
                    <div className="flex gap-3 justify-center mb-3 flex-wrap">
                      {uploadedPhotos.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#2A2E2C]">
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
                      <div className="w-8 h-8 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs text-[#81C784] font-medium flex items-center justify-center gap-1">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Fixora AI sedang menganalisis foto...</span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <label className="inline-flex items-center gap-2 bg-[#1B5E20]/30 hover:bg-[#2E7D32]/40 text-[#81C784] border border-[#2E7D32]/50 px-6 py-3 rounded-2xl text-sm font-bold cursor-pointer transition-all">
                        <CameraIcon className="w-5 h-5" />
                        <span>Klik untuk mengunggah</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSimulateUpload}
                          className="hidden"
                        />
                      </label>

                      <div className="text-xs text-[#9BA39E] space-y-1">
                        <p>atau melalui seret & lepas · {uploadedPhotos.length}/3</p>
                        <p className="text-[#9BA39E]/80 text-[11px]">Dilarang memotret orang/plat nomor kendaraan.</p>
                        <p className="text-[#9BA39E] text-[11px] flex items-center justify-center gap-1.5">
                          <span>Analisis melalui Fixora AI (Indonesia)</span>
                          <InfoIcon className="w-3.5 h-3.5 text-[#9BA39E]" />
                        </p>
                      </div>

                      {uploadedPhotos.length === 0 && (
                        <button
                          type="button"
                          onClick={handleDemoPhotoSelect}
                          className="text-xs text-[#81C784] hover:text-[#4CAF50] underline font-medium pt-1 block mx-auto"
                        >
                          (Atau klik di sini untuk simulasi contoh foto jalan rusak)
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F2F2F0] mb-2">
                  kategori <span className="text-[#81C784]">*</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                  className="w-full bg-[#0D0F0E] border border-[#2A2E2C] text-[#F2F2F0] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#4CAF50] transition-colors cursor-pointer"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F2F2F0] mb-1">
                  Keterangan <span className="text-[#81C784]">*</span>
                </label>
                <p className="text-xs text-[#9BA39E] mb-2">
                  Ini dihasilkan secara otomatis dari foto. Anda dapat menyesuaikan teksnya.
                </p>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Teks dihasilkan dari foto..."
                  required
                  className="w-full bg-[#0D0F0E] border border-[#2A2E2C] text-[#F2F2F0] text-sm rounded-xl p-3 focus:outline-none focus:border-[#4CAF50] transition-colors resize-none placeholder-[#9BA39E]/60"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F2F2F0] mb-1">
                  Lokasi <span className="text-[#81C784]">*</span>
                </label>
                <p className="text-xs text-[#9BA39E] mb-2">
                  Masukkan alamat atau gunakan lokasi Anda saat ini.
                </p>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-[#9BA39E]">
                    <MapPinIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Temukan lokasi..."
                    required
                    className="w-full bg-[#0D0F0E] border border-[#2A2E2C] text-[#F2F2F0] text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#4CAF50] transition-colors placeholder-[#9BA39E]/60"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    title="Gunakan lokasi saya"
                    className="absolute right-3 top-3 text-[#9BA39E] hover:text-[#81C784] p-1"
                  >
                    <LocationTargetIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F2F2F0] mb-1">
                  e-mail
                </label>
                <p className="text-xs text-[#9BA39E] mb-2">
                  Alamat email kontak Anda
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email Anda"
                  className="w-full bg-[#0D0F0E] border border-[#2A2E2C] text-[#F2F2F0] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#4CAF50] transition-colors placeholder-[#9BA39E]/60"
                />
              </div>

              <div className="text-xs text-[#9BA39E]">
                Anda dapat menemukan informasi tentang perlindungan data di sini.{' '}
                <a href="#" className="text-[#81C784] underline font-medium hover:text-[#4CAF50]">
                  Di Sini
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] font-bold py-3.5 rounded-xl shadow-lg transition-all text-base transform hover:scale-[1.01] active:scale-[0.99]"
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
