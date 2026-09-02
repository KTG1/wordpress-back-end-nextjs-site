import type { MetadataRoute } from "next";
import { getPages, getPosts } from "@/lib/wordpress";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const [posts, pages] = await Promise.all([getPosts(100), getPages(100)]);

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...pages.map((page) => ({
      url: `${siteUrl}/${page.slug}`,
      lastModified: new Date(page.modified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
