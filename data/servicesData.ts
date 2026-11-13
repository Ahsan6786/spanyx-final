export interface ServiceListingItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  webpImage: string;
  href: string;
}

export const SERVICES_LIST: ServiceListingItem[] = [
  {
    id: 'erp-solutions',
    slug: 'erp-solutions',
    title: 'ERP Solutions',
    subtitle: 'Tailored management platforms that connect your daily operations, inventory, client billing, and team workflows in one unified system.',
    image: '/erp.jpeg',
    webpImage: '/erp.webp',
    href: '/what-we-create/erp-solutions',
  },
  {
    id: 'business-websites',
    slug: 'business-websites',
    title: 'Business Websites',
    subtitle: 'Professional corporate websites designed to build trust, present your business clearly, and turn visitors into qualified inquiries.',
    image: '/websites.jpeg',
    webpImage: '/websites.webp',
    href: '/what-we-create/business-websites',
  },
  {
    id: 'ai-agents',
    slug: 'ai-agents',
    title: 'AI Agents',
    subtitle: 'Smart AI assistants and automated workflows that handle repetitive tasks, answer customer questions, and save your team hours every day.',
    image: '/ai-mockk.png',
    webpImage: '/ai-mockk.webp',
    href: '/what-we-create/ai-agents',
  },
  {
    id: 'scroll-driven-animations',
    slug: 'scroll-driven-animations',
    title: 'Scroll-Driven Animations',
    subtitle: 'Interactive, engaging visual storytelling that moves as visitors scroll, showcasing your products and features in a memorable way.',
    image: '/scroll1.png',
    webpImage: '/scroll1.webp',
    href: '/what-we-create/scroll-driven-animations',
  },
  {
    id: 'brand-portfolio-websites',
    slug: 'brand-portfolio-websites',
    title: 'Brand & Portfolio Websites',
    subtitle: 'Distinctive digital portfolios crafted with clean media galleries and custom layouts to put your best work and creative story front and center.',
    image: '/brand.jpeg',
    webpImage: '/brand.webp',
    href: '/what-we-create/brand-portfolio-websites',
  },
  {
    id: 'web-applications',
    slug: 'web-applications',
    title: 'Web Applications',
    subtitle: 'Custom web apps and secure client portals built with intuitive dashboards, real-time data, and protected user accounts.',
    image: '/WEBAPPS.jpeg',
    webpImage: '/WEBAPPS.webp',
    href: '/what-we-create/web-applications',
  },
  {
    id: 'trading-fintech-platforms',
    slug: 'trading-fintech-platforms',
    title: 'Trading & FinTech Platforms',
    subtitle: 'Modern financial dashboards and trading platforms built with live market data, clear interactive charts, and secure transaction workflows.',
    image: '/trading.png',
    webpImage: '/trading.webp',
    href: '/what-we-create/trading-fintech-platforms',
  },
];
