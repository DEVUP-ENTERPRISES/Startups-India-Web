import { buildMetadata } from '@/lib/seo';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://startupsindia.in';

async function getArticle(slug) {
  try {
    const res = await fetch(`${API}/api/v1/articles/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.article || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return buildMetadata({
      title: 'Article Not Found',
      description: 'The article you are looking for does not exist on Startups India.',
      noIndex: true,
    });
  }

  const categoryKeywords = {
    'Startup Funding': [
      'startup funding india', 'how to raise funds startup india', 'seed funding india',
      'angel investor india', 'venture capital india', 'startup fundraising guide',
    ],
    'Incubation': [
      'startup incubation india', 'incubator india', 'startup program india',
      'pre-incubation india', 'startup incubation guide',
    ],
    'Entrepreneurship': [
      'entrepreneur india', 'how to start business india', 'startup guide india',
      'build startup india', 'startup journey india',
    ],
    'Legal': [
      'startup legal india', 'startup registration india', 'company incorporation india',
      'startup compliance india', 'dpiit recognition',
    ],
    'Growth': [
      'startup growth india', 'startup scaling india', 'startup marketing india',
      'product market fit india', 'startup revenue india',
    ],
  };

  const baseKeywords = [
    ...(article.tags || []),
    article.category,
    `${article.category?.toLowerCase()} india`,
    `${article.title?.toLowerCase()} guide`,
    'startup india', 'startups india', 'entrepreneur india',
    ...(categoryKeywords[article.category] || []),
  ].filter(Boolean);

  return buildMetadata({
    title: article.title,
    description: article.summary || article.excerpt?.slice(0, 160) || article.title,
    path: `/source/${slug}`,
    ogImage: article.coverImage,
    keywords: baseKeywords,
    type: 'article',
    publishedTime: article.publishedAt || article.createdAt,
    modifiedTime: article.updatedAt,
    section: article.category,
    authors: article.author?.name
      ? [{ name: article.author.name, url: `${BASE}/team` }]
      : [{ name: 'Startups India Editorial', url: `${BASE}/team` }],
  });
}

export default function ArticleLayout({ children }) {
  return children;
}
