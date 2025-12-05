import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://qr-code-generator-malamapl09s-projects.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/dashboard/", "/callback"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
