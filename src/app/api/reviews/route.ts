import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// GET /api/reviews — public approved reviews
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/reviews`, { cache: 'no-store' });
    const data = await res.json();
    // Return flat array for backward compat with existing Reviews component
    return NextResponse.json(data.data || data, { status: res.status });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

// POST /api/reviews — public review submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
