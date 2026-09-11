/**
 * firebase-data.js — طبقة البيانات (Firestore)
 *
 * الاستراتيجية:
 * 1) عند تحميل الصفحة → نجلب كل البيانات من Firestore مرة واحدة
 * 2) نخزنها في الذاكرة + localStorage (للعمل offline)
 * 3) الدوال المتزامنة AAB.DB.get() تعمل من الـ cache
 * 4) عمليات الكتابة → Firestore ثم تُحدّث الـ cache
 */

import { db as firestore } from "./firebase-init.js";
import {
  collection, doc, getDocs, setDoc, deleteDoc,
  query, limit as fbLimit, serverTimestamp, writeBatch
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

window.AAB = window.AAB || {};

(function (AAB) {
  "use strict";

  const CACHE_KEY = "aab_blog_cache_v2";
  const CACHE_TTL = 1000 * 60 * 5; // 5 دقائق

  let cache = null;
  let loadedAt = 0;
  let loadPromise = null;

  /* =========================================================
     1) Loading from Firestore
     ========================================================= */

  async function fetchCollection(name) {
    const snap = await getDocs(collection(firestore, name));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async function loadFromFirestore() {
    const [settings, author, categories, tags, posts, subscribers, pages] = await Promise.all([
      fetchCollection("settings").catch(() => []),
      fetchCollection("author").catch(() => []),
      fetchCollection("categories").catch(() => []),
      fetchCollection("tags").catch(() => []),
      fetchCollection("posts").catch(() => []),
      fetchCollection("subscribers").catch(() => []),
      fetchCollection("pages").catch(() => [])
    ]);

    return {
      settings: settings[0] || defaultSettings(),
      author: author[0] || defaultAuthor(),
      categories: categories.sort((a, b) => (a.order || 0) - (b.order || 0)),
      tags,
      posts: posts.map(normalizePost).sort((a, b) =>
        new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
      ),
      subscribers,
      pages
    };
  }

  function normalizePost(p) {
    const toISO = (v) => {
      if (!v) return null;
      if (typeof v === "string") return v;
      if (v.toDate) return v.toDate().toISOString();
      if (v.seconds) return new Date(v.seconds * 1000).toISOString();
      return null;
    };
    return {
      ...p,
      publishedAt: toISO(p.publishedAt),
      updatedAt: toISO(p.updatedAt),
      views: p.views || 0,
      featured: !!p.featured,
      tagIds: p.tagIds || [],
      keywords: p.keywords || [],
      faq: p.faq || []
    };
  }

  function defaultSettings() {
    return {
      siteName: "مدونة Abdallah Abas",
      tagline: "المعرفة التي تبني حضورك الرقمي",
      description: "مقالات عملية في تطوير الويب وتحسين محركات البحث.",
      storeUrl: "https://abdallahabas.com",
      siteUrl: "https://blog.abdallahabas.com",
      email: "hello@abdallahabas.com",
      newsletterEnabled: true,
      social: {}
    };
  }

  function defaultAuthor() {
    return {
      id: "author-1",
      name: "Abdallah Abas",
      title: "مطوّر Full-Stack",
      bio: "",
      avatar: "assets/img/abdallah.svg",
      skills: [],
      links: {}
    };
  }

  /* =========================================================
     2) Cache layer
     ========================================================= */

  function readLocalCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      if (Date.now() - (obj._ts || 0) > CACHE_TTL) return null;
      return obj.data;
    } catch { return null; }
  }

  function writeLocalCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ _ts: Date.now(), data }));
    } catch { /* quota */ }
  }

  function emptyDB() {
    return {
      settings: defaultSettings(),
      author: defaultAuthor(),
      categories: [], tags: [], posts: [], subscribers: [], pages: []
    };
  }

  /* =========================================================
     3) Public DB API
     ========================================================= */

  const DB = {
    async ready() {
      if (cache && Date.now() - loadedAt < CACHE_TTL) return cache;
      if (loadPromise) return loadPromise;

      const local = readLocalCache();
      if (local && !cache) cache = local;

      loadPromise = loadFromFirestore()
        .then(fresh => {
          cache = fresh;
          loadedAt = Date.now();
          writeLocalCache(fresh);
          loadPromise = null;
          return fresh;
        })
        .catch(err => {
          console.error("[FirebaseDB] load failed:", err);
          loadPromise = null;
          if (cache) return cache;
          throw err;
        });

      return loadPromise;
    },

    get() {
      if (!cache) {
        const local = readLocalCache();
        cache = local || emptyDB();
      }
      return cache;
    },

    async refresh() {
      loadedAt = 0;
      return this.ready();
    },

    clearCache() {
      cache = null;
      loadedAt = 0;
      localStorage.removeItem(CACHE_KEY);
    },

    /* ===== Writes ===== */

    async savePost(post) {
      const id = post.id || "p" + Date.now();
      const ref = doc(firestore, "posts", id);
      const payload = {
        ...post,
        id,
        updatedAt: serverTimestamp(),
        publishedAt: post.publishedAt ? new Date(post.publishedAt) : serverTimestamp()
      };
      delete payload.id;

      if (cache) {
        const idx = cache.posts.findIndex(p => p.id === id);
        const normalized = normalizePost({ ...post, id, updatedAt: new Date().toISOString() });
        if (idx >= 0) cache.posts[idx] = normalized;
        else cache.posts.unshift(normalized);
        writeLocalCache(cache);
      }

      await setDoc(ref, payload, { merge: true });
      return { ok: true, id };
    },

    async deletePost(id) {
      await deleteDoc(doc(firestore, "posts", id));
      if (cache) {
        cache.posts = cache.posts.filter(p => p.id !== id);
        writeLocalCache(cache);
      }
      return { ok: true };
    },

    async saveCategory(cat) {
      const id = cat.id || "c" + Date.now();
      const ref = doc(firestore, "categories", id);
      const payload = { ...cat, id, order: cat.order || 99 };
      delete payload.id;
      await setDoc(ref, payload, { merge: true });
      if (cache) {
        const idx = cache.categories.findIndex(c => c.id === id);
        if (idx >= 0) cache.categories[idx] = { ...cat, id };
        else cache.categories.push({ ...cat, id });
        writeLocalCache(cache);
      }
      return { ok: true, id };
    },

    async deleteCategory(id) {
      await deleteDoc(doc(firestore, "categories", id));
      if (cache) cache.categories = cache.categories.filter(c => c.id !== id);
      return { ok: true };
    },

    async saveTag(tag) {
      const id = tag.id || "t" + Date.now();
      await setDoc(doc(firestore, "tags", id), { ...tag, id }, { merge: true });
      if (cache) {
        const idx = cache.tags.findIndex(t => t.id === id);
        if (idx >= 0) cache.tags[idx] = { ...tag, id };
        else cache.tags.push({ ...tag, id });
      }
      return { ok: true, id };
    },

    async deleteTag(id) {
      await deleteDoc(doc(firestore, "tags", id));
      if (cache) cache.tags = cache.tags.filter(t => t.id !== id);
      return { ok: true };
    },

    async saveAuthor(author) {
      const id = author.id || "author-1";
      await setDoc(doc(firestore, "author", id), { ...author, id }, { merge: true });
      if (cache) cache.author = { ...author, id };
      return { ok: true };
    },

    async saveSettings(settings) {
      await setDoc(doc(firestore, "settings", "site"), settings, { merge: true });
      if (cache) cache.settings = { ...cache.settings, ...settings };
      return { ok: true };
    },

    async addSubscriber(email) {
      const id = btoa(email).replace(/=/g, "").slice(0, 40);
      await setDoc(doc(firestore, "subscribers", id), {
        email,
        at: serverTimestamp()
      });
      if (cache) {
        if (!cache.subscribers) cache.subscribers = [];
        if (!cache.subscribers.some(s => s.email === email)) {
          cache.subscribers.push({ email, at: new Date().toISOString() });
        }
      }
      return { ok: true };
    },

    async seedIfEmpty(seedData) {
      const snap = await getDocs(query(collection(firestore, "posts"), fbLimit(1)));
      if (!snap.empty) return { ok: true, skipped: true };

      const batch = writeBatch(firestore);
      (seedData.categories || []).forEach(c => batch.set(doc(firestore, "categories", c.id), c));
      (seedData.tags || []).forEach(t => batch.set(doc(firestore, "tags", t.id), t));
      (seedData.posts || []).forEach(p => {
        const { id, ...rest } = p;
        batch.set(doc(firestore, "posts", id), {
          ...rest,
          publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : new Date(),
          updatedAt: new Date()
        });
      });
      batch.set(doc(firestore, "settings", "site"), seedData.settings);
      batch.set(doc(firestore, "author", seedData.author.id), seedData.author);

      await batch.commit();
      console.log("[FirebaseDB] Seed data inserted.");
      return { ok: true, seeded: true };
    }
  };

  AAB.DB = DB;
  AAB.firebaseReady = () => DB.ready();

})(window.AAB);
