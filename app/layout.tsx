// app/layout.tsx
// Root layout with romantic Google Fonts

import type { Metadata } from "next";
import { Dancing_Script, Quicksand } from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Little Surprise 💖",
  description: "Something special for you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dancingScript.variable} ${quicksand.variable} font-quicksand antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
