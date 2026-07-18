import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const qs = month && year ? `?month=${month}&year=${year}` : '';
    const res = await fetch(`${API_URL}/api/bookings/calendar${qs}`, {
      cache: 'no-store',
    });

    const data = await res.json();
    const rawBookings = data && data.success && Array.isArray(data.data) ? data.data : [];
    
    // Convert date format from ISO to 'YYYY-MM-DD'
    const formattedBookings = rawBookings.map((b: any) => {
      let dateStr = b.date;
      if (dateStr && dateStr.includes('T')) {
        dateStr = dateStr.split('T')[0];
      }
      return {
        ...b,
        date: dateStr
      };
    });

    return NextResponse.json(formattedBookings, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

