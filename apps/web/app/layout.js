/* ==========================================
   ENTERPRISE CSS LOADING ORDER
   Critical for SSR and preventing FOUC
   
   These imports are in layout.js (server component)
   so they're included in SSR output - NO FOUC!
   ========================================== */

// Next.js Font Optimization - Prevents font flicker
import { Poppins } from 'next/font/google';

// 1. Reset - Normalize browser defaults (FIRST)
import '@/styles/reset.css';

// 2. Tokens - Design system variables (SECOND)
import '@/styles/tokens.css';

// 3. Globals - Base styles, typography, layout (THIRD)
import '@/styles/globals.css';

// 4. Design System - CSS variables and utilities (FOURTH)
import '@/styles/design-system.css';

// 5. Enterprise Responsive - Global responsive framework (FIFTH)
import '@/styles/home-enterprise.css';

// 6. Layout Components - Shared across all pages (SIXTH)
import '@/styles/header.css';
import '@/styles/footer.css';

// 7. Global Responsive Overrides - Applied LAST for global responsiveness (SEVENTH)
import '@/styles/responsive-overrides.css';

// Page-specific CSS moved to their respective page/layout files for better code splitting
// This prevents CSS conflicts and improves production bundle optimization
import ClientErrorBoundary from '@/components/ClientErrorBoundary';
import ConditionalLayout from '@/components/ConditionalLayout';

import ScrollToTop from '@/components/ScrollToTop';
import CustomCursor from '@/components/CustomCursor';
import AgentationProvider from '@/components/AgentationProvider';

// Configure Poppins font - SIMPLE FIX for FOUC
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Show fallback immediately, swap when Poppins loads
  preload: true, // Critical: preload in HTML head
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
  adjustFontFallback: true, // Match metrics to prevent layout shift
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800', '900'], // All weights for consistency
});

export const metadata = {
  title: 'Startup India Incubation Platform',
  description: 'Premium code-based incubation platform for aspiring entrepreneurs',
  keywords: ['startup', 'incubation', 'learning', 'courses', 'entrepreneurship'],
  openGraph: {
    title: 'Startup India Incubation Platform',
    description: 'Premium code-based incubation platform for aspiring entrepreneurs',
    type: 'website',
  },
  icons: {
    icon: '/Startupsindia-favicon.png',
    shortcut: '/Startupsindia-favicon.png',
    apple: '/Startupsindia-favicon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <ClientErrorBoundary>
          <ConditionalLayout>{children}</ConditionalLayout>
          <CustomCursor />
          <ScrollToTop />
          <AgentationProvider />
        </ClientErrorBoundary>
      </body>
    </html>
  );
}
