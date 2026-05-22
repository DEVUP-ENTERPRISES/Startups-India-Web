const { MentorApplication } = require('../../models/MentorApplication');
const { MentorRequest } = require('../../models/MentorRequest');
const { sendEmail } = require('../../utils/emailService');
const bcrypt = require('bcryptjs');
const mentorsService = require('./mentors.service');

exports.applyMentor = async (req, res) => {
  const { fullName, email, password, phone, currentRole, company, experience, linkedin, expertise, bio, availability } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const application = new MentorApplication({
      fullName, email, password: hashedPassword, phone, currentRole, company, experience, linkedin, expertise, bio, availability
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

exports.getApplications = async (req, res) => {
  try {
    const applications = await MentorApplication.find().sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await MentorRequest.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch requests' });
  }
};

exports.sendWelcomeEmail = async (req, res) => {
  try {
    const { email, fullName, expertise } = req.body;
    await mentorsService.sendWelcomeEmail({ email, fullName, expertise });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to send welcome email' });
  }
};
