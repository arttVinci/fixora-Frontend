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
