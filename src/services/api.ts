import type { WebResponse } from '../types/api';

export const API_BASE_URL = '/api';

export async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
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
