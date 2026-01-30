import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google"; // specific fonts
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Balaji Events & Photo Studio",
  description: "Capture your best moments with Balaji Events and Photo Studio. Wedding, Pre-wedding, Maternity, and more.",
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
