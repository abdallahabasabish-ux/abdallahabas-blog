import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: "https://blog.abdallahabas.com",
  output: "static",
  trailingSlash: "ignore",
  integrations: [mdx(), sitemap(), pagefind()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: "append",
        properties: { className: "heading-anchor", ariaLabel: "رابط مباشر للعنوان" },
      }],
    ],
    shikiConfig: { theme: "github-light", wrap: true },
  },
  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
    domains: [],
  },
  build: { inlineStylesheets: "auto" },
});
