// Client API léger pour communiquer avec le backend Express.
//
// - En dev : les requêtes passent par le proxy Vite (/api -> localhost:4000).
// - En prod, si VITE_API_URL est défini (frontend et backend hébergés
//   séparément), il est utilisé comme base. Sinon on suppose que le backend
//   sert aussi le frontend (même origine), voir server/index.ts.
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

const ADMIN_TOKEN_KEY = 'coulidev_admin_token';

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(path: string, options: RequestInit = {}, auth = false): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // Réponse sans corps JSON (ex: erreur réseau amont) : on laisse body à null.
  }

  if (!res.ok) {
    if (auth && res.status === 401) clearAdminToken();
    throw new ApiError(body?.error ?? `Erreur ${res.status}`, res.status, body?.details);
  }

  return body as T;
}

export const api = {
  getPortfolio: () => request<{
    profile: any;
    assets: any;
    projects: any[];
    timeline: any[];
    skills: any[];
  }>('/api/portfolio'),

  login: (password: string) =>
    request<{ token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  updateProfile: (data: Partial<any>) =>
    request('/api/profile', { method: 'PUT', body: JSON.stringify(data) }, true),

  updateAssets: (data: Partial<any>) =>
    request('/api/assets', { method: 'PUT', body: JSON.stringify(data) }, true),

  createProject: (data: any) =>
    request('/api/projects', { method: 'POST', body: JSON.stringify(data) }, true),

  updateProject: (id: string, data: Partial<any>) =>
    request(`/api/projects/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteProject: (id: string) =>
    request(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }, true),

  createTimelineEvent: (data: any) =>
    request('/api/timeline', { method: 'POST', body: JSON.stringify(data) }, true),

  deleteTimelineEvent: (id: number) =>
    request(`/api/timeline/${id}`, { method: 'DELETE' }, true),

  submitContact: (data: { nom: string; email: string; sujet: string; message: string }) =>
    request<{ ok: true; id: number }>('/api/contact', { method: 'POST', body: JSON.stringify(data) }),

  getContactMessages: () =>
    request<
      { id: number; nom: string; email: string; sujet: string; message: string; is_read: boolean; created_at: string }[]
    >('/api/contact', {}, true),

  markMessageRead: (id: number) =>
    request(`/api/contact/${id}/read`, { method: 'PATCH' }, true),
};
