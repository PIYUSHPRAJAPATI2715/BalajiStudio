'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import {
  Lock, LogOut, LayoutDashboard, CalendarDays, Star, MessageSquare, Image,
  Settings, Plus, Trash2, Check, X, Eye, Edit2, Search, Filter,
  TrendingUp, IndianRupee, Clock, CheckCircle2, AlertCircle, Upload,
  ChevronDown, RefreshCw, Bell, User, Menu, ChevronRight, Mail,
  Phone, MapPin, Camera, Heart, Video, Home, Gift, Baby, Zap,
  Shield, Key, Save, BarChart3, Users, ExternalLink, ArrowUpRight,
  ArrowDownRight, Loader2, ImageOff, StarOff
} from 'lucide-react';
import { api } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
type Admin = { id: string; username: string; displayName: string; lastLogin: string };
type Booking = {
  _id: string; clientName: string; programName: string; date: string;
  location: string; eventType: string; totalAmount: number; receivedAmount: number;
  status: 'upcoming' | 'completed' | 'cancelled'; notes?: string;
  balanceDue?: number; paymentPercent?: number; createdAt: string;
};
type Review = {
  _id: string; name: string; event: string; rating: number; text: string;
  image: string; approved: boolean; featured: boolean; createdAt: string;
};
type Contact = {
  _id: string; name: string; email: string; phone: string; message: string;
  read: boolean; replied: boolean; createdAt: string;
};
type GalleryItem = {
  _id: string; title: string; category: string; imageUrl: string;
  featured: boolean; order: number; createdAt: string;
};
type DashboardData = {
  bookings: { total: number; upcoming: number; completed: number; thisMonth: number; nextMonth: number };
  revenue: { total: number; received: number; pending: number; thisMonth: number };
  reviews: { pending: number; approved: number };
  contacts: { unread: number; total: number };
  gallery: { total: number };
  recentBookings: Booking[];
  upcomingEvents: Booking[];
};

const EVENT_TYPES = [
  'Pre wedding', 'Drone shoot', 'Cinematic films', 'Bride entry',
  'Baby shower', 'House opening', 'Birthday party', 'Full wedding photography',
  'Vermala', 'Corporate events', 'Other',
];

const GALLERY_CATEGORIES = [
  'All', 'Wedding', 'Pre Wedding', 'Cinematic', 'Bride Entry',
  'Vermala', 'Baby Shower', 'Birthday', 'House Opening', 'Drone', 'Other',
];

const EVENT_ICONS: Record<string, React.ElementType> = {
  'Pre wedding': Camera, 'Full wedding photography': Heart, 'Cinematic films': Video,
  'Bride entry': Star, 'Baby shower': Baby, 'Birthday party': Gift,
  'House opening': Home, 'Drone shoot': Zap, 'Vermala': Heart,
  'Corporate events': BarChart3, 'Other': CalendarDays,
};

function fmt(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function fmtDate(dateStr: string) {
  try {
    const d = parseISO(dateStr);
    if (isValid(d)) return format(d, 'dd MMM yyyy');
  } catch { }
  return dateStr;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, sub }: { label: string; value: string | number; icon: React.ElementType; color: string; sub?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border bg-zinc-900/80 backdrop-blur p-6 border-white/10`}>
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2 ${color}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${styles[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
      {status}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
      ))}
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-zinc-900 z-10">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function InputField({ label, id, ...props }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <input id={id} {...props} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30 outline-none transition-all placeholder-gray-600" />
    </div>
  );
}

function SelectField({ label, id, options, ...props }: { label: string; id: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <select id={id} {...props} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500/70 outline-none transition-all">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab({ token }: { token: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.dashboard.getStats(token) as { data: DashboardData };
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
    </div>
  );
  if (!data) return <div className="text-center text-gray-400 py-20">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={data.bookings.total} icon={CalendarDays} color="bg-blue-500" sub={`${data.bookings.upcoming} upcoming`} />
        <StatCard label="Total Revenue" value={fmt(data.revenue.total)} icon={IndianRupee} color="bg-amber-500" sub={`${fmt(data.revenue.pending)} pending`} />
        <StatCard label="This Month" value={fmt(data.revenue.thisMonth)} icon={TrendingUp} color="bg-green-500" sub={`${data.bookings.thisMonth} bookings`} />
        <StatCard label="Pending Reviews" value={data.reviews.pending} icon={Star} color="bg-purple-500" sub={`${data.contacts.unread} unread msgs`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Upcoming Events</h3>
          {data.upcomingEvents.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming events in the next 30 days.</p>
          ) : (
            <div className="space-y-3">
              {data.upcomingEvents.map(b => {
                const Icon = EVENT_ICONS[b.eventType] || CalendarDays;
                return (
                  <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="p-2 bg-amber-500/20 rounded-lg"><Icon className="w-4 h-4 text-amber-400" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{b.clientName}</p>
                      <p className="text-xs text-gray-400">{b.programName} · {fmtDate(b.date)}</p>
                    </div>
                    <Badge status={b.status} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-amber-500" /> Recent Activity</h3>
          <div className="space-y-3">
            {data.recentBookings.map(b => (
              <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{b.clientName} — {b.programName}</p>
                  <p className="text-xs text-gray-400">{fmtDate(b.createdAt)} · {fmt(b.totalAmount)}</p>
                </div>
                <Badge status={b.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-amber-500" /> Revenue Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{fmt(data.revenue.total)}</p>
            <p className="text-sm text-gray-400 mt-1">Total Contracted</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{fmt(data.revenue.received)}</p>
            <p className="text-sm text-gray-400 mt-1">Received</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{fmt(data.revenue.pending)}</p>
            <p className="text-sm text-gray-400 mt-1">Pending</p>
          </div>
        </div>
        {data.revenue.total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Collected</span>
              <span>{Math.round((data.revenue.received / data.revenue.total) * 100)}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-amber-500 to-green-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.round((data.revenue.received / data.revenue.total) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Bookings Tab ──────────────────────────────────────────────────────────────
function BookingsTab({ token }: { token: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editBooking, setEditBooking] = useState<Booking | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const emptyForm = { clientName: '', programName: '', date: '', location: '', eventType: EVENT_TYPES[0], totalAmount: '', receivedAmount: '', status: 'upcoming', notes: '' };
  const [formData, setFormData] = useState<typeof emptyForm>(emptyForm);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setShowLocationDropdown(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (formData.location.length > 2 && showLocationDropdown) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}&limit=5`);
          const data = await res.json();
          setLocationSuggestions(data);
        } catch { }
      } else setLocationSuggestions([]);
    }, 500);
    return () => clearTimeout(t);
  }, [formData.location, showLocationDropdown]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.bookings.getAll(token, { status: filter === 'all' ? undefined : filter, search }) as { data: Booking[] };
      setBookings(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [token, filter, search]);

  useEffect(() => { load(); }, [load]);

  const openEdit = (b: Booking) => {
    setEditBooking(b);
    setFormData({
      clientName: b.clientName, programName: b.programName,
      date: b.date ? b.date.split('T')[0] : '',
      location: b.location, eventType: b.eventType,
      totalAmount: String(b.totalAmount), receivedAmount: String(b.receivedAmount),
      status: b.status, notes: b.notes || '',
    });
    setShowForm(true);
  };

  const openAdd = () => { setEditBooking(null); setFormData(emptyForm); setShowForm(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const payload = { ...formData, totalAmount: Number(formData.totalAmount), receivedAmount: Number(formData.receivedAmount) };
      if (editBooking) {
        await api.bookings.update(token, editBooking._id, payload);
      } else {
        await api.bookings.create(token, payload);
      }
      setShowForm(false);
      load();
    } catch (e: any) { alert(e.message || 'Failed to save booking'); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this booking? This cannot be undone.')) return;
    try { await api.bookings.delete(token, id); load(); } catch (e: any) { alert(e.message); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try { await api.bookings.update(token, id, { status: newStatus }); load(); } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings..."
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-amber-500/50" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-all">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={load} className="p-2.5 bg-zinc-800 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 text-amber-500 animate-spin" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 text-gray-500"><CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No bookings found</p></div>
      ) : (
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-zinc-800/50">
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Client</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Event</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium hidden xl:table-cell">Amount</th>
                  <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map(b => {
                  const Icon = EVENT_ICONS[b.eventType] || CalendarDays;
                  return (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{b.clientName}</p>
                        <p className="text-xs text-gray-500">{b.programName}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-gray-300">
                          <Icon className="w-3.5 h-3.5 text-amber-500" />{b.eventType}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-300">{fmtDate(b.date)}</td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <p className="text-white">{fmt(b.totalAmount)}</p>
                        <p className="text-xs text-gray-500">{fmt(b.receivedAmount)} received</p>
                      </td>
                      <td className="px-4 py-3">
                        <select value={b.status} onChange={e => handleStatusChange(b._id, e.target.value)}
                          className="text-xs bg-transparent border-0 outline-none cursor-pointer">
                          <option value="upcoming" className="bg-zinc-900">upcoming</option>
                          <option value="completed" className="bg-zinc-900">completed</option>
                          <option value="cancelled" className="bg-zinc-900">cancelled</option>
                        </select>
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border ml-1 ${b.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : b.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>{b.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewBooking(b)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openEdit(b)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-amber-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(b._id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editBooking ? 'Edit Booking' : 'Add New Booking'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Client Name *" id="b-client" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} required placeholder="Rahul Sharma" />
            <InputField label="Program Name *" id="b-program" value={formData.programName} onChange={e => setFormData({ ...formData, programName: e.target.value })} required placeholder="Wedding Photography" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date *" id="b-date" type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
            <SelectField label="Event Type" id="b-type" value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })} options={EVENT_TYPES} />
          </div>
          {/* Location with autocomplete */}
          <div ref={locationRef} className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                value={formData.location}
                onChange={e => { setFormData({ ...formData, location: e.target.value }); setShowLocationDropdown(true); }}
                onFocus={() => setShowLocationDropdown(true)}
                placeholder="Type to search location..."
                required
                className="w-full pl-9 pr-4 bg-black/50 border border-white/10 rounded-xl py-3 text-white focus:border-amber-500/70 outline-none transition-all placeholder-gray-600"
              />
            </div>
            {showLocationDropdown && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-zinc-800 border border-white/10 rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto">
                {locationSuggestions.map((s, i) => (
                  <button type="button" key={i} onClick={() => { setFormData({ ...formData, location: s.display_name }); setShowLocationDropdown(false); setLocationSuggestions([]); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <span className="truncate">{s.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Total Amount (₹)" id="b-total" type="number" min="0" value={formData.totalAmount} onChange={e => setFormData({ ...formData, totalAmount: e.target.value })} placeholder="0" />
            <InputField label="Received Amount (₹)" id="b-received" type="number" min="0" value={formData.receivedAmount} onChange={e => setFormData({ ...formData, receivedAmount: e.target.value })} placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Status" id="b-status" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} options={['upcoming', 'completed', 'cancelled']} />
            <div />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500/70 outline-none resize-none h-20 placeholder-gray-600" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all font-medium">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all flex items-center justify-center gap-2">
              {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editBooking ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Booking Modal */}
      <Modal isOpen={!!viewBooking} onClose={() => setViewBooking(null)} title="Booking Details">
        {viewBooking && (
          <div className="space-y-4 text-sm">
            {[
              ['Client', viewBooking.clientName],
              ['Program', viewBooking.programName],
              ['Event Type', viewBooking.eventType],
              ['Date', fmtDate(viewBooking.date)],
              ['Location', viewBooking.location],
              ['Status', viewBooking.status],
              ['Total Amount', fmt(viewBooking.totalAmount)],
              ['Received', fmt(viewBooking.receivedAmount)],
              ['Balance Due', fmt(viewBooking.totalAmount - viewBooking.receivedAmount)],
              ['Created', fmtDate(viewBooking.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">{k}</span>
                <span className="text-white font-medium text-right max-w-[60%] break-words">{v}</span>
              </div>
            ))}
            {viewBooking.notes && (
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">Notes</p>
                <p className="text-white">{viewBooking.notes}</p>
              </div>
            )}
            {viewBooking.totalAmount > 0 && (
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Payment Progress</span>
                  <span>{Math.round((viewBooking.receivedAmount / viewBooking.totalAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-amber-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((viewBooking.receivedAmount / viewBooking.totalAmount) * 100))}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Reviews Tab ───────────────────────────────────────────────────────────────
function ReviewsTab({ token }: { token: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.reviews.getAll(token) as { data: Review[] };
      setReviews(res.data || []);
    } catch { } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id: string, approved: boolean) => {
    try { await api.reviews.update(token, id, { approved }); load(); } catch (e: any) { alert(e.message); }
  };

  const handleFeature = async (id: string, featured: boolean) => {
    try { await api.reviews.update(token, id, { featured }); load(); } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try { await api.reviews.delete(token, id); load(); } catch (e: any) { alert(e.message); }
  };

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return !r.approved;
    if (filter === 'approved') return r.approved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>
              {f} {f === 'pending' && reviews.filter(r => !r.approved).length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{reviews.filter(r => !r.approved).length}</span>
              )}
            </button>
          ))}
        </div>
        <button onClick={load} className="p-2.5 bg-zinc-800 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 text-amber-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500"><Star className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No reviews found</p></div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(r => (
            <div key={r._id} className={`bg-zinc-900/80 border rounded-2xl p-5 transition-colors ${r.approved ? 'border-white/10' : 'border-amber-500/30 bg-amber-500/5'}`}>
              <div className="flex items-start gap-4">
                <img src={r.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.name)}&background=random`}
                  alt={r.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-white/10" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-white">{r.name}</span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-400">{r.event}</span>
                    {r.featured && <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">Featured</span>}
                    {!r.approved && <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">Pending</span>}
                  </div>
                  <Stars rating={r.rating} />
                  <p className="text-gray-300 text-sm mt-2">{r.text}</p>
                  <p className="text-xs text-gray-500 mt-2">{fmtDate(r.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {!r.approved ? (
                    <button onClick={() => handleApprove(r._id, true)} className="p-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/40 transition-colors" title="Approve">
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => handleApprove(r._id, false)} className="p-2 rounded-xl bg-zinc-700 text-gray-400 hover:bg-zinc-600 transition-colors" title="Unapprove">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleFeature(r._id, !r.featured)} className={`p-2 rounded-xl transition-colors ${r.featured ? 'bg-amber-500/30 text-amber-400 hover:bg-amber-500/50' : 'bg-zinc-700 text-gray-400 hover:bg-zinc-600'}`} title="Toggle Featured">
                    <Star className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(r._id)} className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Contacts Tab ──────────────────────────────────────────────────────────────
function ContactsTab({ token }: { token: string }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.contact.getAll(token) as { data: Contact[] };
      setContacts(res.data || []);
    } catch { } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id: string) => {
    try { await api.contact.markRead(token, id); load(); } catch { }
  };

  const handleMarkReplied = async (id: string) => {
    try { await api.contact.markReplied(token, id); load(); } catch { }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact inquiry?')) return;
    try { await api.contact.delete(token, id); load(); setViewContact(null); } catch { }
  };

  const handleView = async (c: Contact) => {
    setViewContact(c);
    if (!c.read) handleMarkRead(c._id);
  };

  const filtered = filter === 'unread' ? contacts.filter(c => !c.read) : contacts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === f ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>
              {f} {f === 'unread' && contacts.filter(c => !c.read).length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{contacts.filter(c => !c.read).length}</span>
              )}
            </button>
          ))}
        </div>
        <button onClick={load} className="p-2.5 bg-zinc-800 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 text-amber-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No inquiries</p></div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c._id} onClick={() => handleView(c)}
              className={`bg-zinc-900/80 border rounded-2xl p-4 cursor-pointer hover:border-amber-500/30 transition-all ${!c.read ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/10'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{c.name}</span>
                    {!c.read && <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />}
                    {c.replied && <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">Replied</span>}
                  </div>
                  <p className="text-xs text-gray-400">{c.email} · {c.phone}</p>
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">{c.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{fmtDate(c.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <a href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${c.name}, regarding your inquiry: "${c.message.slice(0, 80)}..."`)}`}
                    target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/40 transition-colors" title="WhatsApp">
                    <Phone className="w-4 h-4" />
                  </a>
                  <a href={`mailto:${c.email}`} onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-colors" title="Email">
                    <Mail className="w-4 h-4" />
                  </a>
                  <button onClick={e => { e.stopPropagation(); handleDelete(c._id); }}
                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!viewContact} onClose={() => setViewContact(null)} title="Contact Inquiry">
        {viewContact && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Name', viewContact.name], ['Email', viewContact.email], ['Phone', viewContact.phone], ['Received', fmtDate(viewContact.createdAt)]].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{k}</p>
                  <p className="text-white font-medium break-all">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">Message</p>
              <p className="text-white text-sm leading-relaxed">{viewContact.message}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <a href={`https://wa.me/${viewContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${viewContact.name}!`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-medium transition-colors">
                <Phone className="w-4 h-4" /> WhatsApp
              </a>
              <a href={`mailto:${viewContact.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-colors">
                <Mail className="w-4 h-4" /> Email
              </a>
              {!viewContact.replied && (
                <button onClick={() => { handleMarkReplied(viewContact._id); setViewContact({ ...viewContact, replied: true }); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-sm font-medium transition-colors">
                  <Check className="w-4 h-4" /> Mark Replied
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Gallery Tab ───────────────────────────────────────────────────────────────
function GalleryTab({ token }: { token: string }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [urlForm, setUrlForm] = useState({ imageUrl: '', title: '', category: 'Other', featured: false });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileFormData, setFileFormData] = useState({ title: '', category: 'Other', featured: false });
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.gallery.getAll(category) as { data: GalleryItem[] };
      setItems(res.data || []);
    } catch { } finally { setLoading(false); }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      const base64Url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(selectedFile);
      });

      await api.gallery.addByUrl(token, {
        imageUrl: base64Url,
        title: fileFormData.title,
        category: fileFormData.category,
        featured: fileFormData.featured,
      });

      setShowUploadModal(false);
      setSelectedFile(null);
      setPreview('');
      load();
    } catch (e: any) {
      alert(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await api.gallery.addByUrl(token, urlForm);
      setShowUploadModal(false);
      setUrlForm({ imageUrl: '', title: '', category: 'Other', featured: false });
      load();
    } catch (e: any) { alert(e.message); } finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try { await api.gallery.delete(token, id); load(); } catch (e: any) { alert(e.message); }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try { await api.gallery.update(token, item._id, { featured: !item.featured }); load(); } catch { }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {GALLERY_CATEGORIES.slice(0, 6).map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${category === c ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-gray-400 hover:text-white'}`}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl text-sm transition-all">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><Loader2 className="w-7 h-7 text-amber-500 animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-500"><Image className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No gallery images</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item._id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10">
              <img src={item.imageUrl} alt={item.title || item.category}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-xs font-medium truncate">{item.title || item.category}</p>
                <p className="text-gray-300 text-xs">{item.category}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleFeatured(item)}
                  className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${item.featured ? 'bg-amber-500 text-black' : 'bg-black/50 text-white hover:bg-black/70'}`}>
                  <Star className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg bg-red-500/80 text-white hover:bg-red-500 backdrop-blur-sm transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {item.featured && (
                <div className="absolute top-2 left-2">
                  <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">Featured</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Add to Gallery">
        <div className="space-y-4">
          <div className="flex bg-zinc-800 rounded-xl p-1">
            {(['file', 'url'] as const).map(m => (
              <button key={m} onClick={() => setUploadMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${uploadMode === m ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}>
                {m === 'file' ? '📁 Upload File' : '🔗 Add by URL'}
              </button>
            ))}
          </div>

          {uploadMode === 'file' ? (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-amber-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-xl object-cover" />
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-gray-500 mb-2" />
                    <p className="text-gray-400 text-sm">Click to select image</p>
                    <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP • Max 10MB</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>
              <InputField label="Title (optional)" id="g-title" value={fileFormData.title} onChange={e => setFileFormData({ ...fileFormData, title: e.target.value })} placeholder="e.g. Wedding Ceremony" />
              <SelectField label="Category" id="g-cat" value={fileFormData.category} onChange={e => setFileFormData({ ...fileFormData, category: e.target.value })} options={GALLERY_CATEGORIES.slice(1)} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={fileFormData.featured} onChange={e => setFileFormData({ ...fileFormData, featured: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                <span className="text-sm text-gray-300">Mark as featured</span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all font-medium">Cancel</button>
                <button type="submit" disabled={!selectedFile || uploading} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleUrlAdd} className="space-y-4">
              <InputField label="Image URL *" id="g-url" value={urlForm.imageUrl} onChange={e => setUrlForm({ ...urlForm, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" required />
              {urlForm.imageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 h-32">
                  <img src={urlForm.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
              <InputField label="Title (optional)" id="g-url-title" value={urlForm.title} onChange={e => setUrlForm({ ...urlForm, title: e.target.value })} placeholder="e.g. Pre-Wedding Shoot" />
              <SelectField label="Category" id="g-url-cat" value={urlForm.category} onChange={e => setUrlForm({ ...urlForm, category: e.target.value })} options={GALLERY_CATEGORIES.slice(1)} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={urlForm.featured} onChange={e => setUrlForm({ ...urlForm, featured: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                <span className="text-sm text-gray-300">Mark as featured</span>
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all font-medium">Cancel</button>
                <button type="submit" disabled={uploading} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all flex items-center justify-center gap-2">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}

// ─── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ token, admin }: { token: string; admin: Admin }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (newPassword.length < 6) {
      setMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    try {
      await api.auth.changePassword(token, currentPassword, newPassword);
      setMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      setMsg({ type: 'error', text: e.message || 'Failed to change password' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg space-y-6">
      {/* Admin Info */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-amber-500" /> Admin Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-black">
            {admin.displayName.charAt(0)}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{admin.displayName}</p>
            <p className="text-gray-400 text-sm">@{admin.username}</p>
            {admin.lastLogin && <p className="text-gray-500 text-xs mt-1">Last login: {fmtDate(admin.lastLogin)}</p>}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-amber-500" /> Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <InputField label="Current Password" id="cp-current" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Enter current password" />
          <InputField label="New Password" id="cp-new" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="At least 6 characters" />
          <InputField label="Confirm New Password" id="cp-confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat new password" />

          {msg && (
            <div className={`p-3 rounded-xl text-sm ${msg.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {msg.text}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Change Password
          </button>
        </form>
      </div>

      {/* System Info */}
      <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500" /> System Info</h3>
        <div className="space-y-2 text-sm">
          {[
            ['Business', 'Sidhi Vinayak Events'],
            ['Location', 'Niwaru, Jhotwara, Jaipur'],
            ['Contact', '+91 78917 66624'],
            ['API URL', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">{k}</span>
              <span className="text-white font-medium text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState('');
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'reviews' | 'contacts' | 'gallery' | 'settings'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('sve_admin_token');
    if (savedToken) {
      api.auth.me(savedToken)
        .then((adminData) => { setToken(savedToken); setAdmin(adminData as Admin); })
        .catch(() => { localStorage.removeItem('sve_admin_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.auth.login(loginData.username, loginData.password) as { token: string; admin: Admin };
      localStorage.setItem('sve_admin_token', res.token);
      setToken(res.token);
      setAdmin(res.admin);
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials');
    } finally { setLoginLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('sve_admin_token');
    setToken(''); setAdmin(null);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'contacts', label: 'Contacts', icon: MessageSquare },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  // ─── Login Screen ───────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/10 via-black to-orange-900/5" />
        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-4 shadow-2xl shadow-amber-500/30">
              <Shield className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-1">Sidhi Vinayak Events</p>
          </div>

          <div className="bg-zinc-900/90 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Enter username"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all placeholder-gray-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter password"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {loginError}
                </div>
              )}

              <button type="submit" disabled={loginLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30">
                {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">🔒 Secured with JWT Authentication</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Admin Dashboard ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900/95 backdrop-blur border-r border-white/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">Sidhi Vinayak</p>
              <p className="text-amber-500 text-xs font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1 flex-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Icon className="w-5 h-5 flex-shrink-0" /> {label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold text-sm">
              {admin?.displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{admin?.displayName}</p>
              <p className="text-gray-500 text-xs truncate">@{admin?.username}</p>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar Backdrop (mobile) */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10 px-4 lg:px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white capitalize">{activeTab}</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Sidhi Vinayak Events Management</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 border border-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> View Site
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardTab token={token} />}
          {activeTab === 'bookings' && <BookingsTab token={token} />}
          {activeTab === 'reviews' && <ReviewsTab token={token} />}
          {activeTab === 'contacts' && <ContactsTab token={token} />}
          {activeTab === 'gallery' && <GalleryTab token={token} />}
          {activeTab === 'settings' && admin && <SettingsTab token={token} admin={admin} />}
        </main>
      </div>
    </div>
  );
}
