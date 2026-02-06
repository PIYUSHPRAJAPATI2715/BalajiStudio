import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // specific fonts
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sidhivinayakevents.in"),
  title: "Sidhi Vinayak Events | #1 Wedding Photography & Event Management in Jaipur",
  description: "Capture your special moments with Sidhi Vinayak Events. Jaipur's best wedding photographers and event planners specializing in destination weddings, pre-wedding shoots, and cinematic films. 5-Star rated services.",
  keywords: [
    "Sidhi Vinayak Events",
    "Best Wedding Photography Jaipur",
    "Top Event Management Jaipur",
    "Destination Wedding Photographer Jaipur",
    "Cinematic Wedding Film Jaipur",
    "Pre-wedding Shoot Jaipur",
    "Wedding Event Planner Jaipur",
    "Birthday Party Planner Jaipur",
    "Jaipur Photography Services",
    "Professional Cinematography Jaipur"
  ],
  authors: [{ name: "Sidhi Vinayak Events" }],
  creator: "Sidhi Vinayak Events",
  publisher: "Sidhi Vinayak Events",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Sidhi Vinayak Events | Best Wedding Photography & Events in Jaipur",
    description: "Jaipur's premier event management and wedding photography studio. Creating timeless memories with cinematic films and creative photography.",
    url: "https://www.sidhivinayakevents.in",
    siteName: "Sidhi Vinayak Events",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Sidhi Vinayak Events Jaipur - Wedding Photography & Events",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sidhi Vinayak Events | Best Wedding Photography & Events",
    description: "Premium wedding films and event services in Jaipur. Specialized in destination weddings and creative shoots.",
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZL79XH513M"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ZL79XH513M');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
