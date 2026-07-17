const crypto = require('crypto');
const { MentorApplication } = require('../../models/MentorApplication');
const { MentorRequest } = require('../../models/MentorRequest');
const { sendEmail } = require('../../utils/emailService');
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
    // Only accept an image URL that came from our own S3 uploader — never an
    // arbitrary external URL a caller could point at anything.
    if (profileImage && !/^https:\/\/[a-z0-9.-]*amazonaws\.com\//i.test(profileImage)) {
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

    const emailHtml = `
      <h2>New Mentor Application</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Role:</strong> ${currentRole} at ${company}</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p>Please review the application in the Admin Dashboard.</p>
    `;

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

    const emailHtml = `
      <h2>New Find Mentor Request</h2>
      <p><strong>User Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Area of Interest:</strong> ${area}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
      <p>Please review and match a mentor in the Admin Dashboard.</p>
    `;

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
