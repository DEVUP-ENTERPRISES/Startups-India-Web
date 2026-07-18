const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { InvestorRequest } = require('../../models/InvestorRequest');
const { ExploreInvestorRequest } = require('../../models/ExploreInvestorRequest');
const { InvestorApplication } = require('../../models/InvestorApplication');
const { sendEmail } = require('../../utils/emailService');
const { generateUploadUrl } = require('../../utils/s3');
const approvalService = require('./investorApproval.service');

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

// ─── PUBLIC: Presigned URL for the applicant's profile photo ────────
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

exports.getApplicationPhotoUploadUrl = async (req, res) => {
  const { fileType, fileName } = req.body || {};
  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return res.status(400).json({ success: false, message: 'Please upload a JPG, PNG or WebP image.' });
  }
  const ext = (fileName && fileName.includes('.') ? fileName.split('.').pop() : 'jpg')
    .toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5);
  const key = `investors/applications/${crypto.randomBytes(12).toString('hex')}.${ext}`;
  try {
    const presigned = await generateUploadUrl({ key, contentType: fileType, expiresIn: 300 });
    return res.json({ success: true, data: { uploadUrl: presigned.uploadUrl, fileUrl: presigned.fileUrl, key: presigned.key } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not prepare the upload. Please try again.' });
  }
};

// ─── PUBLIC: Apply as Investor ──────────────────────────────────────
exports.applyInvestor = async (req, res) => {
  const {
    fullName, email, password, phone, profileImage, investorType, organizationName,
    investmentFocus, preferredStages, ticketSize, bio, linkedin, websiteUrl,
    location, yearsOfExperience,
  } = req.body;

  try {
    if (!fullName || !email || !password || !phone || !investorType || !bio) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (!Array.isArray(investmentFocus) || investmentFocus.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one investment focus area.' });
    }
    if (profileImage && !/^https:\/\/[a-z0-9.-]*amazonaws\.com\//i.test(profileImage)) {
      return res.status(400).json({ success: false, message: 'Invalid profile image.' });
    }

    const existing = await InvestorApplication.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.status === 'pending') {
        return res.status(409).json({ success: false, message: 'An application with this email is already under review.' });
      }
      if (existing.status === 'approved') {
        return res.status(409).json({ success: false, message: 'This email is already an approved investor. Please log in.' });
      }
      if (existing.status === 'rejected') {
        await InvestorApplication.deleteOne({ _id: existing._id });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await InvestorApplication.create({
      fullName, email: email.toLowerCase(), password: hashedPassword, phone,
      profileImage: profileImage || null,
      investorType, organizationName, investmentFocus, preferredStages,
      ticketSize, bio, linkedin, websiteUrl, location, yearsOfExperience,
    });

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Investor Application Received',
      html: `<h2>New Investor Application</h2><p><strong>Name:</strong> ${fullName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Type:</strong> ${investorType}</p><p>Please review it in the Admin Dashboard.</p>`,
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply investor error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
};

// ─── ADMIN: List / Approve / Reject / Delete ────────────────────────
exports.getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const q = {};
    if (status && status !== 'all') q.status = status;
    if (search) {
      const rx = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      q.$or = [{ fullName: rx }, { email: rx }, { organizationName: rx }];
    }
    const applications = await InvestorApplication.find(q).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load applications' });
  }
};

exports.approveApplication = async (req, res) => {
  try {
    const application = await approvalService.approveInvestorApplication(req.params.id);
    res.json({ success: true, data: application, message: 'Investor approved and account created' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.rejectApplication = async (req, res) => {
  try {
    const application = await approvalService.rejectInvestorApplication(req.params.id, req.body.reason);
    res.json({ success: true, data: application, message: 'Application rejected' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const result = await approvalService.deleteInvestor(req.params.id);
    res.json({ success: true, data: result, message: 'Investor removed' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── INVESTOR SELF-SERVICE ──────────────────────────────────────────
exports.getInvestorDashboard = async (req, res) => {
  try {
    const data = await approvalService.getInvestorDashboard(req.user.userId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getInvestorProfile = async (req, res) => {
  try {
    const data = await approvalService.getInvestorProfile(req.user.userId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.updateInvestorProfile = async (req, res) => {
  try {
    const data = await approvalService.updateInvestorProfile(req.user.userId, req.body);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};
