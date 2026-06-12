import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockScreener Pro | Real-Time Market Screener",
  description: "A real-time stock screener dashboard built with Next.js, TanStack Table, and Lightweight Charts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-textPrimary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
