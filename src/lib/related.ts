import { getCollection, type CollectionEntry } from "astro:content";

export async function getRelated(
  current: CollectionEntry<"posts">,
  limit = 4
): Promise<CollectionEntry<"posts">[]> {
  const all = await getCollection("posts", (p) => p.data.status === "published");
  const curTags = new Set(current.data.tags ?? []);
  const curCatId = current.data.category?.id;

  return all
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (p.data.category?.id === curCatId) score += 5;
      for (const t of p.data.tags ?? []) if (curTags.has(t)) score += 2;
      if (p.data.author.id === current.data.author.id) score += 1;
      const days =
        (Date.now() - +new Date(p.data.publishedAt)) / 86_400_000;
      score += Math.max(0, 2 - days / 180);
      return { post: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}
