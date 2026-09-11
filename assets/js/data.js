/* =========================================================
   Abdallah Abas — Data Layer (localStorage-backed)
   ========================================================= */
window.AAB = window.AAB || {};

(function (AAB) {
  'use strict';

  var KEY = 'aab_blog_db_v1';

  /* ---------- Seed ---------- */
  function now(offsetDays) {
    var d = new Date();
    d.setDate(d.getDate() - (offsetDays || 0));
    return d.toISOString();
  }

  var SEED = {
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
      { id: 'c2', slug: 'seo', name: 'تحسين محركات البحث', description: 'كل ما يخص ظهور موقعك في Google: تقني، محتوى، وروابط.', icon: 'search', color: '#0A0A0A', order: 2, seoTitle: 'تحسين محركات البحث (SEO)', metaDescription: 'دليل عملي لتحسين ظهور موقعك في محركات البحث.' },
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
        publishedAt: now(2),
        updatedAt: now(1),
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
        publishedAt: now(5),
        updatedAt: now(3),
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
        publishedAt: now(9),
        updatedAt: now(7),
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
        publishedAt: now(14),
        updatedAt: now(12),
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
        publishedAt: now(20),
        updatedAt: now(18),
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
        publishedAt: now(26),
        updatedAt: now(24),
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
        publishedAt: now(33),
        updatedAt: now(31),
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
        publishedAt: now(40),
        updatedAt: now(38),
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

  /* ---------- Storage ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) { save(SEED); return clone(SEED); }
      var db = JSON.parse(raw);
      if (!db || !db.posts) { save(SEED); return clone(SEED); }
      return db;
    } catch (e) {
      console.warn('[AAB] DB load failed, using seed.', e);
      return clone(SEED);
    }
  }
  function save(db) {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { console.warn('[AAB] DB save failed.', e); }
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function reset() { localStorage.removeItem(KEY); return load(); }

  /* ---------- Public API ---------- */
  AAB.DB = {
    KEY: KEY,
    get: load,
    save: save,
    reset: reset,
    seed: function () { return clone(SEED); },
    addSubscriber: function (email) {
      var db = load();
      if (!db.subscribers) db.subscribers = [];
      if (!db.subscribers.some(function (s) { return s.email === email; })) {
        db.subscribers.push({ email: email, at: new Date().toISOString() });
        save(db);
      }
      return true;
    }
  };

})(window.AAB);
