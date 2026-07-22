const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { InvestorRequest } = require('../../models/InvestorRequest');
const { ExploreInvestorRequest } = require('../../models/ExploreInvestorRequest');
const { InvestorApplication } = require('../../models/InvestorApplication');
const { sendEmail } = require('../../utils/emailService');
const { wrap, pill, hr } = require('../../utils/emailTemplates');
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

    const adminInner = `
      <tr>
        <td style="padding:36px 32px 28px;">
          ${pill('New Application')}
          <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:28px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
            Investor Registration Request
          </h1>
          <table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:14px; color:#333; margin-top:20px;">
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Name:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${full_name}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${email}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Phone:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Type:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${investor_type}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Organization:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${organization_name || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Ticket Size:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${ticket_size || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Focus Areas:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${investment_focus?.join(', ') || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Stages:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${preferred_stages?.join(', ') || 'N/A'}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Please review this application in the Admin Dashboard.
          </p>
        </td>
      </tr>
      ${hr()}
    `;

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Investor Registration Received',
      html: wrap('New Investor Registration', 'New Application', adminInner)
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

    const exploreInner = `
      <tr>
        <td style="padding:36px 32px 28px;">
          ${pill('New Request')}
          <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:28px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
            Find Investor Request
          </h1>
          <table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:14px; color:#333; margin-top:20px;">
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">User Name:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${name}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${email}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Phone:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Startup Name:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${startup_name}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Sector:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${sector}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Funding Amount:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${funding_amount}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Pitch:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0; white-space:pre-wrap;">${pitch || 'N/A'}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Please review and match an investor in the Admin Dashboard.
          </p>
        </td>
      </tr>
      ${hr()}
    `;

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Explore Investor Request Received',
      html: wrap('New Explore Investor Request', 'Investor Match', exploreInner)
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

    const appInner = `
      <tr>
        <td style="padding:36px 32px 28px;">
          ${pill('New Application')}
          <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:28px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
            Investor Application
          </h1>
          <table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:14px; color:#333; margin-top:20px;">
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Name:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${fullName}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${email}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Type:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${investorType}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Please review it in the Admin Dashboard.
          </p>
        </td>
      </tr>
      ${hr()}
    `;

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Investor Application Received',
      html: wrap('New Investor Application', 'New Application', appInner),
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
