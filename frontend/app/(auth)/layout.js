/* ==========================================
   AUTH LAYOUT - Simplified
   
   CSS is now loaded in individual page components
   This ensures consistent loading on client-side navigation
   ========================================== */

export const metadata = {
  title: 'Authentication - Startup India Incubation',
  description: 'Sign in or sign up to access the Startup India Incubation Platform',
};

export default function AuthLayout({ children }) {
  return <>{children}</>;
  // The actual layout and styling is handled in the individual auth page components (e.g. login/page.js, signup/page.js)
}
