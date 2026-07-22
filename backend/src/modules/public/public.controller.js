const { Lead } = require('../../models/Lead');
const { sendEmail } = require('../../utils/emailService');
const { wrap, pill, hr } = require('../../utils/emailTemplates');
const { logger } = require('../../infrastructure/observability/logger');

async function createInquiry(req, res) {
  const { name, email, phone, company, program, message } = req.body;

  try {
    // 1. Save to database as a Lead
    const lead = await Lead.create({
      name,
      email,
      phone,
      interest: program,
      notes: `Company: ${company}\nMessage: ${message}`,
      source: 'website',
      status: 'new'
    });

    // 2. Send email to Admin
    const adminEmail = 'admin@startupsindia.in';
    const adminInner = `
      <tr>
        <td style="padding:36px 32px 28px;">
          ${pill('New Application')}
          <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:28px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
            Application Received
          </h1>
          <p style="margin:0 0 28px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            A new entrepreneur has applied to join the Startups India Ecosystem.
          </p>
          <table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:14px; color:#333;">
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Name:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${name}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${email}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Phone:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${phone}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Company:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${company || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Program:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${program || 'General Inquiry'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Message:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0; white-space:pre-wrap;">${message || 'No message provided'}</td></tr>
          </table>
        </td>
      </tr>
      ${hr()}
    `;
    await sendEmail({
      to: adminEmail,
      subject: `🚀 New Ecosystem Application: ${name}`,
      html: wrap('New entrepreneur has applied.', 'New Application', adminInner)
    });

    // 3. Send confirmation email to the User (Optional but good practice)
    const userInner = `
      <tr>
        <td style="padding:36px 32px 28px;">
          ${pill('Application Received')}
          <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:32px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
            Hello ${name}!
          </h1>
          <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Thank you for applying to join the Startups India Ecosystem.
          </p>
          <p style="margin:0 0 28px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Your application is currently being reviewed by our strategic board. We are excited about the possibility of working with you and building something big together.
          </p>
          <div style="background:#fafafa; padding:20px; border-radius:8px; border-left:4px solid #e63946;">
            <p style="margin:0 0 8px; font-family:sans-serif; font-size:14px; font-weight:bold; color:#1a1a1a;">What's Next?</p>
            <p style="margin:0; font-family:sans-serif; font-size:14px; color:#555; line-height:1.6;">Our team will review your details and connect with you within <b>24 hours</b> to discuss the next steps.</p>
          </div>
        </td>
      </tr>
      ${hr()}
    `;
    await sendEmail({
      to: email,
      subject: 'Application Received - Startups India',
      html: wrap('Your application has been received.', 'Application Received', userInner)
    });

    res.status(201).json({ 
      success: true, 
      message: 'Application received successfully' 
    });
  } catch (error) {
    logger.error('Error processing inquiry', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while processing application' 
    });
  }
}

module.exports = {
  createInquiry
};
