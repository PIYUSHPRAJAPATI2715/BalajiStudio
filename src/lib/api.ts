// Central API utility for Sidhi Vinayak Events backend
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type RequestOptions = {
  method?: string;
  body?: object;
  token?: string;
};

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    cache: 'no-store',
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───────────────────────────────────────────────
export const api = {
  auth: {
    login: (username: string, password: string) =>
      apiRequest<{ token: string; admin: object }>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      }),
    me: (token: string) =>
      apiRequest<{ id: string; username: string; displayName: string }>('/api/auth/me', { token }),
    changePassword: (token: string, currentPassword: string, newPassword: string) =>
      apiRequest('/api/auth/change-password', {
        method: 'PUT',
        body: { currentPassword, newPassword },
        token,
      }),
  },

  // ─── Dashboard ─────────────────────────────────────────
  dashboard: {
    getStats: (token: string) => apiRequest('/api/dashboard', { token }),
  },

  // ─── Bookings ──────────────────────────────────────────
  bookings: {
    getAll: (token: string, params?: { status?: string; search?: string; month?: number; year?: number }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      if (params?.month) query.set('month', String(params.month));
      if (params?.year) query.set('year', String(params.year));
      const qs = query.toString() ? `?${query.toString()}` : '';
      return apiRequest(`/api/bookings${qs}`, { token });
    },
    getCalendar: (month: number, year: number) =>
      apiRequest(`/api/bookings/calendar?month=${month}&year=${year}`),
    create: (token: string, data: object) =>
      apiRequest('/api/bookings', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: object) =>
      apiRequest(`/api/bookings/${id}`, { method: 'PUT', body: data, token }),
    delete: (token: string, id: string) =>
      apiRequest(`/api/bookings/${id}`, { method: 'DELETE', token }),
  },

  // ─── Reviews ───────────────────────────────────────────
  reviews: {
    getApproved: () => apiRequest('/api/reviews'),
    getAll: (token: string) => apiRequest('/api/reviews/all', { token }),
    submit: (data: object) => apiRequest('/api/reviews', { method: 'POST', body: data }),
    update: (token: string, id: string, data: object) =>
      apiRequest(`/api/reviews/${id}`, { method: 'PUT', body: data, token }),
    delete: (token: string, id: string) =>
      apiRequest(`/api/reviews/${id}`, { method: 'DELETE', token }),
  },

  // ─── Contact ───────────────────────────────────────────
  contact: {
    getAll: (token: string) => apiRequest('/api/contact', { token }),
    submit: (data: object) => apiRequest('/api/contact', { method: 'POST', body: data }),
    markRead: (token: string, id: string) =>
      apiRequest(`/api/contact/${id}/read`, { method: 'PUT', token }),
    markReplied: (token: string, id: string) =>
      apiRequest(`/api/contact/${id}/replied`, { method: 'PUT', token }),
    delete: (token: string, id: string) =>
      apiRequest(`/api/contact/${id}`, { method: 'DELETE', token }),
  },

  // ─── Gallery ───────────────────────────────────────────
  gallery: {
    getAll: (category?: string) => {
      const qs = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
      return apiRequest(`/api/gallery${qs}`);
    },
    addByUrl: (token: string, data: object) =>
      apiRequest('/api/gallery/url', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: object) =>
      apiRequest(`/api/gallery/${id}`, { method: 'PUT', body: data, token }),
    delete: (token: string, id: string) =>
      apiRequest(`/api/gallery/${id}`, { method: 'DELETE', token }),

    // Upload (uses FormData, not JSON)
    upload: async (token: string, formData: FormData) => {
      const res = await fetch(`${API_BASE}/api/gallery/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(error.error || 'Upload failed');
      }
      return res.json();
    },
  },
};

export default api;
