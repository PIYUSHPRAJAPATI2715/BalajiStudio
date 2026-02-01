import fs from 'fs';
import path from 'path';

// Define the file path. In production (Vercel), this won't persist, but works for local.
const bookingsFilePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');
const messagesFilePath = path.join(process.cwd(), 'src', 'data', 'messages.json');
const reviewsFilePath = path.join(process.cwd(), 'src', 'data', 'reviews.json');

export type Booking = {
    id: string;
    date: string;
    location: string;
    programName: string; // Keeps backward compatibility, can treat as "Event Description"
    clientName: string;
    eventType: string;
    totalAmount: number;
    receivedAmount: number;
    status: 'upcoming' | 'completed';
    createdAt: string;
};

export type Message = {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
};

export type Review = {
    id: string;
    name: string;
    event: string;
    rating: number;
    text: string;
    image: string;
    createdAt: string;
};

// Ensure directory exists
const ensureDirectoryExistence = (filePath: string) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

export const getReviews = (): Review[] => {
    try {
        ensureDirectoryExistence(reviewsFilePath);
        if (!fs.existsSync(reviewsFilePath)) {
            // Initial seed data if empty? Or just empty array.
            // Let's seed it with the hardcoded reviews so it doesn't look empty initially if file is missing.
            const seedReviews = [
                {
                    id: '1',
                    name: "Rahul & Priya",
                    event: "Wedding",
                    rating: 5,
                    text: "Sidhi Vinayak events made our wedding absolutely magical. The decoration, the flow of events, everything was perfect. Highly recommended!",
                    image: "https://images.unsplash.com/photo-1663185566085-f5b248a8c430?q=80&w=200&h=200&auto=format&fit=crop",
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    name: "Amit Sharma",
                    event: "Corporate Event",
                    rating: 5,
                    text: "Professionalism at its best. They handled our corporate gala with such ease. The team is very cooperative and creative.",
                    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop",
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    name: "Sneha Gupta",
                    event: "Birthday Party",
                    rating: 4,
                    text: "Great management! The theme was exactly what we wanted for our daughter's birthday. Thank you for making it special.",
                    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
                    createdAt: new Date().toISOString()
                }
            ];
            fs.writeFileSync(reviewsFilePath, JSON.stringify(seedReviews, null, 2));
            return seedReviews as Review[];
        }
        const fileContent = fs.readFileSync(reviewsFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading reviews:", error);
        return [];
    }
};

export const saveReview = (review: Omit<Review, 'id' | 'createdAt'>): Review => {
    const reviews = getReviews();
    const newReview: Review = {
        ...review,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    try {
        ensureDirectoryExistence(reviewsFilePath);
        fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));
    } catch (e) {
        console.warn("Could not save review, likely read-only env:", e);
    }
    return newReview;
};

export const getMessages = (): Message[] => {
    try {
        ensureDirectoryExistence(messagesFilePath);
        if (!fs.existsSync(messagesFilePath)) {
            fs.writeFileSync(messagesFilePath, JSON.stringify([]));
            return [];
        }
        const fileContent = fs.readFileSync(messagesFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading messages:", error);
        return [];
    }
};

export const saveMessage = (msg: Omit<Message, 'id' | 'createdAt'>): Message => {
    const messages = getMessages();
    const newMessage: Message = {
        ...msg,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    try {
        ensureDirectoryExistence(messagesFilePath);
        fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    } catch (e) {
        console.warn("Could not save message, likely read-only env:", e);
    }
    return newMessage;
};

export const getBookings = (): Booking[] => {
    try {
        ensureDirectoryExistence(bookingsFilePath);
        if (!fs.existsSync(bookingsFilePath)) {
            // Create empty if not exists
            fs.writeFileSync(bookingsFilePath, JSON.stringify([]));
            return [];
        }
        const fileContent = fs.readFileSync(bookingsFilePath, 'utf-8');
        const bookings = JSON.parse(fileContent);
        // Migration support for old data without new fields
        return bookings.map((b: any) => ({
            ...b,
            clientName: b.clientName || 'Unknown Client',
            eventType: b.eventType || 'Other',
            totalAmount: b.totalAmount || 0,
            receivedAmount: b.receivedAmount || 0,
            status: b.status || 'upcoming'
        }));
    } catch (error) {
        console.error("Error reading bookings:", error);
        return [];
    }
};

export const saveBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const bookings = getBookings();
    const newBooking: Booking = {
        ...bookingData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);

    try {
        ensureDirectoryExistence(bookingsFilePath);
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
    } catch (e) {
        console.warn("Could not save booking, likely read-only env:", e);
    }

    return newBooking;
};

export const updateBooking = (id: string, updates: Partial<Booking>): Booking | null => {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) return null;

    const updatedBooking = { ...bookings[index], ...updates };
    bookings[index] = updatedBooking;

    try {
        ensureDirectoryExistence(bookingsFilePath);
        fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
    } catch (e) {
        console.warn("Could not update booking:", e);
    }

    return updatedBooking;
};
