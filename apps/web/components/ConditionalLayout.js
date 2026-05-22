'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { MAINTENANCE_MODE } from '@/config/maintenance';

// Admin slug used in browser URL (middleware rewrites to /admin internally)
const ADMIN_SLUG = process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel';

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // ⚠️ MAINTENANCE MODE - Hide navbar and footer completely
  if (MAINTENANCE_MODE) {
    return <>{children}</>;
  }
  
  // Pages that should NOT have Header/Footer
  const authPages = ['/login', '/signup', '/signin'];
  const isAuthPage = authPages.includes(pathname);
  
  // Dashboard pages should NOT have Header/Footer
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  // Course detail pages should NOT have Header/Footer (they have their own navigation)
  const isCourseDetailPage = pathname?.startsWith('/courses/') && pathname !== '/courses';
  
  // Learn pages should NOT have Header/Footer
  const isLearnPage = pathname?.startsWith('/learn');
  
  // Checkout page should NOT have Header/Footer
  const isCheckoutPage = pathname?.startsWith('/checkout');
  
  // Mentor DASHBOARD should NOT have Header/Footer (but /mentors page should have it)
  const isMentorDashboard = pathname?.startsWith('/mentor/dashboard');
  
  // Admin pages should NOT have Header/Footer (completely standalone)
  // Check both rewritten path (/admin) AND slug-based browser URL (/{ADMIN_SLUG})
  const isAdminPage = pathname?.startsWith('/admin') || pathname?.startsWith(`/${ADMIN_SLUG}`);
  
  // If it's an auth page, dashboard page, course detail, learn, checkout, mentor dashboard, or admin page, render without Header/Footer
  if (isAuthPage || isDashboardPage || isCourseDetailPage || isLearnPage || isCheckoutPage || isMentorDashboard || isAdminPage) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
