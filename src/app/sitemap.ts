import type { MetadataRoute } from "next";
import { TOOLS_CONTENT, SITE_URL } from "@/lib/tools-content";

// Required for `output: "export"` static export — emit /sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/tools/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...TOOLS_CONTENT.map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
