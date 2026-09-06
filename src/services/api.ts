import type { WebResponse } from '../types/api';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://api.portofy.net/api'
).replace(/\/+$/, '');

export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const isFormData =
    typeof FormData !== 'undefined' && options?.body instanceof FormData;

  const response = await fetch(url, {
    ...options,
    headers: isFormData
      ? {}
      : {
          'Content-Type': 'application/json',
          ...(options?.headers as Record<string, string> | undefined),
        },
  });

  if (!response.ok) {
    try {
      const errBody: WebResponse<null> = await response.json();
      throw new Error(errBody.message || `HTTP error ${response.status}`);
    } catch {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
  }

  const body: WebResponse<T> = await response.json();

  if (!body.success) {
    throw new Error(body.message || 'Request gagal');
  }

  return body.data;
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ''
  ) as [string, string | number | boolean][];

  if (entries.length === 0) return '';

  const qs = new URLSearchParams(
    entries.map(([k, v]) => [k, String(v)])
  );

  return `?${qs.toString()}`;
}
