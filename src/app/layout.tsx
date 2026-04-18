import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl = "https://karthickraman.github.io";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0e14",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Karthick Pattabiraman — Terminal",
  description:
    "Senior Java Backend Engineer portfolio — terminal-style single page.",
  openGraph: {
    title: "Karthick Pattabiraman — Terminal",
    description:
      "Senior Java Backend Engineer portfolio — terminal-style single page.",
    url: "/",
    siteName: "Karthick Pattabiraman",
    locale: "en_US",
    type: "website",
    images: [{ url: "/profile.png", width: 160, height: 160, alt: "Karthick Pattabiraman" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Karthick Pattabiraman — Terminal",
    description:
      "Senior Java Backend Engineer portfolio — terminal-style single page.",
    images: ["/profile.png"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Karthick Pattabiraman",
  jobTitle: "Senior Java Backend Engineer",
  url: siteUrl,
  sameAs: [
    "https://linkedin.com/in/karthick-pattabiraman",
    "https://github.com/karthickraman",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${instrumentSerif.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="dot-grid noise-overlay scanlines min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}
