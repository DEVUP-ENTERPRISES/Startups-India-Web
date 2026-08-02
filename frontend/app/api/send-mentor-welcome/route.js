import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, fullName, expertise } = await request.json();

    // Email configuration
    const emailData = {
      to: email,
      subject: 'Welcome to Startup India Incubation - Mentor Registration Received',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Mentor Registration Confirmation</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              padding: 40px 30px;
              text-align: center;
              color: #ffffff;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              margin: 10px 0 0;
              font-size: 16px;
              opacity: 0.95;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 20px;
            }
            .message {
              font-size: 15px;
              color: #4b5563;
              line-height: 1.7;
              margin-bottom: 25px;
            }
            .info-box {
              background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
              border-left: 4px solid #ef4444;
              padding: 20px;
              margin: 25px 0;
              border-radius: 8px;
            }
            .info-box h3 {
              margin: 0 0 12px;
              font-size: 16px;
              color: #dc2626;
              font-weight: 600;
            }
            .info-box p {
              margin: 0;
              font-size: 14px;
              color: #6b7280;
              line-height: 1.6;
            }
            .expertise-list {
              background: #f9fafb;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .expertise-list h4 {
              margin: 0 0 12px;
              font-size: 15px;
              color: #374151;
              font-weight: 600;
            }
            .expertise-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }
            .tag {
              display: inline-block;
              padding: 6px 12px;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              color: #ffffff;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 500;
            }
            .timeline {
              margin: 30px 0;
            }
            .timeline-item {
              display: flex;
              gap: 15px;
              margin-bottom: 20px;
            }
            .timeline-icon {
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 18px;
              flex-shrink: 0;
            }
            .timeline-content h4 {
              margin: 0 0 5px;
              font-size: 15px;
              color: #111827;
              font-weight: 600;
            }
            .timeline-content p {
              margin: 0;
              font-size: 14px;
              color: #6b7280;
            }
            .cta-button {
              display: inline-block;
              padding: 14px 32px;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              color: #ffffff;
              text-decoration: none;
              border-radius: 10px;
              font-weight: 600;
              font-size: 15px;
              margin: 25px 0;
              transition: transform 0.3s ease;
            }
            .footer {
              background: #f9fafb;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer p {
              margin: 5px 0;
              font-size: 13px;
              color: #6b7280;
            }
            .footer a {
              color: #ef4444;
              text-decoration: none;
            }
            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #e5e7eb, transparent);
              margin: 30px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Our Mentor Community!</h1>
              <p>Your registration has been successfully received</p>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hello ${fullName},
              </div>
              
              <div class="message">
                Thank you for your interest in becoming a mentor at <strong>Startup India Incubation</strong>! 
                We are thrilled to have experienced professionals like you join our mission to nurture the next 
                generation of entrepreneurs.
              </div>
              
              <div class="info-box">
                <h3>📧 Registration Confirmed</h3>
                <p>
                  We have successfully received your mentor profile for <strong>${email}</strong>. 
                  Your application is now under review by our team.
                </p>
              </div>
              
              ${expertise && expertise.length > 0 ? `
              <div class="expertise-list">
                <h4>Your Areas of Expertise:</h4>
                <div class="expertise-tags">
                  ${expertise.map(skill => `<span class="tag">${skill}</span>`).join('')}
                </div>
              </div>
              ` : ''}
              
              <div class="divider"></div>
              
              <div class="timeline">
                <h3 style="margin: 0 0 20px; font-size: 18px; color: #111827;">What Happens Next?</h3>
                
                <div class="timeline-item">
                  <div class="timeline-icon">1</div>
                  <div class="timeline-content">
                    <h4>Profile Review</h4>
                    <p>Our team will carefully review your profile and expertise within 24-48 hours.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon">2</div>
                  <div class="timeline-content">
                    <h4>Approval Notification</h4>
                    <p>You'll receive an email notification once your profile is approved.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon">3</div>
                  <div class="timeline-content">
                    <h4>Dashboard Access</h4>
                    <p>Access your mentor dashboard to connect with startups and manage sessions.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-icon">4</div>
                  <div class="timeline-content">
                    <h4>Start Mentoring</h4>
                    <p>Begin your journey of guiding and empowering innovative startups!</p>
                  </div>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <div class="message">
                <strong>Important:</strong> Please keep an eye on your inbox (including spam/junk folders) 
                for updates regarding your application status. If you have any questions in the meantime, 
                feel free to reach out to us.
              </div>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/mentor/dashboard" class="cta-button">
                  View Dashboard
                </a>
              </center>
            </div>
            
            <div class="footer">
              <p><strong>Startup India Incubation</strong></p>
              <p>Empowering Innovation, Building Tomorrow</p>
              <p style="margin-top: 15px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">Visit Website</a> | 
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/contact">Contact Support</a>
              </p>
              <p style="margin-top: 15px; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // For development: Log email instead of sending
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 MENTOR WELCOME EMAIL (Development Mode)');
      console.log('To:', emailData.to);
      console.log('Subject:', emailData.subject);
      console.log('---');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email logged in development mode',
        emailPreview: {
          to: emailData.to,
          subject: emailData.subject
        }
      });
    }

    // Production: Send actual email using your email service
    // Example with Resend (you can use SendGrid, AWS SES, etc.)
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Startup India Incubation <noreply@startupindia.com>',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Welcome email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
