import { SITE } from "./config";

type Args = {
  title: string;
  description?: string;
  path: string;
  image?: string;
  canonical?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
};

export function buildHead(a: Args) {
  const url = a.canonical ?? `${SITE.url}${a.path}`;
  const image = a.image
    ? a.image.startsWith("http") ? a.image : `${SITE.url}${a.image}`
    : `${SITE.url}${SITE.defaultOg}`;

  return {
    title: a.title,
    description: a.description,
    canonical: url,
    image,
    type: a.type ?? "website",
    publishedTime: a.publishedTime,
    modifiedTime: a.modifiedTime,
    noindex: !!a.noindex,
  };
}

export const jsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

export const articleSchema = (p: any) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: p.title,
  description: p.metaDescription ?? p.excerpt,
  image: p.cover ? [`${SITE.url}${p.cover}`] : undefined,
  datePublished: p.publishedAt?.toISOString?.() ?? p.publishedAt,
  dateModified: (p.updatedAt ?? p.publishedAt)?.toISOString?.() ?? p.updatedAt,
  author: {
    "@type": "Person",
    name: p.author.name,
    url: `${SITE.url}/author/${p.author.id}`,
  },
  publisher: {
    "@type": "Organization",
    name: SITE.name,
    logo: { "@type": "ImageObject", url: `${SITE.url}${SITE.logo}` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${p.slug}` },
  inLanguage: "ar",
  keywords: [p.focusKeyword, ...(p.secondaryKeywords ?? [])].filter(Boolean).join(", "),
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${SITE.url}${it.url}`,
  })),
});

export const faqSchema = (faq: { q: string; a: string }[]) =>
  faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

export const personSchema = (u: any) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: u.name,
  description: u.bio,
  image: u.avatar ? `${SITE.url}${u.avatar}` : undefined,
  url: `${SITE.url}/author/${u.id}`,
  sameAs: Object.values(u.social ?? {}).filter(Boolean),
});
