import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { THEME_COLOR_DARK, themeBootstrapScript } from "@/lib/theme";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = "https://karthickraman.github.io";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      suppressHydrationWarning
      className={jetbrainsMono.variable}
    >
      <head>
        <meta
          name="theme-color"
          content={THEME_COLOR_DARK}
          id="theme-color-meta"
        />
      </head>
      <body className="dot-grid noise-overlay scanlines min-h-screen antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeBootstrapScript()}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd),
          }}
        />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
