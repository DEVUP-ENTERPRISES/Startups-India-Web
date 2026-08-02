'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function CookiePolicy() {
  return (
    <div className="legal-page">
      <section className="hero-section" style={{ minHeight: 'auto', paddingBottom: '2rem' }}>
        <div className="container">
          <Navbar />
        </div>
      </section>

      <div className="legal-content">
        <div className="legal-container">
          <h1 className="legal-title">Cookie Policy</h1>
          <p className="legal-updated">Last Updated: November 10, 2025</p>

          <div className="legal-body">
            <section className="legal-section">
              <h2>1. What Are Cookies</h2>
              <div className="alert-box">
                <p>
                  Cookies are small text files that are placed on your device when you visit our
                  website. They are widely used to make websites work more efficiently and provide
                  information to website owners. Cookies allow us to recognize your device and
                  remember information about your visit.
                </p>
              </div>
            </section>

            <section className="legal-section">
              <h2>2. How We Use Cookies</h2>
              <p>Startup India Incubation uses cookies to:</p>
              <ul>
                <li>Keep you signed in to your account</li>
                <li>Understand how you use our website</li>
                <li>Improve your experience on our platform</li>
                <li>Remember your preferences and settings</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Deliver relevant advertisements</li>
                <li>Detect and prevent fraud and security issues</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Types of Cookies We Use</h2>

              <h3>3.1 Essential Cookies</h3>
              <p>
                These cookies are necessary for the website to function properly. They enable core
                functionality such as security, network management, and accessibility. You cannot
                opt-out of these cookies.
              </p>
              <ul>
                <li>
                  <strong>Session Cookies:</strong> Temporary cookies that expire when you close
                  your browser
                </li>
                <li>
                  <strong>Authentication Cookies:</strong> Keep you logged in to your account
                </li>
                <li>
                  <strong>Security Cookies:</strong> Help detect malicious activity and violations
                </li>
              </ul>

              <h3>3.2 Performance Cookies</h3>
              <p>
                These cookies collect information about how you use our website, such as which pages
                you visit most often. This data helps us optimize our website and improve user
                experience.
              </p>
              <ul>
                <li>Google Analytics</li>
                <li>Page load times</li>
                <li>Error tracking</li>
                <li>User journey tracking</li>
              </ul>

              <h3>3.3 Functional Cookies</h3>
              <p>
                These cookies allow our website to remember choices you make (such as your username,
                language, or region) and provide enhanced, personalized features.
              </p>
              <ul>
                <li>Language preferences</li>
                <li>Regional settings</li>
                <li>Personalized content</li>
                <li>Video player settings</li>
              </ul>

              <h3>3.4 Targeting/Advertising Cookies</h3>
              <p>
                These cookies are used to deliver advertisements that are relevant to you. They also
                limit the number of times you see an ad and help measure the effectiveness of
                advertising campaigns.
              </p>
              <ul>
                <li>Google Ads</li>
                <li>Facebook Pixel</li>
                <li>LinkedIn Insights</li>
                <li>Retargeting pixels</li>
              </ul>

              <h3>3.5 Social Media Cookies</h3>
              <p>
                These cookies are set by social media services that we have added to the site to
                enable you to share our content with your friends and networks.
              </p>
              <ul>
                <li>Facebook</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Instagram</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we use various third-party cookies to report usage
                statistics, deliver advertisements, and provide enhanced functionality. These third
                parties have their own privacy policies.
              </p>

              <h3>4.1 Analytics Providers</h3>
              <ul>
                <li>
                  <strong>Google Analytics:</strong> Web analytics service that tracks and reports
                  website traffic
                </li>
                <li>
                  <strong>Hotjar:</strong> Behavior analytics and user feedback service
                </li>
              </ul>

              <h3>4.2 Advertising Partners</h3>
              <ul>
                <li>
                  <strong>Google Ads:</strong> Advertising platform for displaying ads
                </li>
                <li>
                  <strong>Facebook Ads:</strong> Social media advertising platform
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Cookie Duration</h2>
              <p>Cookies can be session-based or persistent:</p>
              <ul>
                <li>
                  <strong>Session Cookies:</strong> Deleted automatically when you close your
                  browser
                </li>
                <li>
                  <strong>Persistent Cookies:</strong> Remain on your device until they expire or
                  you delete them manually
                </li>
              </ul>
              <p>
                The duration of persistent cookies varies from a few days to several years,
                depending on their purpose.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Managing Cookies</h2>

              <h3>6.1 Browser Settings</h3>
              <p>
                Most web browsers allow you to control cookies through their settings. You can set
                your browser to refuse cookies or delete certain cookies. However, blocking all
                cookies may impact your experience on our website.
              </p>
              <p>To manage cookies in your browser:</p>
              <ul>
                <li>
                  <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site
                  data
                </li>
                <li>
                  <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                </li>
                <li>
                  <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site
                  data
                </li>
              </ul>

              {/* <h3>6.2 Opt-Out Options</h3>
              <p>You can opt-out of specific types of cookies:</p>
              <ul>
                <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="legal-link">Google Analytics Opt-out Browser Add-on</a></li>
                <li><strong>Advertising:</strong> <a href="http://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="legal-link">Your Online Choices</a></li>
                <li><strong>Network Advertising:</strong> <a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="legal-link">NAI Opt-Out</a></li>
              </ul> */}

              <h3>6.2 Mobile Devices</h3>
              <p>
                For mobile devices, you can adjust your privacy settings in your device settings:
              </p>
              <ul>
                <li>
                  <strong>iOS:</strong> Settings → Privacy → Tracking
                </li>
                <li>
                  <strong>Android:</strong> Settings → Google → Ads
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>7. Do Not Track Signals</h2>
              <p>
                Some browsers include a "Do Not Track" (DNT) feature that signals websites that you
                do not want to be tracked. Currently, there is no universal standard for how to
                respond to DNT signals. We do not currently respond to DNT signals, but we respect
                your privacy choices.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Consent</h2>
              <p>
                By using our website, you consent to our use of cookies in accordance with this
                Cookie Policy. When you first visit our website, you will see a cookie consent
                banner. You can choose to accept or reject non-essential cookies at that time.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology,
                legislation, or our business operations. We will notify you of any significant
                changes by posting the updated policy on this page and updating the "Last Updated"
                date.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. More Information</h2>
              <p>
                For more information about how we use your personal information, please see our{' '}
                <Link href="/privacy" className="legal-link">
                  Privacy Policy
                </Link>
                .
              </p>
              <p>For questions about our use of cookies, please contact us at:</p>
              <div className="alert-box">
                <ul>
                  <li>
                    <strong>Email:</strong> startupsindiaofficial@gmail.com
                  </li>
                  <li>
                    <strong>Phone:</strong> +91 9599033080
                  </li>
                  <li>
                    <strong>Address:</strong> 3rd Floor, United Arcade, Pillar No. 143, Shop.No.8,
                    Attapur, Hyderabad, Telangana 500048
                  </li>
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
