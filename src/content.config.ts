import { defineCollection, z, reference } from "astro:content";
import { glob, file } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    excerpt: z.string().max(300),
    cover: z.string(),
    coverAlt: z.string().min(4),
    category: reference("categories"),
    tags: z.array(z.string()).default([]),
    author: reference("authors"),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(["draft", "published", "scheduled", "archived"]).default("draft"),
    featured: z.boolean().default(false),
    pinned: z.boolean().default(false),

    // SEO
    metaTitle: z.string().max(60).optional(),
    metaDescription: z.string().max(160).optional(),
    focusKeyword: z.string().optional(),
    secondaryKeywords: z.array(z.string()).default([]),
    canonicalUrl: z.string().url().optional(),
    noindex: z.boolean().default(false),
    ogImage: z.string().optional(),

    // محتوى منظم
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    toc: z.boolean().default(true),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/categories" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
    order: z.number().default(0),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    avatar: z.string(),
    bio: z.string(),
    expertise: z.array(z.string()).default([]),
    website: z.string().url().optional(),
    social: z.object({
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      youtube: z.string().optional(),
    }).default({}),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { posts, categories, authors, pages };
