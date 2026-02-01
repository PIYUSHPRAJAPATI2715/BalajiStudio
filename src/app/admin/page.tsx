'use client';

import { useState, useEffect, useRef } from 'react';
import { format, parseISO } from 'date-fns';
import { Lock, Plus, MapPin, Calendar, Trash2, Mail, DollarSign, CheckCircle, Clock, User, Filter } from 'lucide-react';

type Booking = {
    id: string;
    date: string;
    location: string;
    programName: string;
    clientName: string;
    eventType: string;
    totalAmount: number;
    receivedAmount: number;
    status: 'upcoming' | 'completed';
};

const EVENT_TYPES = [
    'Pre wedding',
    'Drone shoot',
    'Cinematic films',
    'Bride entry',
    'Baby shower',
    'House opening',
    'Birthday party',
    'Full wedding photography',
    'Corporate events'
];

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
    const [loading, setLoading] = useState(false);

    // Location Auto-fetch State
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const locationWrapperRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        clientName: '',
        programName: '',
        date: '',
        location: '',
        eventType: EVENT_TYPES[0],
        totalAmount: '',
        receivedAmount: '',
        status: 'upcoming'
    });

    // ... (existing code)

    // In the return JSX, inside the form:
    // Update inputs to text-base and add ref to location wrapper
    /* 
       Note: Since I am replacing a block, I will include the relevant parts of the component.
       Direct replacement of the return block is safer or targeted chunks.
       I will target the Location Input Wrapper first to add the Ref.
    */

    useEffect(() => {
        const session = localStorage.getItem('admin_session');
        if (session === 'true') {
            setIsLoggedIn(true);
            fetchBookings();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'admin' && password === 'admin123') {
            setIsLoggedIn(true);
            localStorage.setItem('admin_session', 'true');
            setError('');
            fetchBookings();
        } else {
            setError('Invalid credentials');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('admin_session');
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch('/api/bookings', { cache: 'no-store' });
            const data = await res.json();
            // Sorting done in render
            setBookings(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setFormData({
                    clientName: '',
                    programName: '',
                    date: '',
                    location: '',
                    eventType: EVENT_TYPES[0],
                    totalAmount: '',
                    receivedAmount: '',
                    status: 'upcoming'
                });
                setShowForm(false);
                fetchBookings();
                // alert('Event added successfully!');
            } else {
                alert('Failed to add event');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: 'upcoming' | 'completed') => {
        if (!confirm(`Mark this event as ${newStatus}?`)) return;

        try {
            const res = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                fetchBookings();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Location Search Logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (formData.location.length > 2 && showSuggestions) {
                setIsSearchingLocation(true);
                try {
                    // Using OpenStreetMap Nominatim API (Free, no key required)
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch location suggestions", err);
                } finally {
                    setIsSearchingLocation(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer);
    }, [formData.location, showSuggestions]);

    const handleLocationSelect = (place: any) => {
        setFormData({ ...formData, location: place.display_name });
        setShowSuggestions(false);
        setSuggestions([]);
    };

    // Derived State
    const filteredBookings = bookings.filter(b => {
        const s = (b.status || 'upcoming').toLowerCase().trim();
        return s === activeTab;
    });
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalPending = bookings.reduce((sum, b) => sum + ((b.totalAmount || 0) - (b.receivedAmount || 0)), 0);

    // Safe Sort
    filteredBookings.sort((a, b) => {
        const dateA = a.date ? parseISO(a.date).getTime() : 0;
        const dateB = b.date ? parseISO(b.date).getTime() : 0;
        return dateA - dateB;
    });

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10 w-full max-w-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-gold" />
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/50">
                            <img src="/assets/admin_logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-bold text-white font-heading">Admin Portal</h1>
                        <p className="text-gray-400">Sidhi Vinayak Events</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                placeholder="Enter username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                placeholder="Enter password"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white transition-colors"
                        >
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="bg-zinc-900 border-b border-white/10 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-primary/30">
                            <img src="/assets/admin_logo.jpg" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-xl font-bold font-heading hidden md:block">Sidhi Vinayak Admin</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-zinc-800 text-sm hover:bg-zinc-700 rounded-lg border border-white/10 transition-colors text-red-400 font-medium"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 pb-32">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-500">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Revenue</p>
                                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/20 rounded-lg text-red-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Pending Amount</p>
                                <p className="text-2xl font-bold">₹{totalPending.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 p-6 rounded-xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Events</p>
                                <p className="text-2xl font-bold">{bookings.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex bg-zinc-900 p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'upcoming' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setActiveTab('completed')}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'completed' ? 'bg-zinc-800 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            Completed
                        </button>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-primary text-black px-6 py-2.5 rounded-lg font-bold hover:bg-white transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        {showForm ? 'Cancel' : 'Add New Event'}
                    </button>
                </div>

                {/* Add Event Form */}
                {showForm && (
                    <div className="mb-8 bg-zinc-900 p-6 md:p-8 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-xl font-bold mb-6 text-primary">New Event Details</h2>
                        <form onSubmit={handleAddBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Client Info */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Client Info</h3>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Client Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Rahul Verma"
                                        value={formData.clientName}
                                        onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Event Title / Program Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Wedding Ceremony"
                                        value={formData.programName}
                                        onChange={e => setFormData({ ...formData, programName: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Event Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Type</label>
                                        <select
                                            value={formData.eventType}
                                            onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none text-white appearance-none cursor-pointer"
                                        >
                                            {EVENT_TYPES.map(type => (
                                                <option key={type} value={type} className="bg-zinc-900">{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-500 z-10" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="Search city or venue..."
                                            value={formData.location}
                                            onChange={e => {
                                                setFormData({ ...formData, location: e.target.value });
                                                setShowSuggestions(true);
                                            }}
                                            onFocus={() => setShowSuggestions(true)}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-primary outline-none"
                                        />

                                        {/* Suggestions Dropdown */}
                                        {showSuggestions && (suggestions.length > 0 || isSearchingLocation) && formData.location.length > 2 && (
                                            <div className="absolute z-50 w-full mt-1 bg-zinc-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                                {isSearchingLocation && (
                                                    <div className="p-3 text-sm text-gray-400">Searching...</div>
                                                )}
                                                {suggestions.map((place, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => handleLocationSelect(place)}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-700 transition-colors border-b border-white/5 last:border-0"
                                                    >
                                                        <div className="font-medium text-white block truncate">{place.display_name.split(',')[0]}</div>
                                                        <div className="text-xs text-gray-400 truncate">{place.display_name}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <a
                                            href={`https://www.google.com/maps/search/${encodeURIComponent(formData.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute right-3 top-3.5 text-xs text-primary hover:underline hover:text-white"
                                        >
                                            Verify Map
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-4 md:col-span-2 border-t border-white/5 pt-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Payment Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Total Amount (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="0"
                                            value={formData.totalAmount}
                                            onChange={e => setFormData({ ...formData, totalAmount: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Received (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            placeholder="0"
                                            value={formData.receivedAmount}
                                            onChange={e => setFormData({ ...formData, receivedAmount: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:border-primary outline-none font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-300 mb-1">Pending (Calculated)</label>
                                        <div className="w-full bg-zinc-800 border border-white/5 rounded-lg px-4 py-3 text-red-400 font-mono font-bold">
                                            ₹{((Number(formData.totalAmount) || 0) - (Number(formData.receivedAmount) || 0)).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-black font-bold py-4 rounded-xl hover:bg-white transition-colors text-lg"
                                >
                                    {loading ? 'Saving Event...' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Event List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-dashed border-white/10">
                            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-400">No {activeTab} events found</h3>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => {
                            const pending = (booking.totalAmount || 0) - (booking.receivedAmount || 0);
                            const isFullyPaid = pending <= 0;

                            return (
                                <div key={booking.id} className="bg-zinc-900 rounded-xl border border-white/10 overflow-hidden hover:border-primary/30 transition-all">
                                    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

                                        {/* Date & Type */}
                                        <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-2">
                                            <div className="bg-zinc-800 p-3 rounded-lg text-center min-w-[80px]">
                                                <div className="text-xs text-gray-400 uppercase">{booking.date ? format(parseISO(booking.date), 'MMM') : 'NDA'}</div>
                                                <div className="text-2xl font-bold text-white">{booking.date ? format(parseISO(booking.date), 'dd') : 'No'}</div>
                                                <div className="text-xs text-gray-400">{booking.date ? format(parseISO(booking.date), 'yyyy') : 'Date'}</div>
                                            </div>
                                            <div>
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-2">
                                                    {booking.eventType}
                                                </span>
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <Clock className="w-3 h-3" />
                                                    {booking.date ? format(parseISO(booking.date), 'EEEE') : ''}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Main Info */}
                                        <div className="lg:col-span-2 flex flex-col justify-center">
                                            <h3 className="text-xl font-bold text-white mb-1">{booking.programName}</h3>
                                            <div className="flex items-center gap-2 text-primary mb-3">
                                                <User className="w-4 h-4" />
                                                <span className="font-medium">{booking.clientName}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm bg-black/30 w-fit px-3 py-1.5 rounded-lg">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <a
                                                    href={`https://www.google.com/maps/search/${encodeURIComponent(booking.location)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-white hover:underline truncate max-w-[200px]"
                                                >
                                                    {booking.location}
                                                </a>
                                            </div>
                                        </div>

                                        {/* Payment & Status */}
                                        <div className="flex flex-col justify-between items-start lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6">
                                            <div className="w-full text-right">
                                                <div className="flex justify-between lg:justify-end gap-8 mb-1">
                                                    <span className="text-gray-500 text-sm">Total:</span>
                                                    <span className="font-mono font-bold">₹{booking.totalAmount?.toLocaleString()}</span>
                                                </div>
                                                <div className={`flex justify-between lg:justify-end gap-8 ${isFullyPaid ? 'text-green-500' : 'text-red-400'}`}>
                                                    <span className="text-sm opacity-80">{isFullyPaid ? 'Paid:' : 'Pending:'}</span>
                                                    <span className="font-mono font-bold">
                                                        {isFullyPaid ? 'Paid' : `₹${pending.toLocaleString()}`}
                                                    </span>
                                                </div>
                                            </div>

                                            {activeTab === 'upcoming' ? (
                                                <button
                                                    onClick={() => updateStatus(booking.id, 'completed')}
                                                    className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-green-600 hover:text-white text-gray-300 rounded-lg text-sm font-medium transition-all group"
                                                >
                                                    <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                                    Mark Completed
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-green-500 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full">
                                                    <CheckCircle className="w-3 h-3" /> Completed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
}
```
