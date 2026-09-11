import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE } from "@/lib/config";

export async function GET() {
  const posts = (await getCollection("posts", (p) => p.data.status === "published"))
    .sort((a, b) => +b.data.publishedAt - +a.data.publishedAt);

  return rss({
    title: SITE.blogName,
    description: SITE.description,
    site: SITE.url,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.excerpt,
      pubDate: p.data.publishedAt,
      link: `/blog/${p.id}/`,
    })),
    customData: `<language>ar</language>`,
  });
}
