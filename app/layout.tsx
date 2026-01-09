import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rcon.aristocratos.ru"),
  title: {
    default: "Rust RCON Client | Web Console",
    template: "%s | Rust RCON",
  },
  description:
    "Безопасный веб-клиент RCON для управления серверами Rust. Консоль в реальном времени, отправка команд, мониторинг чата прямо из браузера.",
  keywords: [
    "Rust",
    "RCON",
    "WebRcon",
    "Server Admin",
    "Console",
    "Facepunch",
    "Раст",
    "Админка",
    "Консоль",
  ],
  authors: [{ name: "aristocratos", url: "https://aristocratos.ru" }],
  creator: "aristocratos",
  publisher: "aristocratos",
  applicationName: "Rust RCON",
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
    type: "website",
    locale: "ru_RU",
    url: "https://rcon.aristocratos.ru",
    title: "Rust RCON Client",
    description:
      "Удобная веб-консоль для администрирования Rust серверов. Client-side only.",
    siteName: "Rust WebRcon",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rust RCON Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rust RCON Client",
    description: "Безопасная веб-консоль для Rust серверов.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Rust RCON Client",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "aristocratos",
    url: "https://aristocratos.ru",
  },
  description: "Безопасный веб-клиент RCON для управления серверами Rust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-200`}
      >
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
