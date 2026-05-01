'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
          }}
        >
          <div className="loader-spin" />
          <style jsx>{`
            .loader-spin { width: 40px; height: 40px; border: 3px solid #f1f5f9; border-top-color: #7A1F2B; border-radius: 50%; animation: spin 0.8s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get('courseId');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    apiGet(`/api/v1/courses/${courseId}`).then(res => {
      setCourse(res.data);
      setLoading(false);
    });
  }, [courseId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  async function handlePay() {
    if (!course) return;
    setProcessing(true);
    setError('');

    try {
      const orderRes = await apiPost('/api/v1/payments/razorpay/order', {
        courseId: course._id,
        amount: course.priceInr || course.price,
      });

      if (orderRes.error) {
        setError(orderRes.error.message);
        setProcessing(false);
        return;
      }

      const orderData = orderRes.data?.order || orderRes.data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id || 'rzp_test_placeholder',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Founder Velocity',
        description: `Enrollment: ${course.title}`,
        order_id: orderData.id || orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await apiPost('/api/v1/payments/razorpay/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyRes.error) {
              setError('Payment verification failed. Please contact support.');
              setProcessing(false);
            } else {
              router.push(`/dashboard/learning/continue`);
            }
          } catch (err) {
            setError('An unexpected error occurred during verification.');
            setProcessing(false);
          }
        },
        modal: { ondismiss: () => setProcessing(false) },
        theme: { color: '#7A1F2B' },
      };

      if (window.Razorpay) {
        new window.Razorpay(options).open();
      } else {
        setError('Payment gateway is still loading...');
        setProcessing(false);
      }
    } catch (err) {
      setError('Could not initiate payment.');
      setProcessing(false);
    }
  }

  if (loading) return <div className="checkout-loader"><div className="loader-spin" /></div>;

  if (!courseId || !course) {
    return (
      <div className="checkout-empty">
        <div className="empty-card">
          <h1>No Course Selected</h1>
          <p>Please browse our catalog to find a program that fits your goals.</p>
          <Link href="/dashboard/explore" className="btn-primary">Browse Catalog</Link>
        </div>
        <style jsx>{`
          .checkout-empty { height: 100vh; display: flex; align-items: center; justify-content: center; background: #fafafa; }
          .empty-card { text-align: center; background: #fff; padding: 4rem; border-radius: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
          .btn-primary { display: inline-block; margin-top: 2rem; padding: 1rem 2.5rem; background: #7A1F2B; color: #fff; border-radius: 12px; font-weight: 700; text-decoration: none; }
        `}</style>
      </div>
    );
  }

  const price = course.priceInr || course.price || 0;

  return (
    <div className="checkout-container">
      <div className="checkout-inner">
        
        {/* Header Navigation */}
        <div className="checkout-header">
          <Link href="/dashboard/explore" className="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            Back to Explore
          </Link>
          <div className="step-indicator">
            <span className="step active">1. Details</span>
            <div className="step-divider" />
            <span className="step">2. Learning</span>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Program Info */}
          <div className="checkout-main">
            <div className="checkout-card glass">
              <h1 className="title">Enrollment Details</h1>
              
              <div className="program-preview">
                <div className="thumb-wrap">
                  {course.thumbnailUrl && <img src={course.thumbnailUrl} alt={course.title} />}
                </div>
                <div className="details">
                  <span className="category-tag">{course.category || 'Startup Program'}</span>
                  <h3>{course.title}</h3>
                  <div className="meta-row">
                    <span>{course.durationWeeks || 8} Weeks</span>
                    <span className="dot">•</span>
                    <span>Lifetime Access</span>
                  </div>
                </div>
              </div>

              <div className="benefits-section">
                <h4>What you&apos;ll get:</h4>
                <div className="benefits-grid">
                  {[
                    'Full Curriculum Access',
                    'Verified Certificate',
                    'Mentor Office Hours',
                    'Private Tribe Community',
                    'Startup Toolkits',
                    'Networking Access'
                  ].map((b, i) => (
                    <div key={i} className="benefit-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A1F2B" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="trust-badges">
              <div className="trust-item">
                <div className="trust-icon">🛡️</div>
                <div>
                  <h6>Secure Checkout</h6>
                  <p>256-bit SSL encrypted payment</p>
                </div>
              </div>
              <div className="trust-item">
                <div className="trust-icon">✨</div>
                <div>
                  <h6>7-Day Guarantee</h6>
                  <p>100% money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Sidebar */}
          <aside className="checkout-sidebar">
            <div className="summary-card">
              <h2>Order Summary</h2>
              
              <div className="summary-rows">
                <div className="row">
                  <span>Program Fee</span>
                  <span>₹{price.toLocaleString()}</span>
                </div>
                <div className="row">
                  <span>Platform Access</span>
                  <span className="free">FREE</span>
                </div>
                <div className="row">
                  <span>GST (Inclusive)</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="total-row">
                <span>Total Amount</span>
                <span className="amount">₹{price.toLocaleString()}</span>
              </div>

              {error && <div className="error-box">{error}</div>}

              <button 
                onClick={handlePay} 
                disabled={processing}
                className={`btn-pay ${processing ? 'loading' : ''}`}
              >
                {processing ? 'Processing...' : `Secure Payment • ₹${price.toLocaleString()}`}
              </button>

              <div className="secure-logos">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Razorpay_logo.svg" alt="Razorpay" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" />
              </div>

              <p className="legal-text">
                By enrolling, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        .checkout-container {
          min-height: 100vh;
          background: radial-gradient(circle at top right, #fff5f5 0%, #ffffff 50%, #fdf8f0 100%);
          padding: 3rem 1.5rem;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .checkout-container::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(122,31,43,0.03) 0%, transparent 70%);
          z-index: 0;
        }
        .checkout-inner {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .checkout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #7A1F2B;
          font-weight: 700;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s;
          padding: 8px 16px;
          background: rgba(122,31,43,0.05);
          border-radius: 12px;
        }
        .back-link:hover { background: rgba(122,31,43,0.1); transform: translateX(-4px); }
        
        .step-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          padding: 8px 20px;
          border-radius: 99px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
        }
        .step { font-size: 0.75rem; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; }
        .step.active { color: #7A1F2B; }
        .step-divider { width: 30px; height: 2px; background: #f1f5f9; border-radius: 1px; }

        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 2.5rem;
          align-items: start;
        }

        .checkout-card {
          background: #fff;
          border-radius: 32px;
          padding: 2.5rem;
          border: 1.5px solid #f0e8e9;
          box-shadow: 0 10px 40px rgba(122,31,43,0.03);
          position: relative;
        }
        .glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); }
        
        .title { font-size: 2.25rem; font-weight: 900; color: #111827; margin-bottom: 2rem; letter-spacing: -0.04em; }
        
        .program-preview {
          display: flex;
          gap: 1.5rem;
          background: linear-gradient(135deg, #fdf5f6 0%, #fff 100%);
          padding: 1.5rem;
          border-radius: 24px;
          border: 1.5px solid #f0e8e9;
          margin-bottom: 2.5rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .thumb-wrap {
          width: 120px;
          height: 120px;
          border-radius: 18px;
          overflow: hidden;
          background: #e2e8f0;
          flex-shrink: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          border: 2px solid #fff;
        }
        .thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
        
        .details { display: flex; flex-direction: column; justify-content: center; }
        .details h3 { font-size: 1.4rem; font-weight: 900; color: #111827; margin: 6px 0 10px; line-height: 1.2; letter-spacing: -0.02em; }
        .category-tag { 
          font-size: 0.65rem; 
          font-weight: 900; 
          color: #fff; 
          background: #C5975B; 
          padding: 4px 12px; 
          border-radius: 8px; 
          display: inline-block;
          width: fit-content;
          letter-spacing: 0.05em; 
        }
        .meta-row { font-size: 0.9rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 8px; }
        .dot { color: #C5975B; font-weight: 900; }

        .benefits-section {
          background: #fafafa;
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid #f1f5f9;
          margin-top: 2rem;
        }
        .benefits-section h4 { font-size: 1.1rem; font-weight: 900; color: #111827; margin-bottom: 1.5rem; }
        .benefits-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .benefit-item { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: #334155; font-weight: 600; }

        .trust-badges { display: flex; gap: 2.5rem; margin-top: 2.5rem; padding: 0 0.5rem; }
        .trust-item { display: flex; gap: 14px; align-items: center; }
        .trust-icon { 
          width: 44px; 
          height: 44px; 
          background: #fff; 
          border-radius: 14px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 1.5rem; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid #f1f5f9;
        }
        .trust-item h6 { font-size: 0.9rem; font-weight: 900; color: #111827; margin: 0; }
        .trust-item p { font-size: 0.75rem; color: #64748b; margin: 2px 0 0; font-weight: 500; }

        .summary-card {
          background: #fff;
          border-radius: 32px;
          padding: 2.5rem;
          border: 1.5px solid #f0e8e9;
          box-shadow: 0 25px 50px -12px rgba(122,31,43,0.08);
          position: sticky;
          top: 2rem;
        }
        .summary-card h2 { font-size: 1.4rem; font-weight: 900; color: #111827; margin-bottom: 2rem; letter-spacing: -0.02em; }
        
        .summary-rows { display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem; }
        .row { display: flex; justify-content: space-between; font-size: 0.95rem; color: #64748b; font-weight: 600; }
        .row .free { color: #059669; font-weight: 900; background: #ecfdf5; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.75rem;
          border-top: 2px dashed #f1f5f9;
          margin-bottom: 2.5rem;
        }
        .total-row span { font-size: 1.1rem; font-weight: 900; color: #111827; }
        .total-row .amount { font-size: 2.25rem; font-weight: 900; color: #7A1F2B; letter-spacing: -0.05em; }

        .error-box { background: #fef2f2; color: #dc2626; padding: 1.25rem; border-radius: 16px; font-size: 0.85rem; font-weight: 700; margin-bottom: 1.5rem; border: 1.5px solid #fee2e2; }

        .btn-pay {
          width: 100%;
          padding: 1.4rem;
          background: linear-gradient(135deg, #7A1F2B 0%, #922538 100%);
          color: #fff;
          border: none;
          border-radius: 20px;
          font-size: 1.1rem;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 12px 25px -5px rgba(122,31,43,0.3);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .btn-pay:hover { background: #9b3040; transform: translateY(-4px); box-shadow: 0 20px 30px -5px rgba(122,31,43,0.4); }
        .btn-pay:active { transform: translateY(-1px); }
        .btn-pay.loading { opacity: 0.7; cursor: not-allowed; transform: none; }

        .secure-logos { display: flex; justify-content: center; gap: 2rem; margin-top: 2rem; opacity: 0.4; filter: grayscale(1); transition: opacity 0.3s; }
        .secure-logos:hover { opacity: 0.8; filter: grayscale(0); }
        .secure-logos img { height: 20px; }
        
        .legal-text { font-size: 0.75rem; color: #94a3b8; text-align: center; margin-top: 2rem; line-height: 1.6; font-weight: 500; }
        .legal-text a { color: #7A1F2B; font-weight: 700; text-decoration: none; }
        .legal-text a:hover { text-decoration: underline; }

        .checkout-loader { height: 100vh; display: flex; align-items: center; justify-content: center; background: #fff; }
        .loader-spin { width: 48px; height: 48px; border: 4px solid #f1f5f9; border-top-color: #7A1F2B; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1000px) {
          .checkout-grid { grid-template-columns: 1fr; }
          .summary-card { position: static; margin-top: 2rem; }
        }
        @media (max-width: 600px) {
          .checkout-header { flex-direction: column; gap: 1.5rem; align-items: flex-start; }
          .benefits-grid { grid-template-columns: 1fr; }
          .trust-badges { flex-direction: column; gap: 1.5rem; }
          .title { font-size: 1.75rem; }
          .program-preview { flex-direction: column; }
          .thumb-wrap { width: 100%; height: 160px; }
        }
      `}</style>
    </div>
  );
}
