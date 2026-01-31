import { NextResponse } from 'next/server';
import { saveReview, getReviews } from '@/utils/storage';

export async function GET() {
    const reviews = getReviews();
    return NextResponse.json(reviews);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name || !body.text || !body.rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newReview = saveReview({
            name: body.name,
            event: body.event || 'Event',
            rating: Number(body.rating),
            text: body.text,
            image: body.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(body.name)}&background=random`
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to post review' },
            { status: 500 }
        );
    }
}
