import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head"; // Importing Head for dynamic title management

import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevRostify",
  description: "Roast Your GitHub Like a Pro (and Cry Later)",
  keywords: [
    "GitHub roast",
    "DevRostify",
    "developer tools",
    "funny GitHub analyzer",
    "GitHub profile analyzer",
    "GitHub humor",
    "roast generator",
    "dev rostify",
    'dev rostify github roast',
    'nikhil sai ankilla'
  ],
  authors: [{ name: "Nikhil sai ankilla", url: "https://twitter.com/NikhilSaiAnkil1" }],
  creator: "Nikhil",
  metadataBase: new URL("https://dev-rostify.vercel.app"),
  openGraph: {
    title: "DevRostify – Roast Your GitHub Like a Pro",
    description:
      "Get roasted based on your GitHub activity. DevRostify analyzes your commits, repos, and more to deliver brutal, funny developer roasts.",
    url: "https://dev-rostify.vercel.app",
    siteName: "DevRostify",
    images: [
      {
        url: "https://dev-rostify.vercel.app/og-image.png", // Replace with actual image URL
        width: 1200,
        height: 630,
        alt: "DevRostify – Roast Your GitHub Like a Pro",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevRostify – Roast Your GitHub Like a Pro",
    description:
      "Roast your GitHub like never before. Analyze your public activity and get a personalized roast card. Funny, brutal, developer-friendly.",
    creator: "@NikhilSaiAnkil1", // replace with your actual Twitter handle
    images: ["/banner.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollbarWidth: "none" }}>
      <Head>
        <link rel="canonical" href="https://dev-rostify.vercel.app" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "DevRostify",
              url: "https://dev-rostify.vercel.app",
              applicationCategory: "Developer Tools",
              description:
                "DevRostify is a GitHub roast generator that delivers hilarious, AI-generated roast cards based on your developer activity.",
              creator: {
                "@type": "Person",
                name: "Nikhil",
              },
            }),
          }}
        />

        {/* Preconnect to Google Fonts for performance */}
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        {/* Dynamic Page Title */}

        <title>Dev Rostify</title>

        {/* Include Manifest for PWA */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased px-3 md:px-8 lg:px-32`}
      >
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
