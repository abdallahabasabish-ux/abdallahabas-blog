/* =========================================================
   Abdallah Abas — App Runtime (header, footer, SEO, helpers)
   ========================================================= */
(function (AAB) {
  'use strict';

  /* ---------- Constants ---------- */
  AAB.SITE  = 'https://blog.abdallahabas.com';
  AAB.STORE = 'https://abdallahabas.com';

  /* ---------- Escape ---------- */
  AAB.esc = function (s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  /* ---------- Format helpers ---------- */
  AAB.formatDate = function (iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return ''; }
  };
  AAB.compactNum = function (n) {
    n = Number(n) || 0;
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    return String(n);
  };
  AAB.slugify = function (s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };
  AAB.readingTime = function (html) {
    var text = String(html || '').replace(/<[^>]+>/g, ' ');
    var words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  };

  /* ---------- Data accessors ---------- */
  AAB.published = function () {
    var db = AAB.DB.get();
    return (db.posts || [])
      .filter(function (p) { return p.status === 'published'; })
      .sort(function (a, b) { return new Date(b.publishedAt) - new Date(a.publishedAt); });
  };
  AAB.bySlug = function (slug) {
    return AAB.DB.get().posts.find(function (p) { return p.slug === slug; });
  };
  AAB.getCategory = function (id) {
    return AAB.DB.get().categories.find(function (c) { return c.id === id; });
  };
  AAB.getCategoryBySlug = function (slug) {
    return AAB.DB.get().categories.find(function (c) { return c.slug === slug; });
  };
  AAB.getTag = function (id) {
    return AAB.DB.get().tags.find(function (t) { return t.id === id; });
  };
  AAB.catPosts = function (catId) {
    return AAB.published().filter(function (p) { return p.categoryId === catId; });
  };
  AAB.relatedPosts = function (post, limit) {
    limit = limit || 3;
    var all = AAB.published().filter(function (p) { return p.id !== post.id; });
    var scored = all.map(function (p) {
      var score = 0;
      if (p.categoryId === post.categoryId) score += 3;
      var shared = (p.tagIds || []).filter(function (t) {
        return (post.tagIds || []).indexOf(t) !== -1;
      }).length;
      score += shared * 2;
      return { post: p, score: score };
    }).sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, limit).map(function (x) { return x.post; });
  };

  /* ---------- Icons ---------- */
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

  AAB.avatarFallback = function (name, size) {
    size = size || 40;
    var initials = String(name || '?').split(/\s+/).map(function (p) { return p[0]; }).slice(0, 2).join('');
    var span = document.createElement('span');
    span.className = 'av-fallback';
    span.style.width = size + 'px';
    span.style.height = size + 'px';
    span.style.fontSize = Math.round(size * 0.4) + 'px';
    span.textContent = initials;
    return span;
  };

  /* ---------- Post card ---------- */
  AAB.postCard = function (post, variant) {
    if (!post) return '';
    var cat = AAB.getCategory(post.categoryId) || {};
    var db = AAB.DB.get();
    var author = db.author;
    var url = 'article.html?slug=' + encodeURIComponent(post.slug);
    var catUrl = cat.slug ? 'category.html?slug=' + encodeURIComponent(cat.slug) : '#';
    var cls = 'card' + (variant === 'row' ? ' card-row' : '');

    return '' +
      '<article class="' + cls + '">' +
        '<a class="card-media" href="' + url + '" aria-label="' + AAB.esc(post.title) + '">' +
          '<img src="' + AAB.esc(post.cover) + '" alt="' + AAB.esc(post.title) + '" loading="lazy" decoding="async" width="800" height="500">' +
          (cat.name ? '<span class="badge badge-brand">' + AAB.esc(cat.name) + '</span>' : '') +
        '</a>' +
        '<div class="card-body">' +
          '<div class="card-meta">' +
            '<span>' + AAB.formatDate(post.publishedAt) + '</span>' +
            '<span class="dot"></span>' +
            '<span>' + (post.readingTime || AAB.readingTime(post.content)) + ' دقائق قراءة</span>' +
          '</div>' +
          '<h3 class="card-title"><a href="' + url + '">' + AAB.esc(post.title) + '</a></h3>' +
          '<p class="card-excerpt">' + AAB.esc(post.excerpt) + '</p>' +
          '<div class="card-foot">' +
            '<span class="card-author">' +
              '<img src="' + AAB.esc(author.avatar) + '" alt="' + AAB.esc(author.name) + '" loading="lazy" width="26" height="26" onerror="this.replaceWith(AAB.avatarFallback(\'' + AAB.esc(author.name) + '\',26))">' +
              '<span>' + AAB.esc(author.name) + '</span>' +
            '</span>' +
            '<a href="' + catUrl + '" class="link-more">' + AAB.esc(cat.name || '') + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  };

  /* ---------- SEO ---------- */
  AAB.setSEO = function (opts) {
    opts = opts || {};
    var db = AAB.DB.get();
    var s = db.settings;
    var title = opts.title || s.siteName;
    var desc = opts.description || s.description;
    var canonical = opts.canonical || (AAB.SITE + location.pathname + location.search);
    var image = opts.image || s.defaultOg;
    var type = opts.type || 'website';

    document.title = title;

    function setMeta(attr, key, val) {
      if (!val) return;
      var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', val);
    }
    setMeta('name', 'description', desc);

    var link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link); }
    link.setAttribute('href', canonical);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:locale', 'ar_AR');
    setMeta('property', 'og:site_name', s.siteName);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', image);

    var existing = document.getElementById('aab-schema');
    if (existing) existing.remove();
    if (opts.schema) {
      var sc = document.createElement('script');
      sc.type = 'application/ld+json';
      sc.id = 'aab-schema';
      sc.textContent = JSON.stringify(opts.schema);
      document.head.appendChild(sc);
    }
  };

  /* ---------- Header ---------- */
  AAB.renderHeader = function () {
    var host = document.getElementById('app-header');
    if (!host) return;
    var db = AAB.DB.get();
    var s = db.settings;
    var page = document.body.dataset.page || '';

    var nav = [
      { href: 'index.html',      label: 'الرئيسية',  key: 'home' },
      { href: 'articles.html',   label: 'المقالات',  key: 'articles' },
      { href: 'categories.html', label: 'التصنيفات', key: 'categories' },
      { href: 'about.html',      label: 'من أنا',    key: 'about' },
      { href: 'contact.html',    label: 'تواصل معي', key: 'contact' }
    ];

    var navHtml = nav.map(function (n) {
      return '<a class="nav-link' + (page === n.key ? ' is-active' : '') + '" href="' + n.href + '">' + n.label + '</a>';
    }).join('');

    var mobHtml = nav.map(function (n) {
      return '<a href="' + n.href + '">' + n.label + AAB.icon.chevron + '</a>';
    }).join('');

    host.innerHTML = '' +
      '<header class="site-header" id="siteHeader">' +
        '<div class="container header-inner">' +
          '<a href="index.html" class="brand" aria-label="' + AAB.esc(s.siteName) + '">' +
            '<img class="brand-logo" src="assets/img/logo.svg" alt="' + AAB.esc(s.siteName) + '" width="150" height="38">' +
          '</a>' +
          '<nav class="nav-desktop" aria-label="التنقل الرئيسي">' + navHtml + '</nav>' +
          '<div class="header-actions">' +
            '<button class="icon-btn" type="button" aria-label="بحث" data-open-search>' + AAB.icon.search + '</button>' +
            '<a class="btn btn-brand btn-sm" href="' + AAB.esc(s.storeUrl) + '" target="_blank" rel="noopener">المتجر</a>' +
            '<button class="menu-btn" type="button" aria-label="القائمة" aria-expanded="false" data-menu-toggle><span></span></button>' +
          '</div>' +
        '</div>' +
        '<div class="mobile-menu" id="mobileMenu">' +
          '<nav aria-label="قائمة الجوال">' + mobHtml + '</nav>' +
          '<div class="mobile-menu-foot">' +
            '<a class="btn btn-brand btn-block" href="' + AAB.esc(s.storeUrl) + '" target="_blank" rel="noopener">زيارة المتجر الرئيسي</a>' +
            '<a class="btn btn-outline btn-block" href="search.html">بحث في المدونة</a>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<div class="search-overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="بحث">' +
        '<div class="search-panel">' +
          '<form class="search-field" id="searchForm" action="search.html" method="get">' +
            AAB.icon.search +
            '<input type="search" name="q" placeholder="ابحث عن مقال، تصنيف، أو وسم..." aria-label="كلمة البحث" autocomplete="off">' +
            '<button type="button" class="search-close" data-close-search>ESC</button>' +
          '</form>' +
          '<div class="search-tips">اكتب واضغط Enter للبحث في جميع المقالات.</div>' +
        '</div>' +
      '</div>';

    wireHeader();
  };

  function wireHeader() {
    var header = document.getElementById('siteHeader');
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('mobileMenu');
    var overlay = document.getElementById('searchOverlay');
    var openSearch = document.querySelector('[data-open-search]');
    var closeSearch = document.querySelector('[data-close-search]');
    var searchInput = overlay && overlay.querySelector('input[name="q"]');

    /* Sticky shadow */
    var onScroll = function () {
      if (!header) return;
      header.classList.toggle('is-stuck', window.scrollY > 6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Mobile menu */
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        menu.classList.toggle('is-open', !open);
        document.body.classList.toggle('menu-open', !open);
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          toggle.setAttribute('aria-expanded', 'false');
          menu.classList.remove('is-open');
          document.body.classList.remove('menu-open');
        });
      });
    }

    /* Search overlay */
    function openOverlay() {
      if (!overlay) return;
      overlay.classList.add('is-open');
      document.body.classList.add('menu-open');
      setTimeout(function () { searchInput && searchInput.focus(); }, 60);
    }
    function closeOverlay() {
      if (!overlay) return;
      overlay.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }
    if (openSearch) openSearch.addEventListener('click', openOverlay);
    if (closeSearch) closeSearch.addEventListener('click', closeOverlay);
    if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeOverlay();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openOverlay(); }
    });
  }

  /* ---------- Footer ---------- */
  AAB.renderFooter = function () {
    var host = document.getElementById('app-footer');
    if (!host) return;
    var db = AAB.DB.get();
    var s = db.settings;
    var a = db.author;
    var cats = db.categories.slice().sort(function (x, y) { return x.order - y.order; }).slice(0, 6);
    var year = new Date().getFullYear();

    var social = [
      { url: s.social.twitter,  icon: AAB.icon.twitter,  label: 'Twitter' },
      { url: s.social.linkedin, icon: AAB.icon.linkedin, label: 'LinkedIn' },
      { url: s.social.github,   icon: AAB.icon.github,   label: 'GitHub' },
      { url: s.social.youtube,  icon: AAB.icon.youtube,  label: 'YouTube' }
    ].filter(function (x) { return x.url; });

    host.innerHTML = '' +
      '<footer class="site-footer">' +
        '<div class="container">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<img class="brand-logo" src="assets/img/logo.svg" alt="' + AAB.esc(s.siteName) + '">' +
              '<p>' + AAB.esc(s.description) + '</p>' +
              '<div class="footer-social">' +
                social.map(function (x) {
                  return '<a href="' + AAB.esc(x.url) + '" target="_blank" rel="noopener" aria-label="' + x.label + '">' + x.icon + '</a>';
                }).join('') +
              '</div>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>المدونة</h4>' +
              '<ul>' +
                '<li><a href="articles.html">جميع المقالات</a></li>' +
                '<li><a href="categories.html">التصنيفات</a></li>' +
                '<li><a href="about.html">من أنا</a></li>' +
                '<li><a href="contact.html">تواصل معي</a></li>' +
                '<li><a href="faq.html">الأسئلة الشائعة</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>التصنيفات</h4>' +
              '<ul>' +
                cats.map(function (c) {
                  return '<li><a href="category.html?slug=' + encodeURIComponent(c.slug) + '">' + AAB.esc(c.name) + '</a></li>';
                }).join('') +
              '</ul>' +
            '</div>' +
            '<div class="footer-col">' +
              '<h4>الموقع الرئيسي</h4>' +
              '<ul>' +
                '<li><a href="' + AAB.esc(s.storeUrl) + '" target="_blank" rel="noopener">الرئيسية</a></li>' +
                '<li><a href="' + AAB.esc(s.storeUrl) + '" target="_blank" rel="noopener">الخدمات</a></li>' +
                '<li><a href="' + AAB.esc(s.storeUrl) + '" target="_blank" rel="noopener">المتجر</a></li>' +
                '<li><a href="' + AAB.esc(s.storeUrl) + '" target="_blank" rel="noopener">تواصل</a></li>' +
              '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<div>© ' + year + ' <a href="' + AAB.esc(s.storeUrl) + '">Abdallah Abas</a> — جميع الحقوق محفوظة.</div>' +
            '<div>' +
              '<a href="privacy.html">سياسة الخصوصية</a> · ' +
              '<a href="terms.html">شروط الاستخدام</a> · ' +
              '<a href="cookies.html">ملفات تعريف الارتباط</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</footer>';
  };

  /* ---------- Auto-init ---------- */
  AAB.init = function () {
    AAB.renderHeader();
    AAB.renderFooter();
  };
  document.addEventListener('DOMContentLoaded', AAB.init);

})(window.AAB);
