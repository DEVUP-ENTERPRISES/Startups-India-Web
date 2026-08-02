'use client';

import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function TermsOfService() {
  return (
    <div className="legal-page">
      <section className="hero-section" style={{ minHeight: 'auto', paddingBottom: '2rem' }}>
        <div className="container">
          <Navbar />
        </div>
      </section>

      <div className="legal-content">
        <div className="legal-container">
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-updated">Last Updated: November 10, 2025</p>

          <div className="legal-body">
            <section className="legal-section">
              <h2>1. Acceptance of Terms</h2>
              <div className="warning-box">
                <p>
                  By accessing and using the Startup India Incubation platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                </p>
              </div>
            </section>

            <section className="legal-section">
              <h2>2. Description of Service</h2>
              <p>
                Startup India Incubation provides an incubation platform for startups, offering mentorship, resources, funding opportunities, and networking services. We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Eligibility</h2>
              <p>You must meet the following criteria to use our Service:</p>
              <ul>
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited from using our Service under applicable laws</li>
                <li>Provide accurate and complete registration information</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. User Accounts</h2>
              <h3>4.1 Account Creation</h3>
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Immediately notify us of any unauthorized use</li>
              </ul>

              <h3>4.2 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. Incubation Program Terms</h2>
              <h3>5.1 Application Process</h3>
              <p>
                Acceptance into our incubation programs is at our sole discretion. We do not guarantee acceptance to any applicant.
              </p>

              <h3>5.2 Program Participation</h3>
              <p>If accepted into a program, you agree to:</p>
              <ul>
                <li>Actively participate in all required activities</li>
                <li>Attend scheduled mentoring sessions</li>
                <li>Complete assigned tasks and milestones</li>
                <li>Provide regular updates on your progress</li>
                <li>Maintain professional conduct with mentors and peers</li>
              </ul>

              <h3>5.3 Equity and Funding</h3>
              <p>
                Any equity arrangements, funding, or investment terms will be governed by separate agreements. These Terms do not constitute any financial commitment or guarantee of funding.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Intellectual Property Rights</h2>
              <h3>6.1 Our Content</h3>
              <p>
                All content on our platform, including text, graphics, logos, images, and software, is the property of Startup India Incubation or our licensors and is protected by copyright and other intellectual property laws.
              </p>

              <h3>6.2 Your Content</h3>
              <p>
                You retain ownership of content you submit to our platform. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content in connection with providing our Service.
              </p>

              <h3>6.3 Your Startup IP</h3>
              <p>
                You retain all rights to your startup's intellectual property. We do not claim any ownership rights to your business ideas, products, or services.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Prohibited Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Collect user information without consent</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>8. Payment Terms</h2>
              <p>
                Some aspects of our Service may require payment. You agree to provide accurate payment information and authorize us to charge your payment method for applicable fees. All fees are non-refundable unless otherwise stated.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Disclaimers</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE DO NOT GUARANTEE ANY SPECIFIC RESULTS FROM USING OUR SERVICE.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, STARTUP INDIA INCUBATION SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section className="legal-section">
              <h2>11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Startup India Incubation and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising out of your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>12. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms or the Service shall be resolved through binding arbitration in accordance with Indian law.
              </p>
            </section>

            <section className="legal-section">
              <h2>13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>14. Termination</h2>
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>15. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <div className="alert-box">
                <ul>
                  <li><strong>Email:</strong> startupsindiaofficial@gmail.com</li>
                  <li><strong>Phone:</strong> +91 9599033080</li>
                  <li><strong>Address:</strong> 3rd Floor, United Arcade, Pillar No. 143, Shop.No.8, Attapur, Hyderabad, Telangana 500048</li>
                </ul>
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

        .legal-updated {
          font-size: 0.9375rem;
          color: #666666;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #e5e5e5;
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

        .legal-section strong {
          color: #1a1a1a;
          font-weight: 600;
        }

        .legal-link {
          color: #e63946;
          text-decoration: underline;
          transition: color 0.3s ease;
        }

        .legal-link:hover {
          color: #ff6b9d;
        }

        .note {
          background: #fff3cd;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
          font-style: italic;
        }

        .alert-box {
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

        @media (max-width: 768px) {
          .legal-content {
            padding: 2rem 1rem;
          }

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
