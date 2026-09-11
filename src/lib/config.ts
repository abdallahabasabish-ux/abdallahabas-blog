export const SITE = {
  name: "Abdallah Abas",
  blogName: "مدونة عبد الله عباس",
  tagline: "المعرفة التي تساعدك على بناء حضورك الرقمي وتطوير أعمالك",
  description:
    "مقالات عربية عملية عن التسويق الرقمي، تطوير الأعمال، والهوية الرقمية — بقلم عبد الله عباس.",
  url: "https://blog.abdallahabas.com",
  mainSite: "https://abdallahabas.com",
  servicesUrl: "https://abdallahabas.com/services",
  storeUrl: "https://abdallahabas.com/store",
  locale: "ar_AR",
  lang: "ar",
  dir: "rtl",
  logo: "/brand/logo.svg",
  defaultOg: "/brand/og-default.jpg",
  twitter: "@abdallahabas",
  postsPerPage: 9,
} as const;

export const NAV = [
  { href: "/", label: "الرئيسية" },
  { href: "/blog", label: "المقالات" },
  { href: "/categories", label: "التصنيفات" },
  { href: "/about", label: "من أنا" },
  { href: "/contact", label: "تواصل معي" },
] as const;

export const LEGAL_LINKS = [
  { href: "/privacy", label: "سياسة الخصوصية" },
  { href: "/terms", label: "شروط الاستخدام" },
  { href: "/disclaimer", label: "إخلاء المسؤولية" },
  { href: "/cookies", label: "سياسة ملفات تعريف الارتباط" },
] as const;
