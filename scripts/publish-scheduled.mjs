import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

const DIR = "src/content/posts";
const now = new Date();
let count = 0;

for (const file of await readdir(DIR)) {
  const path = join(DIR, file);
  const raw = await readFile(path, "utf8");
  const { data, content } = matter(raw);
  if (data.status === "scheduled" && new Date(data.publishedAt) <= now) {
    data.status = "published";
    await writeFile(path, matter.stringify(content, data));
    count++;
  }
}
console.log(`تم نشر ${count} مقال.`);
