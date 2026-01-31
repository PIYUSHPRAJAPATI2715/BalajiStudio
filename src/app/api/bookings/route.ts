import { NextResponse } from 'next/server';
import { getBookings, saveBooking } from '@/utils/storage';

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
            location: body.location
        });

        return NextResponse.json(newBooking, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
