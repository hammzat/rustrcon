import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/pr/",
    },
    sitemap: "https://rcon.aristocratos.ru/sitemap.xml",
  };
}
