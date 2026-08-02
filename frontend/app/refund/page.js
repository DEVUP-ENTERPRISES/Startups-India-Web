'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function RefundPolicy() {
  return (
    <div className="legal-page">
      <section className="hero-section" style={{ minHeight: 'auto', paddingBottom: '2rem' }}>
        <div className="container">
          <Navbar />
        </div>
      </section>

      <div className="legal-content">
        <div className="legal-container">
          <h1 className="legal-title">Refund Policy</h1>
          <p className="legal-sub">StartupsIndia Pre-Incubation Program</p>
          <p className="legal-updated">Last Updated: November 10, 2025</p>

          <div className="legal-body">
            <section className="legal-section">
              <h2>1. STRICT NO REFUND POLICY ⚠️</h2>
              <div className="refund-alert">
                <p><strong>ALL FEES ARE NON-REFUNDABLE ONCE PAYMENT IS COMPLETED.</strong></p>
              </div>
              <p>
                <strong>Program Fee:</strong> ₹25,000 (inclusive of all taxes)
              </p>
              <p>
                Once your payment is processed and enrollment is confirmed, <strong>NO REFUNDS</strong> will be provided under <strong>ANY circumstances</strong>.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. NON-REFUNDABLE SITUATIONS</h2>
              <p>Refunds will <strong>NOT</strong> be provided for:</p>
              
              <h3>Personal Reasons:</h3>
              <ul>
                <li>Change of mind</li>
                <li>Personal/family emergencies or health issues</li>
                <li>Financial difficulties</li>
                <li>Conflicting commitments (academic, professional, personal)</li>
              </ul>

              <h3>Technical Issues:</h3>
              <ul>
                <li>Internet connectivity problems</li>
                <li>Device issues or software incompatibility</li>
                <li>Power outages</li>
              </ul>

              <h3>Program-Related:</h3>
              <ul>
                <li>Dissatisfaction with content, teaching, or delivery</li>
                <li>Inability to attend live sessions (recordings provided)</li>
                <li>Mentor assignment not meeting expectations</li>
                <li>Difficulty level (too easy or too hard)</li>
              </ul>

              <h3>Outcome-Related:</h3>
              <ul>
                <li>Not selected for seed funding</li>
                <li>Not achieving expected results (funding, connections, success)</li>
                <li>Startup failure or pivot decisions</li>
                <li>Not completing the Program or assignments</li>
              </ul>

              <h3>Removal:</h3>
              <ul>
                <li>Violation of Terms and Conditions</li>
                <li>Code of Conduct violations</li>
                <li>Voluntary withdrawal</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. THE ONLY EXCEPTION</h2>
              <div className="exception-box">
                <p><strong>100% Refund ONLY if:</strong></p>
                <p>Your application is <strong>rejected by StartupsIndia BEFORE payment</strong>.</p>
              </div>
              <ul>
                <li><strong>Refund Timeline:</strong> 7-10 business days</li>
                <li><strong>Refund Method:</strong> Original payment method</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. PROGRAM CANCELLATION BY US</h2>
              <p>If StartupsIndia cancels the entire Program before start:</p>
              <p><strong>You will receive:</strong></p>
              <ul>
                <li><strong>Option A:</strong> 100% refund (15 business days)</li>
                <li><strong>Option B:</strong> Transfer to next cohort (no extra payment)</li>
                <li><strong>Option C:</strong> Program credit valid for 12 months</li>
              </ul>
              <p className="note">Individual session cancellations do NOT qualify for refunds (sessions will be rescheduled or recorded).</p>
            </section>

            <section className="legal-section">
              <h2>5. PAYMENT PLANS</h2>
              <p>If paying in installments:</p>
              <ul>
                <li>First installment (₹5,000): <strong>Non-refundable once paid</strong></li>
                <li>Second installment (₹5,000): <strong>Non-refundable once paid</strong></li>
                <li>Failure to pay second installment = removal without refund of first installment</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>6. SCHOLARSHIPS</h2>
              <ul>
                <li>Full scholarship (₹0 paid): No refund applicable</li>
                <li>Partial scholarship: Amount you paid is non-refundable</li>
                <li>Same policy applies regardless of scholarship status</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>7. CHARGEBACKS PROHIBITED</h2>
              <p><strong>You agree NOT to:</strong></p>
              <ul>
                <li>Initiate chargebacks with your bank/card company</li>
                <li>Dispute payments with payment providers</li>
                <li>Reverse transactions</li>
              </ul>
              
              <div className="warning-box">
                <p><strong>If you initiate a chargeback:</strong></p>
                <ul>
                  <li>Immediate termination of Program access</li>
                  <li>Legal action to recover amounts plus fees</li>
                  <li>Ban from all future StartupsIndia programs</li>
                </ul>
              </div>
              
              <p><strong>Dispute Resolution:</strong> Contact us first at startupsindiaofficial@gmail.com before taking any action.</p>
            </section>

            <section className="legal-section">
              <h2>8. FORCE MAJEURE</h2>
              <p>In case of unforeseen events (natural disasters, pandemics, government orders):</p>
              <ul>
                <li>We'll attempt to deliver via alternative means</li>
                <li>If 50%+ delivered: No refunds</li>
                <li>If cannot deliver at all: Full refund OR transfer to future cohort</li>
                <li>If partial delivery: Proportional refund OR completion later</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>9. REFUND PROCESSING (Where Applicable)</h2>
              <p>For the rare cases where refunds apply:</p>
              
              <h3>Timeline:</h3>
              <ul>
                <li>Refund initiated: 7-10 business days</li>
                <li>Bank processing: 5-10 business days</li>
                <li>Total: 12-20 business days</li>
              </ul>

              <h3>Method:</h3>
              <ul>
                <li>Same payment method used originally</li>
                <li>UPI: Instant to 5 days</li>
                <li>Card/Net Banking: 5-10 days</li>
              </ul>
              
              <p className="note"><strong>Note:</strong> Payment gateway charges (₹0-50) are non-refundable.</p>
            </section>

            <section className="legal-section">
              <h2>10. POLICY COMMUNICATION</h2>
              <p>You are informed of this policy at:</p>
              <ul>
                <li>✓ Program landing page (footer link)</li>
                <li>✓ Application form (checkbox required)</li>
                <li>✓ Payment page (before clicking "Pay")</li>
                <li>✓ Acceptance email (with policy link)</li>
                <li>✓ Terms & Conditions and Privacy Policy</li>
              </ul>
              
              <div className="confirmation-box">
                <p><strong>Before payment, you must confirm:</strong></p>
                <ul>
                  <li>☐ I have read the Refund Policy</li>
                  <li>☐ I understand fees are non-refundable</li>
                  <li>☐ I am making an informed decision</li>
                  <li>☐ I will not dispute charges</li>
                </ul>
              </div>
            </section>

            <section className="legal-section">
              <h2>11. FREQUENTLY ASKED QUESTIONS</h2>
              
              <div className="faq-item">
                <p><strong>Q: What if I have a medical emergency?</strong></p>
                <p>A: No refund. You retain access to recordings for 12 months to complete at your pace.</p>
              </div>

              <div className="faq-item">
                <p><strong>Q: What if I get a job and cannot attend?</strong></p>
                <p>A: No refund. Sessions are recorded for flexible viewing.</p>
              </div>

              <div className="faq-item">
                <p><strong>Q: What if I'm dissatisfied with quality?</strong></p>
                <p>A: No refund. We encourage feedback to improve.</p>
              </div>

              <div className="faq-item">
                <p><strong>Q: Can I transfer my enrollment to someone else?</strong></p>
                <p>A: No. Enrollments are non-transferable.</p>
              </div>

              <div className="faq-item">
                <p><strong>Q: Can I defer to the next cohort?</strong></p>
                <p>A: No deferrals. Must apply and pay again for future cohorts.</p>
              </div>

              <div className="faq-item">
                <p><strong>Q: What if I'm removed for Terms violation?</strong></p>
                <p>A: No refund.</p>
              </div>

              <div className="faq-item">
                <p><strong>Q: Can I get partial refund for partial attendance?</strong></p>
                <p>A: No. Refunds are not prorated.</p>
              </div>
            </section>

            <section className="legal-section">
              <h2>12. MODIFICATIONS</h2>
              <p>
                StartupsIndia may modify this policy at any time. Changes apply to future enrollments only. Your enrollment is governed by the policy version in effect when you paid.
              </p>
            </section>

            <section className="legal-section">
              <h2>13. CONTACT</h2>
              <p>For questions about this Refund Policy:</p>
              <p><strong>StartupsIndia</strong></p>
              <ul>
                <li>📧 <strong>Email:</strong> startupsindiaofficial@gmail.com</li>
                <li>📞 <strong>Phone:</strong> +91 9599033080</li>
                <li>🏢 <strong>Address:</strong> 3rd Floor, United Arcade, Pillar No. 143, Shop.No.8, Attapur, Hyderabad, Telangana 500048</li>
              </ul>
              <p><strong>Business Hours:</strong> Monday-Friday, 10 AM - 6 PM IST</p>
              <p><strong>Response Time:</strong> 3-5 business days</p>
            </section>

            <section className="legal-section">
              <h2>14. GOVERNING LAW</h2>
              <p>
                This policy is governed by the laws of India, subject to the jurisdiction of courts in Telangana.
              </p>
            </section>

            <section className="legal-section">
              <h2>15. ACKNOWLEDGMENT</h2>
              <div className="acknowledgment-box">
                <p><strong>BY ENROLLING AND PAYING, YOU CONFIRM:</strong></p>
                <ul>
                  <li>✅ I have read this Refund Policy completely</li>
                  <li>✅ I understand all fees are non-refundable after payment</li>
                  <li>✅ I understand the only exception is pre-enrollment rejection</li>
                  <li>✅ I am making a fully informed decision</li>
                  <li>✅ I will not dispute charges or initiate chargebacks</li>
                  <li>✅ I accept all terms of this policy</li>
                </ul>
                <p className="final-warning"><strong>If you do not agree, DO NOT ENROLL or PAY.</strong></p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx>{`
        .legal-page {
          background: #ffffff;
        }

        .legal-content {
          padding: 4rem 2rem;
          background: #fafafa;
        }

        .legal-container {
          max-width: 900px;
          margin: 0 auto;
          background: #ffffff;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .legal-title {
          font-size: 3rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .legal-sub {
          font-size: 1.25rem;
          color: #666666;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .legal-updated {
          font-size: 0.9375rem;
          color: #666666;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #e5e5e5;
        }

        .refund-alert {
          background: linear-gradient(135deg, #e63946 0%, #ff6b9d 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin: 1.5rem 0;
          text-align: center;
        }

        .refund-alert p {
          color: white !important;
          font-size: 1.125rem;
          margin: 0;
        }

        .exception-box,
        .confirmation-box,
        .acknowledgment-box {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .warning-box {
          background: #fff7ed;
          border-left: 4px solid #f59e0b;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .faq-item {
          background: #fafafa;
          padding: 1.25rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 3px solid #e63946;
        }

        .faq-item p {
          margin-bottom: 0.5rem;
        }

        .faq-item p:last-child {
          margin-bottom: 0;
        }

        .note {
          background: #fff3cd;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
          font-style: italic;
        }

        .final-warning {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid #3b82f6;
          font-size: 1.125rem;
          text-align: center;
        }

        .legal-body {
          color: #333333;
        }

        .legal-section {
          margin-bottom: 3rem;
        }

        .legal-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
          margin-top: 2rem;
        }

        .legal-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          margin-top: 1.5rem;
        }

        .legal-section p {
          font-size: 1rem;
          line-height: 1.8;
          color: #333333;
          margin-bottom: 1rem;
        }

        .legal-section ul,
        .legal-section ol {
          margin: 1rem 0 1rem 1.5rem;
        }

        .legal-section li {
          font-size: 1rem;
          line-height: 1.8;
          color: #333333;
          margin-bottom: 0.5rem;
        }

        .legal-section ol li {
          margin-bottom: 0.75rem;
        }

        .legal-link {
          color: #e63946;
          text-decoration: underline;
        }

        .legal-link:hover {
          color: #ff6b9d;
        }

        @media (max-width: 768px) {
          .legal-container {
            padding: 2rem 1.5rem;
          }

          .legal-title {
            font-size: 2rem;
          }

          .legal-section h2 {
            font-size: 1.5rem;
          }

          .legal-section h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </div>
  );
}
