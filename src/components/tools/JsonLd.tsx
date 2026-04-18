import type { ToolContent } from "@/lib/tools-content";
import { SITE_URL } from "@/lib/tools-content";

interface JsonLdProps {
  tool: ToolContent;
}

/**
 * Emits three schema.org JSON-LD blobs per tool page:
 *   1. SoftwareApplication — describes the tool itself (eligible for app rich
 *      results in Google).
 *   2. FAQPage             — turns the FAQ into rich-snippet-eligible content.
 *   3. BreadcrumbList      — gives Google the breadcrumb chain.
 *
 * All schemas are inlined as <script type="application/ld+json"> in <head>.
 */
export function ToolJsonLd({ tool }: JsonLdProps) {
  const url = `${SITE_URL}/tools/${tool.slug}/`;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.h1,
    description: tool.pageDescription,
    url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern browser with JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Karthick Pattabiraman",
      url: SITE_URL,
    },
    keywords: tool.keywords.join(", "),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.a,
      },
    })),
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${SITE_URL}/tools/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tool.h1,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
    </>
  );
}

interface ToolsIndexJsonLdProps {
  toolUrls: { name: string; url: string }[];
}

export function ToolsIndexJsonLd({ toolUrls }: ToolsIndexJsonLdProps) {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Developer Tools",
    description: "Free, browser-based developer utilities by Karthick Pattabiraman.",
    itemListElement: toolUrls.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: t.url,
      name: t.name,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${SITE_URL}/tools/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
