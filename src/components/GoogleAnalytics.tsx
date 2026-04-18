"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, hasGa, sendPageView } from "@/lib/gtag";

function GaPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!hasGa()) return;
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    sendPageView(path || "/");
  }, [pathname, searchParams]);

  return null;
}

/**
 * Loads GA4 (gtag.js) once and sends a page_view on every App Router navigation.
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is unset.
 */
export function GoogleAnalytics() {
  if (!hasGa()) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
`}
      </Script>
      <Suspense fallback={null}>
        <GaPageViewTracker />
      </Suspense>
    </>
  );
}
