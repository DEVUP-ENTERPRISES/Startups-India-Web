export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://startupsindia.in';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/checkout/',
          '/*?sort=',
          '/*?filter=',
          '/search?',
        ],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Googlebot-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
