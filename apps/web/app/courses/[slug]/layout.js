import { buildMetadata } from '@/lib/seo';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

async function getCourse(slug) {
  try {
    const res = await fetch(`${API}/api/v1/courses/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.course || json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) {
    return buildMetadata({ title: 'Course Not Found', noIndex: true });
  }

  return buildMetadata({
    title: course.title,
    description: course.shortDescription || course.description?.slice(0, 155),
    path: `/courses/${slug}`,
    ogImage: course.thumbnailUrl,
    keywords: [course.category, 'startup course india', 'online course entrepreneurship'],
    type: 'website',
  });
}

export default function CourseLayout({ children }) {
  return children;
}
