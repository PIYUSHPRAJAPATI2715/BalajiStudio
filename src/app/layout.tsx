import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // specific fonts
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sidhivinayakevents.in"),
  title: "Sidhi Vinayak Events | Best Event Management & Wedding Photography in Jaipur",
  description: "Sidhi Vinayak Events: Top-rated event management, destination wedding photography, cinematography, and pre-wedding shoots in Jaipur. Over 10 years of creating timeless memories.",
  keywords: [
    "Event Management Jaipur",
    "Wedding Photography Jaipur",
    "Best Event Planner Jaipur",
    "Destination Wedding Jaipur",
    "Cinematography Jaipur",
    "Pre-wedding Shoot Jaipur",
    "Sidhi Vinayak Events",
    "Wedding Cinematographer Jaipur",
    "Birthday Party Planner Jaipur",
    "Corporate Event Management Jaipur"
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
    title: "Sidhi Vinayak Events | Best Event Management & Photography in Jaipur",
    description: "Award-winning event management and wedding photography in Jaipur. Specialized in destination weddings and cinematic films.",
    url: "https://www.sidhivinayakevents.in",
    siteName: "Sidhi Vinayak Events",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Sidhi Vinayak Events - Best Wedding Photography in Jaipur",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sidhi Vinayak Events | Top Event Management in Jaipur",
    description: "Premium wedding photography and event planning services in Jaipur. Book your special day with the best.",
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
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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
