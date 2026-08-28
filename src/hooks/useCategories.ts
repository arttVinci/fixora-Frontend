import { useState, useEffect } from 'react';
import type { ApiCategory } from '../types/api';
import { fetchCategories } from '../services/reportApiService';

const FALLBACK_CATEGORIES: ApiCategory[] = [
  { id: '1', name: 'Jalan Rusak', slug: 'jalan' },
  { id: '2', name: 'Jembatan', slug: 'jembatan' },
  { id: '3', name: 'Sampah', slug: 'sampah' },
  { id: '4', name: 'Bangunan', slug: 'bangunan' },
  { id: '5', name: 'Drainase', slug: 'drainase' },
];

interface UseCategoriesResult {
  categories: ApiCategory[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCategories();
        if (!cancelled) {
          setCategories(data.length > 0 ? data : FALLBACK_CATEGORIES);
        }
      } catch (err) {
        if (!cancelled) {
          console.warn('[useCategories] Gagal fetch dari backend, pakai fallback:', err);
          setCategories(FALLBACK_CATEGORIES);
          setError(err instanceof Error ? err.message : 'Gagal memuat kategori');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { categories, loading, error };
}
