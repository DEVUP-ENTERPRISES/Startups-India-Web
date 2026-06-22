// Email Templates for Startup India Incubation

export const getConfirmationEmailTemplate = (userName, confirmationLink) => {
  return {
    subject: "Welcome to Startup India Incubation - Confirm Your Email",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Email - Startup India Incubation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Brand -->
          <tr>
            <td style="background: linear-gradient(135deg, #e63946 0%, #ff6b6b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                🚀 Startup India Incubation
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">
                Empowering Entrepreneurs, Building Tomorrow
              </p>
            </td>
          </tr>
          
          <!-- Welcome Message -->
          <tr>
            <td style="padding: 40px 30px 30px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">
                Welcome Aboard, ${userName || 'Entrepreneur'}! 🎉
              </h2>
              <p style="margin: 0 0 16px 0; color: #666; font-size: 16px; line-height: 1.6;">
                We're thrilled to have you join India's premier startup incubation platform. You're one step away from accessing exclusive resources, mentorship, and funding opportunities.
              </p>
              <p style="margin: 0 0 24px 0; color: #666; font-size: 16px; line-height: 1.6;">
                To complete your registration and verify your email address, please click the button below:
              </p>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <a href="${confirmationLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #e63946 0%, #ff6b6b 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(230, 57, 70, 0.3);">
                Confirm Your Email
              </a>
              <p style="margin: 16px 0 0 0; color: #999; font-size: 13px; line-height: 1.5;">
                This link will expire in 24 hours for security reasons.
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);"></div>
            </td>
          </tr>
          
          <!-- What's Next Section -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <h3 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 18px; font-weight: 700;">
                What's Next? 🎯
              </h3>
            </td>
          </tr>
          
          <!-- Benefits List -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 18px;">💡</span>
                          </div>
                        </td>
                        <td style="vertical-align: top;">
                          <h4 style="margin: 0 0 4px 0; color: #333; font-size: 15px; font-weight: 700;">Expert Mentorship</h4>
                          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">Connect with industry leaders and successful entrepreneurs</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 18px;">💰</span>
                          </div>
                        </td>
                        <td style="vertical-align: top;">
                          <h4 style="margin: 0 0 4px 0; color: #333; font-size: 15px; font-weight: 700;">Funding Opportunities</h4>
                          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">Access to ₹50L+ investment opportunities and grants</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0;">
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="width: 40px; vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 18px;">🤝</span>
                          </div>
                        </td>
                        <td style="vertical-align: top;">
                          <h4 style="margin: 0 0 4px 0; color: #333; font-size: 15px; font-weight: 700;">Vibrant Community</h4>
                          <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">Network with 1000+ like-minded entrepreneurs</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);"></div>
            </td>
          </tr>
          
          <!-- Alternative Link -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.6;">
                If the button above doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0; word-break: break-all;">
                <a href="${confirmationLink}" style="color: #e63946; text-decoration: none; font-size: 13px;">
                  ${confirmationLink}
                </a>
              </p>
            </td>
          </tr>
          
          <!-- Help Section -->
          <tr>
            <td style="padding: 20px 30px 30px 30px; background-color: #f9f9f9;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.6;">
                <strong>Need help?</strong> We're here for you!
              </p>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                Contact our support team at <a href="mailto:support@startupindia.gov.in" style="color: #e63946; text-decoration: none;">support@startupindia.gov.in</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
              <p style="margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600;">
                Startup India Incubation
              </p>
              <p style="margin: 0 0 16px 0; color: rgba(255, 255, 255, 0.6); font-size: 12px;">
                Empowering India's Entrepreneurial Ecosystem
              </p>
              <div style="margin: 16px 0;">
                <a href="#" style="display: inline-block; margin: 0 8px; color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 12px;">Privacy Policy</a>
                <span style="color: rgba(255, 255, 255, 0.3);">•</span>
                <a href="#" style="display: inline-block; margin: 0 8px; color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 12px;">Terms of Service</a>
                <span style="color: rgba(255, 255, 255, 0.3);">•</span>
                <a href="#" style="display: inline-block; margin: 0 8px; color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 12px;">Contact Us</a>
              </div>
              <p style="margin: 16px 0 0 0; color: rgba(255, 255, 255, 0.4); font-size: 11px;">
                © 2024 Startup India Incubation. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome to Startup India Incubation!

Hi ${userName || 'Entrepreneur'},

We're thrilled to have you join India's premier startup incubation platform. You're one step away from accessing exclusive resources, mentorship, and funding opportunities.

To complete your registration and verify your email address, please click the link below:

${confirmationLink}

This link will expire in 24 hours for security reasons.

What's Next?

✓ Expert Mentorship - Connect with industry leaders and successful entrepreneurs
✓ Funding Opportunities - Access to ₹50L+ investment opportunities and grants
✓ Vibrant Community - Network with 1000+ like-minded entrepreneurs

Need help? Contact us at support@startupindia.gov.in

Best regards,
Startup India Incubation Team

---
© 2024 Startup India Incubation. All rights reserved.
    `
  };
};

export const getWelcomeEmailTemplate = (userName) => {
  return {
    subject: "🎉 Welcome to Startup India Incubation - Let's Get Started!",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome - Startup India Incubation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #e63946 0%, #ff6b6b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800;">
                🎉 Welcome Aboard!
              </h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 24px; font-weight: 700;">
                Hi ${userName || 'Entrepreneur'},
              </h2>
              <p style="margin: 0 0 16px 0; color: #666; font-size: 16px; line-height: 1.6;">
                Your email has been successfully verified! You now have full access to all the resources and opportunities on Startup India Incubation.
              </p>
              <p style="margin: 0 0 24px 0; color: #666; font-size: 16px; line-height: 1.6;">
                Start exploring your dashboard and take the first step towards building your dream venture.
              </p>
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #e63946 0%, #ff6b6b 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 700;">
                  Go to Dashboard
                </a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
              <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Startup India Incubation
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome Aboard!

Hi ${userName},

Your email has been successfully verified! You now have full access to all the resources and opportunities on Startup India Incubation.

Start exploring your dashboard and take the first step towards building your dream venture.

Visit: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Best regards,
Startup India Incubation Team
    `
  };
};

export const getEventNotificationEmailTemplate = (eventTitle, messageBody, recipientName) => {
  return {
    subject: `📢 ${eventTitle} — Important Update`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Notification - Startup India Incubation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
          
          <!-- Header with Brand -->
          <tr>
            <td style="background: linear-gradient(135deg, #e63946 0%, #ff6b6b 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                🚀 Startup India Incubation
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 500;">
                Event Update
              </p>
            </td>
          </tr>
          
          <!-- Event Title Badge -->
          <tr>
            <td style="padding: 30px 30px 10px 30px; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, rgba(230, 57, 70, 0.08) 0%, rgba(255, 107, 107, 0.08) 100%); border: 1px solid rgba(230, 57, 70, 0.15); border-radius: 12px; padding: 12px 24px;">
                <span style="font-size: 16px; font-weight: 700; color: #e63946;">📅 ${eventTitle}</span>
              </div>
            </td>
          </tr>
          
          <!-- Message Body -->
          <tr>
            <td style="padding: 20px 30px 30px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 22px; font-weight: 700;">
                Hi ${recipientName || 'there'},
              </h2>
              <div style="margin: 0 0 24px 0; color: #444; font-size: 16px; line-height: 1.7; white-space: pre-wrap;">
                ${messageBody}
              </div>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 30px;">
              <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);"></div>
            </td>
          </tr>
          
          <!-- Help Section -->
          <tr>
            <td style="padding: 20px 30px 30px 30px; background-color: #f9f9f9;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.6;">
                <strong>Need help?</strong> We're here for you!
              </p>
              <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                Contact us at <a href="mailto:admin@startupsindia.in" style="color: #e63946; text-decoration: none;">admin@startupsindia.in</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);">
              <p style="margin: 0 0 8px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600;">
                Startup India Incubation
              </p>
              <p style="margin: 0 0 16px 0; color: rgba(255, 255, 255, 0.6); font-size: 12px;">
                Empowering India's Entrepreneurial Ecosystem
              </p>
              <div style="margin: 16px 0;">
                <a href="https://www.startupsindia.in/privacy" style="display: inline-block; margin: 0 8px; color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 12px;">Privacy Policy</a>
                <span style="color: rgba(255, 255, 255, 0.3);">•</span>
                <a href="https://www.startupsindia.in/terms" style="display: inline-block; margin: 0 8px; color: rgba(255, 255, 255, 0.6); text-decoration: none; font-size: 12px;">Terms of Service</a>
              </div>
              <p style="margin: 16px 0 0 0; color: rgba(255, 255, 255, 0.4); font-size: 11px;">
                © ${new Date().getFullYear()} Startup India Incubation. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Event Update: ${eventTitle}

Hi ${recipientName || 'there'},

${messageBody}

---
Need help? Contact us at admin@startupsindia.in

© ${new Date().getFullYear()} Startup India Incubation. All rights reserved.
    `
  };
};
