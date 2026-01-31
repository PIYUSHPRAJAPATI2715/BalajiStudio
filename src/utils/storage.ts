import fs from 'fs';
import path from 'path';

// Define the file path. In production (Vercel), this won't persist, but works for local.
const dataFilePath = path.join(process.cwd(), 'src', 'data', 'bookings.json');
const messagesFilePath = path.join(process.cwd(), 'src', 'data', 'messages.json');

export type Booking = {
    id: string; // unique ID
    date: string; // ISO date string
    location: string;
    programName: string;
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

// Ensure directory exists
const ensureDirectoryExistence = () => {
    const dirname = path.dirname(dataFilePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

export const getMessages = (): Message[] => {
    try {
        ensureDirectoryExistence();
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
    ensureDirectoryExistence();
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    return newMessage;
};

export const getBookings = (): Booking[] => {
    try {
        ensureDirectoryExistence();
        if (!fs.existsSync(dataFilePath)) {
            // Create empty if not exists
            fs.writeFileSync(dataFilePath, JSON.stringify([]));
            return [];
        }
        const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading bookings:", error);
        return [];
    }
};

export const saveBooking = (booking: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const bookings = getBookings();
    const newBooking: Booking = {
        ...booking,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    };

    // Check if slot overlaps? (Optional, but good to have)
    // For now, simpliest "append".
    bookings.push(newBooking);

    ensureDirectoryExistence();
    fs.writeFileSync(dataFilePath, JSON.stringify(bookings, null, 2));

    return newBooking;
};
