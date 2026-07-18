'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { DashboardProvider } from '@/contexts/DashboardProvider';
import { getCurrentUser } from '@/lib/auth';

// FCM push toasts. ssr:false because it touches the browser's notification API;
// this moved here from layout.js when the client logic was split out.
const PushToast = dynamic(() => import('@/components/PushToast'), { ssr: false });



export default function DashboardLayoutClient({ children }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Read from sessionStorage strictly after mount to avoid hydration mismatch
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('auth_user');
      if (cached) {
        setUser(JSON.parse(cached));
        setAuthLoading(false);
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data, error } = await getCurrentUser();
        if (error || !data?.user) {
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('auth_user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
          setUser(null);
          router.replace('/login');
          return;
        }
        setUser(data.user);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('auth_user', JSON.stringify(data.user));
        }
      } catch (err) {
        // Network or unexpected error — redirect to login so the user is never stuck
        console.error('[Auth] checkAuth failed:', err);
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('auth_user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        setUser(null);
        router.replace('/login');
      } finally {
        // Always clear the loading state so we never show a blank screen forever
        setAuthLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  // Redirect mentors and investors to their role-specific dashboard.
  useEffect(() => {
    if (!user) return;
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path !== '/dashboard') return;
    if (user.role === 'mentor') router.replace('/dashboard/mentor');
    else if (user.role === 'investor') router.replace('/dashboard/investor');
  }, [user, router]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isMobileMenuOpen]);

  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              border: '4px solid #f1f5f9',
              borderTop: '4px solid #7A1F2B',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // If redirect to /login is in progress (user is null after loading), show spinner
  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            border: '4px solid #f1f5f9',
            borderTop: '4px solid #7A1F2B',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <DashboardProvider authUser={user}>
      <div className="dashboard-layout">
        {/* Fixed Sidebar */}
        <DashboardSidebar 
          user={user} 
          isPro={false} 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="dashboard-main">
          {/* Global Header */}
          <DashboardHeader 
            user={user} 
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)} 
          />

          {/* Dynamic Content */}
          <div className="dashboard-content">
            {children}
          </div>
        </div>
      </div>
      <PushToast />
    </DashboardProvider>
  );
}
