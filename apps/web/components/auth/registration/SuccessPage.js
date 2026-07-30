'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Clock, ArrowRight, Home, Mail, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPage({ role, requiresApproval, returnUrl }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);

  // All roles except Student require higher authority review & admin approval before login
  const isPending = requiresApproval || (role || '').toLowerCase() !== 'student';

  const getRoleDashboard = (r) => {
    switch ((r || '').toLowerCase()) {
      case 'student': return '/dashboard?role=student';
      default: return '/dashboard';
    }
  };

  const dashboardUrl = returnUrl && returnUrl !== '/dashboard' ? returnUrl : getRoleDashboard(role);

  // Auto redirect timer for pending applications
  useEffect(() => {
    if (!isPending) {
      const timer = setTimeout(() => {
        router.push(dashboardUrl);
      }, 2500);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [router, dashboardUrl, isPending]);

  // Navigate to home page when countdown reaches 0 for pending applications
  useEffect(() => {
    if (isPending && countdown === 0) {
      router.push('/');
    }
  }, [isPending, countdown, router]);

  if (isPending) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="reg-v2-otp-container"
        style={{ textAlign: 'center', paddingTop: '30px', paddingBottom: '30px' }}
      >
        {/* Animated Clock / Review Badge */}
        <div 
          style={{ 
            width: '84px', height: '84px', borderRadius: '50%', background: '#fffbe8', 
            color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px auto', border: '2px solid #fde68a',
            boxShadow: '0 4px 16px rgba(217, 119, 6, 0.15)'
          }}
        >
          <Clock size={48} />
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          Registration Submitted <span style={{ color: '#dc2626' }}>Under Review</span> ⏳
        </h2>

        <p style={{ fontSize: '15px', color: '#334155', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
          Thank you for registering as a <strong style={{ color: '#dc2626', textTransform: 'capitalize' }}>{role}</strong>! <br />
          <strong style={{ color: '#0f172a' }}>Our higher authorities will review your details and give you permission to login.</strong>
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 22px', maxWidth: '480px', margin: '0 auto 24px auto', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
            <ShieldAlert size={18} color="#dc2626" /> Higher Authority Approval Required
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            Our admin team will review your application details. Once approved, you will receive authorization and your official login credentials via email. Direct login is disabled until permission is granted.
          </p>
        </div>

        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          Redirecting to Startups India Home Page in <strong style={{ color: '#dc2626' }}>{countdown}s</strong>...
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            className="reg-v2-btn-continue"
            style={{ 
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
              padding: '14px 28px', 
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
            }}
            onClick={() => router.push('/')}
          >
            <Home size={18} /> Go to Home Page
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="reg-v2-otp-container"
      style={{ textAlign: 'center', paddingTop: '30px', paddingBottom: '30px' }}
    >
      <div 
        style={{ 
          width: '84px', height: '84px', borderRadius: '50%', background: '#dcfce7', 
          color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px auto', border: '2px solid #bbf7d0',
          boxShadow: '0 4px 16px rgba(22, 163, 74, 0.15)'
        }}
      >
        <CheckCircle2 size={50} />
      </div>

      <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
        Registration <span style={{ color: '#dc2626' }}>Complete!</span> 🎉
      </h2>

      <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '420px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
        Your account and profile have been activated! Redirecting you directly to your Student Dashboard...
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          className="reg-v2-btn-continue"
          onClick={() => router.push(dashboardUrl)}
        >
          Go to Dashboard <ArrowRight size={16} />
        </button>
        <button
          className="reg-v2-btn-back"
          onClick={() => router.push('/')}
        >
          <Home size={16} /> Home Page
        </button>
      </div>
    </motion.div>
  );
}
