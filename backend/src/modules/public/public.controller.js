const { Lead } = require('../../models/Lead');
const { sendEmail } = require('../../utils/emailService');
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
    await sendEmail({
      to: adminEmail,
      subject: `🚀 New Ecosystem Application: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #dc2626;">New Application Received</h2>
          <p>A new entrepreneur has applied to join the Startups India Ecosystem.</p>
          <hr />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Company:</td><td>${company || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Program:</td><td>${program || 'General Inquiry'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Message:</td><td>${message || 'No message provided'}</td></tr>
          </table>
          <hr />
          <p style="font-size: 12px; color: #666;">This is an automated notification from the Startups India Platform.</p>
        </div>
      `
    });

    // 3. Send confirmation email to the User (Optional but good practice)
    await sendEmail({
      to: email,
      subject: 'Application Received - Startups India',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Hello ${name}!</h1>
          <p>Thank you for applying to join the Startups India Ecosystem.</p>
          <p>Your application is currently being reviewed by our strategic board. We are excited about the possibility of working with you and building something big together.</p>
          <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #333;">What's Next?</p>
            <p style="margin: 5px 0 0 0; color: #666;">Our team will review your details and connect with you within <b>24 hours</b> to discuss the next steps.</p>
          </div>
          <p>Best Regards,<br /><b>Team Startups India</b></p>
        </div>
      `
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
