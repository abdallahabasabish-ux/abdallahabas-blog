/* =========================================================
   Abdallah Abas — Data Layer (Seed + Helpers)
   يعمل مع: firebase-data.js
   ========================================================= */
window.AAB = window.AAB || {};

(function (AAB) {
  'use strict';

  /* =========================================================
     1) دوال مساعدة عامة
     ========================================================= */

  /* ---------- Escape HTML ---------- */
  AAB.esc = function (s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  /* ---------- تنسيق التاريخ ---------- */
  AAB.formatDate = function (iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  /* ---------- اختصار الأرقام ---------- */
  AAB.compactNum = function (n) {
    n = Number(n) || 0;
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  };

  /* ---------- توليد Slug ---------- */
  AAB.slugify = function (s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  /* ---------- وقت القراءة ---------- */
  AAB.readingTime = function (html) {
    const text = String(html || '').replace(/<[^>]+>/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  };

  /* =========================================================
     2) دوال الوصول للبيانات
     (تعمل مع Firebase cache أو Seed fallback)
     ========================================================= */

  /* ---------- المقالات المنشورة ---------- */
  AAB.published = function () {
    const db = AAB.DB && AAB.DB.get ? AAB.DB.get() : AAB.SEED;
    return (db.posts || [])
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  };

  /* ---------- مقال بـ slug ---------- */
  AAB.bySlug = function (slug) {
    const db = AAB.DB && AAB.DB.get ? AAB.DB.get() : AAB.SEED;
    return (db.posts || []).find(p => p.slug === slug);
  };

  /* ---------- تصنيف بـ id ---------- */
  AAB.getCategory = function (id) {
    const db = AAB.DB && AAB.DB.get ? AAB.DB.get() : AAB.SEED;
    return (db.categories || []).find(c => c.id === id);
  };

  /* ---------- تصنيف بـ slug ---------- */
  AAB.getCategoryBySlug = function (slug) {
    const db = AAB.DB && AAB.DB.get ? AAB.DB.get() : AAB.SEED;
    return (db.categories || []).find(c => c.slug === slug);
  };

  /* ---------- وسم بـ id ---------- */
  AAB.getTag = function (id) {
    const db = AAB.DB && AAB.DB.get ? AAB.DB.get() : AAB.SEED;
    return (db.tags || []).find(t => t.id === id);
  };

  /* ---------- مقالات تصنيف ---------- */
  AAB.catPosts = function (catId) {
    return AAB.published().filter(p => p.categoryId === catId);
  };

  /* ---------- مقالات ذات صلة ---------- */
  AAB.relatedPosts = function (post, limit) {
    limit = limit || 3;
    const all = AAB.published().filter(p => p.id !== post.id);
    const scored = all.map(p => {
      let score = 0;
      if (p.categoryId === post.categoryId) score += 3;
      const shared = (p.tagIds || []).filter(t => (post.tagIds || []).includes(t)).length;
      score += shared * 2;
      return { post: p, score };
    }).sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(x => x.post);
  };

  /* =========================================================
     3) الأيقونات (SVG)
     ========================================================= */

  AAB.icon = {
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    user: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 3.5M15.4 7l-6.8 3.5"/></svg>',
    twitter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-7-6.2 7H1.6l8-9.2L1 2h7l4.9 6.5L18.9 2zm-2.4 18h1.9L7.5 3.9H5.5L16.5 20z"/></svg>',
    linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.9h.06c.6-1.14 2.08-2.34 4.29-2.34 4.59 0 5.44 3.02 5.44 6.95V22h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V22H7.72V8z"/></svg>',
    github: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>',
    youtube: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6L3 12l5 6M16 6l5 6-5 6"/></svg>',
    searchCat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    palette: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="9.5" r="1.2" fill="currentColor"/><circle cx="15.5" cy="9.5" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4L13.4 20.6a2 2 0 0 1-2.8 0l-7-7A2 2 0 0 1 3 12.2V4.8A1.8 1.8 0 0 1 4.8 3h7.4a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor"/></svg>'
  };

  AAB.catIcon = function (name) {
    return AAB.icon[name] || AAB.icon.folder;
  };

  /* ---------- Avatar Fallback ---------- */
  AAB.avatarFallback = function (name, size) {
    size = size || 40;
    const initials = String(name || '?')
      .split(/\s+/)
      .map(p => p[0])
      .slice(0, 2)
      .join('');
    const span = document.createElement('span');
    span.className = 'av-fallback';
    span.style.width = size + 'px';
    span.style.height = size + 'px';
    span.style.fontSize = Math.round(size * 0.4) + 'px';
    span.textContent = initials;
    return span;
  };

  /* =========================================================
     4) بطاقة المقال
     ========================================================= */

  AAB.postCard = function (post, variant) {
    if (!post) return '';
    const cat = AAB.getCategory(post.categoryId) || {};
    const db = AAB.DB && AAB.DB.get ? AAB.DB.get() : AAB.SEED;
    const author = db.author || { name: 'Abdallah Abas', avatar: 'assets/img/abdallah.svg' };
    const url = 'article.html?slug=' + encodeURIComponent(post.slug);
    const catUrl = cat.slug ? 'category.html?slug=' + encodeURIComponent(cat.slug) : '#';
    const cls = 'card' + (variant === 'row' ? ' card-row' : '');

    return `
      <article class="${cls}">
        <a class="card-media" href="${url}" aria-label="${AAB.esc(post.title)}">
          <img src="${AAB.esc(post.cover)}" alt="${AAB.esc(post.title)}" loading="lazy" decoding="async" width="800" height="500">
          ${cat.name ? `<span class="badge badge-brand">${AAB.esc(cat.name)}</span>` : ''}
        </a>
        <div class="card-body">
          <div class="card-meta">
            <span>${AAB.formatDate(post.publishedAt)}</span>
            <span class="dot"></span>
            <span>${post.readingTime || AAB.readingTime(post.content)} دقائق قراءة</span>
          </div>
          <h3 class="card-title"><a href="${url}">${AAB.esc(post.title)}</a></h3>
          <p class="card-excerpt">${AAB.esc(post.excerpt)}</p>
          <div class="card-foot">
            <span class="card-author">
              <img src="${AAB.esc(author.avatar)}" alt="${AAB.esc(author.name)}" loading="lazy" width="26" height="26"
                   onerror="this.replaceWith(AAB.avatarFallback('${AAB.esc(author.name)}',26))">
              <span>${AAB.esc(author.name)}</span>
            </span>
            <a href="${catUrl}" class="link-more">${AAB.esc(cat.name || '')}</a>
          </div>
        </div>
      </article>`;
  };

  /* =========================================================
     5) SEO — setSEO
     ========================================================= */

  AAB.SITE  = AAB.SITE  || 'https://blog.abdallahabas.com';
  AAB.STORE = AAB.STORE || 'https://abdallahabas.com';

  AAB.setSEO = function (opts) {
    opts = opts || {};
    const db = AAB.DB && AAB.DB.get ? AAB.DB.get() : AAB.SEED;
    const s = db.settings || {};
    const title = opts.title || s.siteName || 'مدونة Abdallah Abas';
    const desc = opts.description || s.description || '';
    const canonical = opts.canonical || (AAB.SITE + location.pathname + location.search);
    const image = opts.image || s.defaultOg || '';
    const type = opts.type || 'website';

    document.title = title;

    const setMeta = (attr, key, val) => {
      if (!val) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    setMeta('name', 'description', desc);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:locale', 'ar_AR');
    setMeta('property', 'og:site_name', s.siteName || '');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', image);

    const existing = document.getElementById('aab-schema');
    if (existing) existing.remove();
    if (opts.schema) {
      const sc = document.createElement('script');
      sc.type = 'application/ld+json';
      sc.id = 'aab-schema';
      sc.textContent = JSON.stringify(opts.schema);
      document.head.appendChild(sc);
    }
  };

  /* =========================================================
     6) SEED DATA — بيانات البذرة
     تُستخدم لزرع Firestore أول مرة فقط
     ========================================================= */

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  AAB.SEED = {
    settings: {
      siteName: 'مدونة Abdallah Abas',
      tagline: 'المعرفة التي تبني حضورك الرقمي',
      description: 'مقالات عملية في تطوير الويب، تحسين محركات البحث، تصميم الواجهات، وبناء المشاريع الرقمية.',
      storeUrl: 'https://abdallahabas.com',
      siteUrl: 'https://blog.abdallahabas.com',
      email: 'hello@abdallahabas.com',
      phone: '',
      newsletterEnabled: true,
      defaultOg: 'assets/img/og-default.jpg',
      social: {
        twitter: 'https://twitter.com/abdallahabas',
        linkedin: 'https://linkedin.com/in/abdallahabas',
        github: 'https://github.com/abdallahabas',
        youtube: ''
      }
    },

    author: {
      id: 'author-1',
      name: 'Abdallah Abas',
      title: 'مطوّر Full-Stack ومهندس SEO',
      bio: 'أساعد الأفراد والشركات على بناء حضور رقمي قوي عبر تطوير الويب، تحسين محركات البحث، وتصميم تجارب استخدام واضحة. أكتب هنا ما أتعلمه من مشاريع حقيقية.',
      avatar: 'assets/img/abdallah.svg',
      skills: ['تطوير الويب', 'تحسين محركات البحث', 'Core Web Vitals', 'تصميم UI/UX', 'أداء المواقع'],
      links: {
        website: 'https://abdallahabas.com',
        twitter: 'https://twitter.com/abdallahabas',
        linkedin: 'https://linkedin.com/in/abdallahabas',
        github: 'https://github.com/abdallahabas'
      }
    },

    categories: [
      { id: 'c1', slug: 'web-development', name: 'تطوير الويب', description: 'أدوات وتقنيات وممارسات عملية لبناء مواقع وتطبيقات ويب حديثة.', icon: 'code', color: '#FF5A00', order: 1, seoTitle: 'تطوير الويب — مقالات عملية', metaDescription: 'مقالات في تطوير الويب الحديث: أداء، أمان، بنية، وأدوات.' },
      { id: 'c2', slug: 'seo', name: 'تحسين محركات البحث', description: 'كل ما يخص ظهور موقعك في Google: تقني، محتوى، وروابط.', icon: 'searchCat', color: '#0A0A0A', order: 2, seoTitle: 'تحسين محركات البحث (SEO)', metaDescription: 'دليل عملي لتحسين ظهور موقعك في محركات البحث.' },
      { id: 'c3', slug: 'design', name: 'تصميم الواجهات', description: 'تصميم UI/UX للعربية، أنظمة تصميم، وتجربة استخدام.', icon: 'palette', color: '#FF5A00', order: 3, seoTitle: 'تصميم الواجهات و UI/UX', metaDescription: 'مقالات في تصميم الواجهات وتجربة المستخدم العربية.' },
      { id: 'c4', slug: 'business', name: 'ريادة الأعمال', description: 'بناء المشاريع الرقمية، تحويل الأفكار إلى منتجات، ونمو.', icon: 'briefcase', color: '#0A0A0A', order: 4, seoTitle: 'ريادة الأعمال الرقمية', metaDescription: 'مقالات في بناء المشاريع الرقمية وتحويل الأفكار إلى منتجات.' }
    ],

    tags: [
      { id: 't1', slug: 'performance', name: 'الأداء' },
      { id: 't2', slug: 'core-web-vitals', name: 'Core Web Vitals' },
      { id: 't3', slug: 'html', name: 'HTML' },
      { id: 't4', slug: 'css', name: 'CSS' },
      { id: 't5', slug: 'javascript', name: 'JavaScript' },
      { id: 't6', slug: 'rtl', name: 'RTL' },
      { id: 't7', slug: 'typography', name: 'الخطوط' },
      { id: 't8', slug: 'mvp', name: 'MVP' },
      { id: 't9', slug: 'strategy', name: 'استراتيجية' },
      { id: 't10', slug: 'schema', name: 'Schema' }
    ],

    posts: [
      {
        id: 'p1',
        slug: 'build-fast-arabic-blog',
        title: 'كيف تبني مدونة عربية سريعة ومتوافقة مع SEO في 2026',
        excerpt: 'خطوات عملية من الصفر لبناء مدونة عربية سريعة، نظيفة تقنيًا، ومهيأة لمحركات البحث — بدون قوالب ثقيلة.',
        content: '<p>بناء مدونة عربية سريعة لا يبدأ باختيار القالب، بل باختيار البنية. في هذا المقال سنمر على القرارات التي تُحدث الفرق الحقيقي في الأداء والظهور.</p><h2 id="why">لماذا تبدأ من الأداء؟</h2><p>معظم المدونات العربية تعاني من نفس المشكلة: قوالب ثقيلة تحمّل سكربتات لا تُستخدم. النتيجة: LCP مرتفع، وتجربة سيئة على الهاتف.</p><h2 id="stack">اختر البنية قبل الإطار</h2><p>ابدأ بـ HTML دلالي، CSS بسيط، وجافاسكربت عند الحاجة فقط. هذا يمنحك أساسًا يمكنك البناء عليه دون ديون تقنية.</p><h3 id="html">HTML دلالي</h3><p>استخدم <code>&lt;article&gt;</code> و<code>&lt;section&gt;</code> و<code>&lt;nav&gt;</code> بشكل صحيح. هذا يساعد محركات البحث ويسهّل صيانة الكود.</p><h3 id="fonts">الخطوط</h3><p>حمّل خطًا واحدًا بوزنين فقط، واستخدم <code>font-display: swap</code> لتجنب حجب العرض.</p><h2 id="seo">الأساسيات التقنية لـ SEO</h2><ul><li>Canonical لكل صفحة.</li><li>Sitemap.xml محدّث تلقائيًا.</li><li>Schema مناسب لنوع المحتوى.</li><li>روابط داخلية ذات معنى.</li></ul><blockquote><p>السرعة ليست ميزة إضافية — هي شرط للظهور في 2026.</p></blockquote><h2 id="conclusion">الخلاصة</h2><p>ابدأ بسيطًا، قِس، ثم حسّن. لا تضف أي شيء قبل أن تُثبت الحاجة إليه.</p>',
        cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1600&q=80',
        categoryId: 'c1',
        tagIds: ['t1', 't3', 't4'],
        authorId: 'author-1',
        publishedAt: daysAgo(2),
        updatedAt: daysAgo(1),
        status: 'published',
        featured: true,
        views: 4820,
        readingTime: 7,
        metaTitle: 'كيف تبني مدونة عربية سريعة ومتوافقة مع SEO في 2026',
        metaDescription: 'دليل عملي لبناء مدونة عربية سريعة ونظيفة تقنيًا ومهيأة لمحركات البحث من الصفر.',
        focusKeyword: 'مدونة عربية سريعة',
        keywords: ['SEO', 'أداء', 'مدونة عربية', 'Core Web Vitals'],
        canonical: '',
        faq: [
          { q: 'هل أحتاج إطار عمل لبناء مدونة سريعة؟', a: 'لا. في كثير من الحالات، HTML وCSS وJS كافية وتحقق أداءً أفضل من إطار ثقيل.' },
          { q: 'ما أهم مقياس أداء أتابعه؟', a: 'LCP و INP و CLS — وكلها متاحة في PageSpeed Insights وSearch Console.' }
        ]
      },
      {
        id: 'p2',
        slug: 'seo-mistakes-arabic-sites',
        title: '10 أخطاء شائعة في تحسين محركات البحث تدمّر ترتيبك',
        excerpt: 'أخطاء يقع فيها معظم أصحاب المواقع العربية، وكيف تتفادها بأقل جهد ممكن.',
        content: '<p>تحسين محركات البحث ليس سحرًا، لكنه يتأثر بأخطاء صغيرة تتكرر. إليك أكثرها شيوعًا.</p><h2 id="m1">1. تجاهل نية البحث</h2><p>كتابة مقال عن "أفضل هواتف" بنية شراء، لن تنجح إن كان الجمهور يبحث عن مقارنة.</p><h2 id="m2">2. عناوين ضعيفة</h2><p>العنوان الجيد يوضح الفائدة فورًا. لا تكرر الكلمة المفتاحية عبثًا.</p><h2 id="m3">3. محتوى رقيق</h2><p>المقالات القصيرة بلا قيمة حقيقية لا تُرتّب. أضف تجربة، أمثلة، وبيانات.</p><h2 id="m4">4. تجاهل Schema</h2><p>Schema المناسب يمنحك ظهورًا أفضل في النتائج.</p><h2 id="m5">5. روابط داخلية عشوائية</h2><p>اربط المقالات ذات الصلة فقط — لا كل شيء بكل شيء.</p><h2 id="m6">6. سرعة الموقع</h2><p>Core Web Vitals عامل ترتيب مباشر. لا تتهاون فيه.</p><h2 id="m7">7. تكرار المحتوى</h2><p>صفحات متشابهة تقتل ترتيبك. أعد الكتابة أو احذف.</p><h2 id="m8">8. إهمال الهاتف</h2><p>معظم الزيارات من الجوال. صمّم للجوال أولًا.</p><h2 id="m9">9. تجاهل Search Console</h2><p>هي مصدرك الأول للأخطاء والفرص.</p><h2 id="m10">10. الاستعجال</h2><p>SEO استثمار طويل الأمد. ابنِ، قِس، حسّن.</p>',
        cover: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1600&q=80',
        categoryId: 'c2',
        tagIds: ['t1', 't10'],
        authorId: 'author-1',
        publishedAt: daysAgo(5),
        updatedAt: daysAgo(3),
        status: 'published',
        featured: true,
        views: 6210,
        readingTime: 6,
        metaTitle: '10 أخطاء SEO شائعة تدمّر ترتيب موقعك',
        metaDescription: 'قائمة بأكثر أخطاء تحسين محركات البحث شيوعًا في المواقع العربية وكيفية تفاديها.',
        focusKeyword: 'أخطاء SEO',
        keywords: ['SEO', 'محركات البحث', 'ترتيب الموقع'],
        canonical: '',
        faq: []
      },
      {
        id: 'p3',
        slug: 'rtl-ui-design-guide',
        title: 'دليل تصميم واجهات المستخدم العربية: من RTL إلى الخطوط',
        excerpt: 'كل ما تحتاجه لتصميم واجهات عربية نظيفة، متوازنة، ومريحة للعين.',
        content: '<p>تصميم واجهة عربية ليس مجرد قلب التصميم الإنجليزي. هناك قرارات تصميمية خاصة بالعربية.</p><h2 id="rtl">RTL ليس انعكاسًا فقط</h2><p>الأيقونات، الأسهم، واتجاه القراءة يحتاجون معالجة منفصلة.</p><h2 id="type">الخطوط</h2><p>اختر خطًا عربيًا حديثًا (مثل IBM Plex Sans Arabic) واستخدم أوزانًا محدودة.</p><h3 id="line-height">ارتفاع السطر</h3><p>العربية تحتاج line-height أعلى من الإنجليزية — بين 1.7 و 1.9.</p><h2 id="numbers">الأرقام</h2><p>استخدم الأرقام العربية الغربية (1،2،3) في الواجهات الحديثة — أوضح وأكثر اتساقًا.</p><h2 id="spacing">المسافات</h2><p>النص العربي يحتاج تنفّسًا أكبر. لا تضغط المحتوى.</p>',
        cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&q=80',
        categoryId: 'c3',
        tagIds: ['t6', 't7'],
        authorId: 'author-1',
        publishedAt: daysAgo(9),
        updatedAt: daysAgo(7),
        status: 'published',
        featured: true,
        views: 3180,
        readingTime: 8,
        metaTitle: 'دليل تصميم واجهات المستخدم العربية (RTL + الخطوط)',
        metaDescription: 'دليل شامل لتصميم واجهات عربية: RTL، الخطوط، الأرقام، والمسافات.',
        focusKeyword: 'تصميم واجهات عربية',
        keywords: ['RTL', 'UI', 'UX', 'خطوط عربية'],
        canonical: '',
        faq: []
      },
      {
        id: 'p4',
        slug: 'core-web-vitals-practical-guide',
        title: 'Core Web Vitals: دليل عملي للمطوّر العربي',
        excerpt: 'كيف تقيس وتحسّن LCP و INP و CLS في مواقعك، خطوة بخطوة.',
        content: '<p>Core Web Vitals هي مجموعة مقاييس تعكس تجربة المستخدم الحقيقية. إليك كيف تتعامل معها عمليًا.</p><h2 id="lcp">LCP — Largest Contentful Paint</h2><p>ركّز على تحسين صورة الهيرو، التحميل المسبق للخطوط، وتقليل TTFB.</p><h2 id="inp">INP — Interaction to Next Paint</h2><p>قلّل JavaScript، قسّم المهام الطويلة، واستخدم Web Workers عند الحاجة.</p><h2 id="cls">CLS — Cumulative Layout Shift</h2><p>احجز أبعاد الصور والإعلانات، وتجنّب إدراج محتوى فوق المحتوى المرئي.</p><h2 id="tools">أدوات القياس</h2><ul><li>PageSpeed Insights</li><li>Search Console → Core Web Vitals</li><li>WebPageTest</li><li>Lighthouse</li></ul>',
        cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80',
        categoryId: 'c1',
        tagIds: ['t1', 't2'],
        authorId: 'author-1',
        publishedAt: daysAgo(14),
        updatedAt: daysAgo(12),
        status: 'published',
        featured: false,
        views: 2740,
        readingTime: 9,
        metaTitle: 'Core Web Vitals: دليل عملي شامل',
        metaDescription: 'دليل عملي لقياس وتحسين Core Web Vitals في مواقع الويب.',
        focusKeyword: 'Core Web Vitals',
        keywords: ['أداء', 'LCP', 'INP', 'CLS'],
        canonical: '',
        faq: []
      },
      {
        id: 'p5',
        slug: 'blog-to-clients',
        title: 'كيف تحوّل مدونتك إلى قناة عملاء حقيقية',
        excerpt: 'المدونة ليست ترفًا — يمكن أن تكون أفضل مصدر لعملائك إذا بُنيت بذكاء.',
        content: '<p>معظم المدونات تفشل في توليد عملاء لأنها تفتقد الربط بين المحتوى والخدمة.</p><h2 id="intent">ابدأ من نية القارئ</h2><p>اكتب لما يبحث عنه عميلك المحتمل، لا لما تحب الحديث عنه.</p><h2 id="cta">CTA داخل السياق</h2><p>ضع دعوات الإجراء في نقاط طبيعية، لا في نهاية المقال فقط.</p><h2 id="landing">صفحات هبوط مخصصة</h2><p>اربط كل مقال بصفحة خدمة مناسبة بدل الصفحة الرئيسية.</p><h2 id="measure">قِس التحويلات</h2><p>استخدم UTM و Search Console لمعرفة ما يجلب عملاء حقيقيين.</p>',
        cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80',
        categoryId: 'c4',
        tagIds: ['t9'],
        authorId: 'author-1',
        publishedAt: daysAgo(20),
        updatedAt: daysAgo(18),
        status: 'published',
        featured: false,
        views: 1990,
        readingTime: 6,
        metaTitle: 'كيف تحوّل مدونتك إلى قناة عملاء حقيقية',
        metaDescription: 'استراتيجيات عملية لتحويل مدونتك إلى مصدر مستمر للعملاء.',
        focusKeyword: 'مدونة تجلب عملاء',
        keywords: ['تسويق بالمحتوى', 'عملاء', 'استراتيجية'],
        canonical: '',
        faq: []
      },
      {
        id: 'p6',
        slug: 'clean-url-structure',
        title: 'بنية URL نظيفة: الأساس الذي يتجاهله الجميع',
        excerpt: 'الروابط النظيفة ليست تفصيلًا تجميليًا — تؤثر في الترتيب والمشاركة والتحليلات.',
        content: '<p>الـ URL جزء من تجربة المستخدم و SEO. اجعله بسيطًا وواضحًا ومستقرًا.</p><h2 id="rules">قواعد أساسية</h2><ul><li>كلمات صغيرة مفصولة بشرطات.</li><li>بدون معرّفات عشوائية.</li><li>بدون تواريخ إلا عند الحاجة.</li><li>مستقر لا يتغير بعد النشر.</li></ul><h2 id="redirects">إدارة التحويلات</h2><p>عند تغيير رابط، استخدم 301 دائمًا.</p>',
        cover: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1600&q=80',
        categoryId: 'c2',
        tagIds: ['t3', 't10'],
        authorId: 'author-1',
        publishedAt: daysAgo(26),
        updatedAt: daysAgo(24),
        status: 'published',
        featured: false,
        views: 1450,
        readingTime: 5,
        metaTitle: 'بنية URL نظيفة وأثرها في SEO',
        metaDescription: 'كيف تبني بنية روابط نظيفة تساعد في الترتيب وتجربة المستخدم.',
        focusKeyword: 'بنية URL',
        keywords: ['URL', 'SEO تقني', 'روابط'],
        canonical: '',
        faq: []
      },
      {
        id: 'p7',
        slug: 'mvp-from-idea-to-product',
        title: 'من الفكرة إلى المنتج: كيف تبني MVP عربي ناجح',
        excerpt: 'خطوات عملية لتحويل فكرة إلى منتج قابل للاختبار في أقل وقت وأقل تكلفة.',
        content: '<p>MVP ليس منتجًا ناقصًا، بل أصغر نسخة تختبر بها الفرضية الأساسية.</p><h2 id="define">حدّد الفرضية</h2><p>ما الذي تفترض أنه صحيح؟ اكتبه بوضوح قبل أي كود.</p><h2 id="scope">قلّص النطاق</h2><p>ابدأ بميزة واحدة تحل مشكلة واحدة.</p><h2 id="build">ابنِ بسرعة</h2><p>استخدم أدوات جاهزة، لا تُعد بناء ما هو موجود.</p><h2 id="learn">تعلّم من المستخدمين</h2><p>أطلق مبكرًا، اجمع ملاحظات، ثم قرر: أكمل، عدّل، أو أوقف.</p>',
        cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
        categoryId: 'c4',
        tagIds: ['t8', 't9'],
        authorId: 'author-1',
        publishedAt: daysAgo(33),
        updatedAt: daysAgo(31),
        status: 'published',
        featured: false,
        views: 1610,
        readingTime: 7,
        metaTitle: 'كيف تبني MVP ناجح من الفكرة إلى المنتج',
        metaDescription: 'دليل عملي لبناء MVP عربي ناجح بأقل تكلفة وأسرع وقت.',
        focusKeyword: 'بناء MVP',
        keywords: ['MVP', 'منتج', 'ريادة أعمال'],
        canonical: '',
        faq: []
      },
      {
        id: 'p8',
        slug: 'javascript-performance-basics',
        title: 'أساسيات أداء JavaScript في الويب الحديث',
        excerpt: 'كيف تقلل حجم وتأثير JavaScript على تجربة المستخدم دون التضحية بالميزات.',
        content: '<p>JavaScript هو أكبر سبب لبطء المواقع الحديثة. إليك كيف تتحكم فيه.</p><h2 id="bundle">قلّل الحزمة</h2><p>قسّم الكود، واستخدم Tree Shaking، وتجنب المكتبات الضخمة.</p><h2 id="defer">Defer & Async</h2><p>لا تحجب العرض بسكربتات غير ضرورية.</p><h2 id="workers">Web Workers</h2><p>انقل المهام الثقيلة خارج الخيط الرئيسي.</p><h2 id="measure">قِس</h2><p>استخدم Performance API و DevTools لفهم ما يجري فعلًا.</p>',
        cover: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1600&q=80',
        categoryId: 'c1',
        tagIds: ['t5', 't1'],
        authorId: 'author-1',
        publishedAt: daysAgo(40),
        updatedAt: daysAgo(38),
        status: 'published',
        featured: false,
        views: 1230,
        readingTime: 8,
        metaTitle: 'أساسيات أداء JavaScript في الويب الحديث',
        metaDescription: 'كيف تحسّن أداء JavaScript وتقلل تأثيره على سرعة موقعك.',
        focusKeyword: 'أداء JavaScript',
        keywords: ['JavaScript', 'أداء', 'تحسين'],
        canonical: '',
        faq: []
      }
    ],

    pages: [
      { id: 'pg1', slug: 'about', title: 'من أنا', type: 'about' },
      { id: 'pg2', slug: 'contact', title: 'تواصل معي', type: 'contact' },
      { id: 'pg3', slug: 'faq', title: 'الأسئلة الشائعة', type: 'faq' }
    ],

    subscribers: []
  };

  /* =========================================================
     7) Fallback DB — إن لم يكن firebase-data.js محمّلًا
     ========================================================= */

  if (!AAB.DB) {
    console.warn('[data.js] firebase-data.js غير محمّل — استخدام SEED كـ fallback.');

    AAB.DB = {
      get: () => AAB.SEED,
      ready: () => Promise.resolve(AAB.SEED),
      refresh: () => Promise.resolve(AAB.SEED),
      clearCache: () => {},
      savePost: () => Promise.reject(new Error('Firebase not loaded')),
      deletePost: () => Promise.reject(new Error('Firebase not loaded')),
      saveCategory: () => Promise.reject(new Error('Firebase not loaded')),
      deleteCategory: () => Promise.reject(new Error('Firebase not loaded')),
      saveTag: () => Promise.reject(new Error('Firebase not loaded')),
      deleteTag: () => Promise.reject(new Error('Firebase not loaded')),
      saveAuthor: () => Promise.reject(new Error('Firebase not loaded')),
      saveSettings: () => Promise.reject(new Error('Firebase not loaded')),
      addSubscriber: () => Promise.reject(new Error('Firebase not loaded')),
      seedIfEmpty: () => Promise.reject(new Error('Firebase not loaded'))
    };
    AAB.firebaseReady = () => Promise.resolve(AAB.SEED);
  }

  /* =========================================================
     8) تعيين علامة الجاهزية
     ========================================================= */

  console.log('[data.js] تم التحميل — Seed ready ✓');

})(window.AAB);
