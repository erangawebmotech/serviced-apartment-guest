import { MetadataRoute } from "next";

const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isProduction
      ? [
          {
            userAgent: "*",
            allow: "/",
          },
        ]
      : [
          {
            userAgent: "*",
            disallow: "/",
          },
        ],
    sitemap: isProduction
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
      : undefined,
  };
}
