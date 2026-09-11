import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: "https://blog.abdallahabas.com",
  output: "static",
  integrations: [mdx(), sitemap(), pagefind()],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
    shikiConfig: { theme: "github-light" },
  },
  image: { service: { entrypoint: "astro/assets/services/sharp" } },
  build: { inlineStylesheets: "auto" },
});
