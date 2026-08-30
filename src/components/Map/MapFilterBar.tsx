import { useState, useMemo } from 'react';
import type { IssueCategory } from '../../types';
import type { FilterState } from './InteractiveMap';

interface MapFilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const categories: IssueCategory[] = ['jalan', 'jembatan', 'sampah', 'bangunan', 'drainase'];
const categoryLabels: Record<IssueCategory, string> = {
  jalan: 'Jalan',
  jembatan: 'Jembatan',
  sampah: 'Sampah',
  bangunan: 'Bangunan',
  drainase: 'Drainase',
};

export default function MapFilterBar({ filters, onFiltersChange }: MapFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length !== categories.length) count += 1;
    if (filters.duration !== 'all') count += 1;
    if (filters.source !== 'all') count += 1;
    return count;
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    onFiltersChange(newFilters);
  };

  const toggleCategory = (category: IssueCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    handleFilterChange({ ...filters, categories: newCategories });
  };

  const selectAllCategories = () => {
    handleFilterChange({ ...filters, categories: [...categories] });
  };

  const clearCategories = () => {
    handleFilterChange({ ...filters, categories: [] });
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="absolute top-4 right-4 z-[1000] bg-[#2E7D32] text-[#F2F2F0] rounded-full shadow-xl px-4 py-2.5 flex items-center gap-2 hover:bg-[#1B5E20] transition-all border border-[#2E7D32]/50"
      >
        <span className="font-semibold text-xs">Filter</span>
        {activeFilterCount > 0 && (
          <span className="bg-[#161918] text-[#81C784] text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center border border-[#2E7D32]/40">
            {activeFilterCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[1000] backdrop-blur-xl bg-[#161918]/95 rounded-2xl shadow-xl border border-[#2A2E2C] p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#F2F2F0]">Filter Laporan</h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#9BA39E] hover:text-[#F2F2F0] hover:bg-[#1F2422] rounded-full p-1.5 transition-all"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-[#9BA39E] text-xs uppercase tracking-wider">Filter Kategori</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={selectAllCategories}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filters.categories.length === categories.length
                ? 'bg-[#2E7D32] text-[#F2F2F0] border-[#2E7D32]'
                : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:bg-[#1F2422]'
            }`}
          >
            Semua
          </button>
          <button
            onClick={clearCategories}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filters.categories.length === 0
                ? 'bg-[#2E7D32] text-[#F2F2F0] border-[#2E7D32]'
                : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:bg-[#1F2422]'
            }`}
          >
            Hapus
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.categories.includes(category)
                  ? 'bg-[#2E7D32] text-[#F2F2F0] border-[#2E7D32]'
                  : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:bg-[#1F2422]'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-[#9BA39E] text-xs uppercase tracking-wider">Filter Durasi Mangkrak</h3>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all' as const, label: 'Semua Durasi' },
            { key: 'lt7' as const, label: '< 7 Hari' },
            { key: '7to30' as const, label: '7-30 Hari' },
            { key: 'gt30' as const, label: '> 30 Hari' },
          ].map((option) => {
            const isActive = filters.duration === option.key;
            const isCritical = option.key === 'gt30';
            return (
              <button
                key={option.key}
                onClick={() => handleFilterChange({ ...filters, duration: option.key })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isActive
                    ? isCritical
                      ? 'bg-rose-900/60 text-rose-300 border-rose-600'
                      : 'bg-[#2E7D32] text-[#F2F2F0] border-[#2E7D32]'
                    : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:bg-[#1F2422]'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-[#9BA39E] text-xs uppercase tracking-wider">Filter Sumber Data</h3>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all' as const, label: 'Semua Data' },
            { key: 'citizen' as const, label: 'Laporan Warga' },
            { key: 'ai_media' as const, label: 'Terdeteksi AI' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleFilterChange({ ...filters, source: option.key })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.source === option.key
                  ? 'bg-[#2E7D32] text-[#F2F2F0] border-[#2E7D32]'
                  : 'bg-[#0D0F0E] text-[#9BA39E] border-[#2A2E2C] hover:bg-[#1F2422]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
