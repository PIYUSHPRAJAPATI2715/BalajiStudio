import { NextResponse } from 'next/server';
import { getBookings, saveBooking, updateBooking } from '@/utils/storage';

export const dynamic = 'force-dynamic';

export async function GET() {
    const bookings = getBookings();
    return NextResponse.json(bookings);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.date || !body.programName || !body.location) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newBooking = saveBooking({
            date: body.date,
            programName: body.programName,
            location: body.location,
            clientName: body.clientName || 'Unknown',
            eventType: body.eventType || 'Other',
            totalAmount: Number(body.totalAmount) || 0,
            receivedAmount: Number(body.receivedAmount) || 0,
            status: body.status || 'upcoming'
        });

        return NextResponse.json(newBooking, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updated = updateBooking(id, updates);

        if (!updated) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
