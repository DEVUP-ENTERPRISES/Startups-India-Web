const crypto = require('crypto');
const { MentorApplication } = require('../../models/MentorApplication');
const { MentorRequest } = require('../../models/MentorRequest');
const { sendEmail } = require('../../utils/emailService');
const { wrap, pill, hr } = require('../../utils/emailTemplates');
const bcrypt = require('bcryptjs');
const mentorsService = require('./mentors.service');
const approvalService = require('./mentorApproval.service');
const { generateUploadUrl } = require('../../utils/s3');

// ─── PUBLIC: Presigned URL for the applicant's profile photo ────────
// Mentor applicants have no account yet, so this is unauthenticated. It is kept
// safe by: only ever issuing keys under mentors/applications/, allowing image
// types only, and being rate-limited at the route. The browser PUTs the bytes
// straight to S3; only the resulting URL is later submitted with the application.
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

exports.getApplicationPhotoUploadUrl = async (req, res) => {
  const { fileType, fileName } = req.body || {};

  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return res.status(400).json({ success: false, message: 'Please upload a JPG, PNG or WebP image.' });
  }

  const ext = (fileName && fileName.includes('.') ? fileName.split('.').pop() : 'jpg')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 5);
  const key = `mentors/applications/${crypto.randomBytes(12).toString('hex')}.${ext}`;

  try {
    const presigned = await generateUploadUrl({ key, contentType: fileType, expiresIn: 300 });
    // fileUrl is the public S3 object URL to submit with the application.
    return res.json({
      success: true,
      data: { uploadUrl: presigned.uploadUrl, fileUrl: presigned.fileUrl, key: presigned.key },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not prepare the upload. Please try again.' });
  }
};

// ─── PUBLIC: Apply as Mentor ────────────────────────────────────────
exports.applyMentor = async (req, res) => {
  const {
    fullName, email, password, phone, profileImage,
    currentRole, company, experience, linkedin, expertise, bio, availability,
  } = req.body;

  try {
    // Public endpoint — validate the essentials rather than trusting the client.
    if (!fullName || !email || !password || !phone || !currentRole || !company || !bio) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (!Array.isArray(expertise) || expertise.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one area of expertise.' });
    }
    // A profile photo is mandatory — the admin needs a face to review before
    // approving, and approved mentors are shown publicly with their photo.
    if (!profileImage) {
      return res.status(400).json({ success: false, message: 'Please upload a profile photo.' });
    }
    // Only accept an image URL that came from our own S3 uploader — never an
    // arbitrary external URL a caller could point at anything.
    if (!/^https:\/\/[a-z0-9.-]*amazonaws\.com\//i.test(profileImage)) {
      return res.status(400).json({ success: false, message: 'Invalid profile image.' });
    }

    // Check for duplicate application
    const existing = await MentorApplication.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.status === 'pending') {
        return res.status(409).json({ success: false, message: 'An application with this email is already under review.' });
      }
      if (existing.status === 'approved') {
        return res.status(409).json({ success: false, message: 'This email is already an approved mentor. Please log in.' });
      }
      // If rejected, allow re-application — delete old one
      if (existing.status === 'rejected') {
        await MentorApplication.deleteOne({ _id: existing._id });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const application = new MentorApplication({
      fullName, email: email.toLowerCase(), password: hashedPassword, phone,
      profileImage: profileImage || null,
      currentRole, company, experience, linkedin, expertise, bio, availability,
    });

    await application.save();

    const adminInner = `
      <tr>
        <td style="padding:36px 32px 28px;">
          ${pill('New Application')}
          <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:28px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
            New Mentor Application
          </h1>
          <table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:14px; color:#333; margin-top:20px;">
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Name:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${fullName}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${email}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Phone:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${phone}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Role:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${currentRole} at ${company}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Experience:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${experience}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Please review the application in the Admin Dashboard.
          </p>
        </td>
      </tr>
      ${hr()}
    `;
    const emailHtml = wrap('New Mentor Application', 'Mentor Application', adminInner);

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Mentor Application Received',
      html: emailHtml
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Apply mentor error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit application' });
  }
};

// ─── PROTECTED: Find a Mentor (user request) ───────────────────────
exports.findMentor = async (req, res) => {
  const { name, email, phone, area, message } = req.body;
  const userId = req.user.userId;

  try {
    const request = new MentorRequest({
      user: userId, name, email, phone, area, message
    });

    await request.save();

    const requestInner = `
      <tr>
        <td style="padding:36px 32px 28px;">
          ${pill('New Request')}
          <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:28px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
            Find Mentor Request
          </h1>
          <table style="width:100%; border-collapse:collapse; font-family:sans-serif; font-size:14px; color:#333; margin-top:20px;">
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">User Name:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${name}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Email:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${email}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Phone:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${phone || 'N/A'}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Area of Interest:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">${area}</td></tr>
            <tr><td style="padding:8px 0; font-weight:bold; border-bottom:1px solid #f0f0f0;">Message:</td><td style="padding:8px 0; border-bottom:1px solid #f0f0f0; white-space:pre-wrap;">${message || 'N/A'}</td></tr>
          </table>
          <p style="margin:24px 0 0;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
            Please review and match a mentor in the Admin Dashboard.
          </p>
        </td>
      </tr>
      ${hr()}
    `;
    const emailHtml = wrap('New Find Mentor Request', 'Mentor Match', requestInner);

    await sendEmail({
      to: 'admin@startupsindia.in',
      subject: 'New Mentor Request Received',
      html: emailHtml
    });

    res.status(201).json({ success: true, message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Find mentor error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit request' });
  }
};

// ─── ADMIN: List Applications ───────────────────────────────────────
exports.getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const applications = await MentorApplication.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

// ─── ADMIN: Get Single Application Details ──────────────────────────
exports.getApplicationDetails = async (req, res) => {
  try {
    const application = await approvalService.getApplicationDetails(req.params.id);
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: Approve Application ─────────────────────────────────────
exports.approveApplication = async (req, res) => {
  try {
    const application = await approvalService.approveMentorApplication(req.params.id);
    res.json({ success: true, data: application, message: 'Mentor approved and account created successfully' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: Reject Application ──────────────────────────────────────
exports.rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    const application = await approvalService.rejectMentorApplication(req.params.id, reason);
    res.json({ success: true, data: application, message: 'Application rejected' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: Delete Mentor / Application ─────────────────────────────
exports.deleteApplication = async (req, res) => {
  try {
    const result = await approvalService.deleteMentor(req.params.id);
    res.json({ success: true, data: result, message: 'Mentor removed' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── ADMIN: List Mentor Requests ────────────────────────────────────
exports.getRequests = async (req, res) => {
  try {
    const requests = await MentorRequest.find().populate('user', 'fullName email').sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
};

// ─── MENTOR: My Dashboard ───────────────────────────────────────────
exports.getMentorDashboard = async (req, res) => {
  try {
    const data = await approvalService.getMentorDashboard(req.user.userId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── MENTOR: My Profile ─────────────────────────────────────────────
exports.getMentorProfile = async (req, res) => {
  try {
    const profile = await approvalService.getMentorProfile(req.user.userId);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.updateMentorProfile = async (req, res) => {
  try {
    const profile = await approvalService.updateMentorProfile(req.user.userId, req.body);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── MENTOR: My Requests ────────────────────────────────────────────
exports.getMentorRequests = async (req, res) => {
  try {
    const requests = await approvalService.getMentorRequests(req.user.userId);
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

// ─── PUBLIC: Welcome Email ──────────────────────────────────────────
exports.sendWelcomeEmail = async (req, res) => {
  try {
    const { email, fullName, expertise } = req.body;
    await mentorsService.sendWelcomeEmail({ email, fullName, expertise });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to send welcome email' });
  }
};
