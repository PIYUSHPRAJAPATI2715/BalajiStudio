'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Lock, Plus, MapPin, Calendar, Trash2 } from 'lucide-react';

type Booking = {
    id: string;
    date: string;
    location: string;
    programName: string;
};

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [newDate, setNewDate] = useState('');
    const [newProgram, setNewProgram] = useState('');
    const [newLocation, setNewLocation] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Check local storage for session
        const session = localStorage.getItem('admin_session');
        if (session === 'true') {
            setIsLoggedIn(true);
            fetchBookings();
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded credentials as requested "set id pass"
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
            const res = await fetch('/api/bookings');
            const data = await res.json();
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
                body: JSON.stringify({
                    date: newDate,
                    programName: newProgram,
                    location: newLocation
                })
            });

            if (res.ok) {
                setNewDate('');
                setNewProgram('');
                setNewLocation('');
                fetchBookings(); // refresh list
                alert('Booking added successfully!');
            } else {
                alert('Failed to add booking');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="bg-zinc-900 param p-8 rounded-2xl border border-white/10 w-full max-w-md">
                    <div className="text-center mb-8">
                        <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white">Admin Login</h1>
                        <p className="text-gray-400">Restricted access area.</p>
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
        <div className="min-h-screen bg-black text-white p-4 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold font-heading text-primary">Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-white/10 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add New Event Form */}
                    <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 h-fit">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Add New Event
                        </h2>
                        <form onSubmit={handleAddBooking} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Event Date</label>
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none appearance-none" // appearance-none needed for calendar icon in some browsers but date input usually has one
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Program Name</label>
                                <input
                                    type="text"
                                    value={newProgram}
                                    onChange={(e) => setNewProgram(e.target.value)}
                                    placeholder="e.g. Rahul's Wedding"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder="e.g. Jaipur"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add to Calendar'}
                            </button>
                        </form>
                    </div>

                    {/* Bookings List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Upcoming Bookings
                        </h2>

                        {bookings.length === 0 ? (
                            <div className="bg-zinc-900 border border-dashed border-white/10 rounded-2xl p-12 text-center text-gray-500">
                                No bookings found. Add one to see it here.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div key={booking.id || Math.random()} className="bg-zinc-900 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">
                                                    {booking.date ? format(new Date(booking.date), 'dd MMM yyyy') : 'No Date'}
                                                </span>
                                                <h3 className="font-bold text-lg">{booking.programName}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                {booking.location}
                                            </div>
                                        </div>
                                        {/* Delete functionality not requested but nice to have UIs often have it. I won't implement API for it now to save complexity as user didn't explicitly ask for delete, just "proper add or see details". */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
