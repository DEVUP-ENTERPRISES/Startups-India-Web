const { InvestorRequest } = require('../../models/InvestorRequest');
const { ExploreInvestorRequest } = require('../../models/ExploreInvestorRequest');
const { sendEmail } = require('../../utils/emailService');

exports.submitRequest = async (req, res) => {
  const { 
    full_name, organization_name, investor_type, email, phone, 
    linkedin_url, website_url, investment_focus, preferred_stages, 
    ticket_size, bio, location, years_of_experience 
  } = req.body;
  const userId = req.user.userId;

  try {
    const request = new InvestorRequest({
      user: userId,
      full_name, organization_name, investor_type, email, phone, 
      linkedin_url, website_url, investment_focus, preferred_stages, 
      ticket_size, bio, location, years_of_experience
    });

    await request.save();

    const emailHtml = `
      <h2>New Investor Registration Request</h2>
      <p><strong>Name:</strong> ${full_name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Type:</strong> ${investor_type}</p>
      <p><strong>Organization:</strong> ${organization_name || 'N/A'}</p>
      <p><strong>Ticket Size:</strong> ${ticket_size || 'N/A'}</p>
      <p><strong>Focus Areas:</strong> ${investment_focus?.join(', ') || 'N/A'}</p>
      <p><strong>Stages:</strong> ${preferred_stages?.join(', ') || 'N/A'}</p>
      <p>Please review this application in the Admin Dashboard or via the database.</p>
    `;

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Investor Registration Received',
      html: emailHtml
    });

    res.status(201).json({ success: true, message: 'Investor request submitted successfully' });
  } catch (error) {
    console.error('Submit investor request error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit investor request' });
  }
};

exports.exploreRequest = async (req, res) => {
  const { name, email, phone, startup_name, sector, funding_amount, pitch } = req.body;
  const userId = req.user.userId;

  try {
    const request = new ExploreInvestorRequest({
      user: userId, name, email, phone, startup_name, sector, funding_amount, pitch
    });

    await request.save();

    const emailHtml = `
      <h2>New Find Investor Request</h2>
      <p><strong>User Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Startup Name:</strong> ${startup_name}</p>
      <p><strong>Sector:</strong> ${sector}</p>
      <p><strong>Funding Amount:</strong> ${funding_amount}</p>
      <p><strong>Pitch:</strong> ${pitch || 'N/A'}</p>
      <p>Please review and match an investor in the Admin Dashboard.</p>
    `;

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Explore Investor Request Received',
      html: emailHtml
    });

    res.status(201).json({ success: true, message: 'Explore investor request submitted successfully' });
  } catch (error) {
    console.error('Explore investor error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit explore request' });
  }
};
