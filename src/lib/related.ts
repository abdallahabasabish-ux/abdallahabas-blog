import { getCollection } from "astro:content";

export async function getRelated(current, limit = 4) {
  const posts = await getCollection("posts", p =>
    p.data.status === "published" && p.slug !== current.slug
  );

  const curTags = new Set(current.data.tags ?? []);

  return posts
    .map(p => {
      let score = 0;
      if (p.data.category.id === current.data.category.id) score += 5;
      for (const t of p.data.tags ?? []) if (curTags.has(t)) score += 2;
      if (p.data.author.id === current.data.author.id) score += 1;
      // Freshness bonus
      const days = (Date.now() - +new Date(p.data.publishedAt)) / 86400000;
      score += Math.max(0, 2 - days / 180);
      return { post: p, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.post);
}
