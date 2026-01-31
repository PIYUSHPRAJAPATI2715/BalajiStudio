import { NextResponse } from 'next/server';
import { saveMessage, getMessages } from '@/utils/storage';

export async function GET() {
    const messages = getMessages();
    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.name || !body.email || !body.message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newMessage = saveMessage({
            name: body.name,
            email: body.email,
            phone: body.phone || '',
            message: body.message
        });

        return NextResponse.json(newMessage, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}
