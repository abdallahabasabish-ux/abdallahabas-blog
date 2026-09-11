import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const DIR = "src/content/posts";
const now = new Date();
let changed = 0;

for (const file of await readdir(DIR)) {
  if (!/\.(md|mdx)$/.test(file)) continue;
  const path = join(DIR, file);
  const raw = await readFile(path, "utf8");
  const { data, content } = matter(raw);

  if (data.status !== "scheduled") continue;
  if (!data.publishedAt) continue;
  if (new Date(data.publishedAt) > now) continue;

  data.status = "published";
  await writeFile(path, matter.stringify(content, data));
  changed++;
  console.log(`✔ نُشر: ${file}`);
}

console.log(`تم نشر ${changed} مقال.`);
