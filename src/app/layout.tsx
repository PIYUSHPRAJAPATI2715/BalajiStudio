import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // specific fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sidhivinayakevents.in"),
  title: "Sidhi Vinayak Events | Premium Event Management & Photography in Jaipur",
  description: "Sidhi Vinayak Events offers premium event management, wedding photography, cinematography, and pre-wedding shoots in Jaipur. We create timeless memories for your special moments.",
  keywords: ["Event Management Jaipur", "Wedding Photography Jaipur", "Cinematography", "Pre-wedding Shoot", "Sidhi Vinayak Events", "Best Event Planner Jaipur", "Wedding Cinematographer"],
  authors: [{ name: "Sidhi Vinayak Events" }],
  creator: "Sidhi Vinayak Events",
  publisher: "Sidhi Vinayak Events",
  openGraph: {
    title: "Sidhi Vinayak Events | Premium Event Management in Jaipur",
    description: "Creating timeless memories for your special moments. Specialized in weddings, parties, and corporate events.",
    url: "https://www.sidhivinayakevents.in",
    siteName: "Sidhi Vinayak Events",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 600,
        alt: "Sidhi Vinayak Events Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sidhi Vinayak Events | Event Management & Photography",
    description: "Premium Event Management services in Jaipur. Specialized in weddings and cinematic photography.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  alternates: {
    canonical: "https://www.sidhivinayakevents.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
