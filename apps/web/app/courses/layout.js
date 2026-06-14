import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Startup & Entrepreneurship Courses in India 2026 — Learn Online',
  description:
    "Explore India's best startup and entrepreneurship online courses. Learn startup building, fundraising, product development, digital marketing, business strategy, and more from expert founders and industry leaders. Free and paid courses for all levels.",
  path: '/courses',
  section: 'Courses',
  keywords: [
    'startup courses india', 'entrepreneurship courses online india',
    'startup learning india', 'online courses for entrepreneurs india',
    'startup training programs india', 'free startup courses india',
    'best online courses for startup founders', 'learn startup building india',
    'startup business course india', 'how to build startup course india',
    'startup fundamentals course', 'fundraising course india',
    'product management course startup india', 'startup marketing course india',
    'startup finance course india', 'startup legal course india',
    'entrepreneurship certification india', 'startup certificate course india',
    'online entrepreneurship course india', 'iit startup course',
    'startup course for students india', 'startup course for professionals india',
    'startup course for women india', 'venture capital course india',
    'angel investing course india', 'startup scaling course india',
    'digital entrepreneurship course india', 'business model design course',
    'lean startup course india', 'startup validation course india',
    'startup pitching course india', 'startup growth course india',
    'zero to one startup course', 'startup india free course',
  ],
});

export default function CoursesLayout({ children }) {
  return children;
}
