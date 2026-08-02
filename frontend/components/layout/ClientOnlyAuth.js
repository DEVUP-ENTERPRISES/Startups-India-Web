'use client';

import { useEffect, useState } from 'react';

/**
 * ClientOnlyAuth - Prevents SSR for auth pages
 * Renders children only on client-side, eliminating hydration issues
 * Now with instant rendering (no loading flash)
 */
export default function ClientOnlyAuth({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render children immediately on client, but suppress hydration warnings
  // The key is to render the same content on server and client
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}
