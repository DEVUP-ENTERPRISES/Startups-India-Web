const { MentorApplication } = require('../../models/MentorApplication');
const { MentorRequest } = require('../../models/MentorRequest');
const { User } = require('../users/user.model');
const { Mentor } = require('../profiles/mentor.model');
const { sendEmail } = require('../../utils/emailService');
const { ApiError } = require('../../utils/apiError');
const env = require('../../config/env');
const { wrap, pill, ctaBtn, hr } = require('../../utils/emailTemplates');

// Use the dedicated FRONTEND_URL rather than CORS_ORIGIN: CORS_ORIGIN is an
// allow-list that may hold several origins, and env.FRONTEND_URL is the one the
// config guards against being left as localhost in production.
const FRONTEND_URL = env.FRONTEND_URL;

// ─── APPROVE ────────────────────────────────────────────────────────
async function approveMentorApplication(applicationId) {
  const application = await MentorApplication.findById(applicationId);
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.status === 'approved') throw new ApiError(400, 'Application already approved');

  // 1. Create or upgrade User account
  let user = await User.findOne({ email: application.email.toLowerCase() });

  if (user) {
    // Existing user - upgrade role to mentor and approve login
    user.role = 'mentor';
    user.isApproved = true;
    user.status = 'approved';
    // If user has no password (e.g. Google-only), store the one from the application
    if (!user.passwordHash) {
      user.passwordHash = application.password;
    }
    user.fullName = user.fullName || application.fullName;
    user.phone = user.phone || application.phone;
    await user.save();
  } else {
    // New user - create with the hashed password from the application
    user = await User.create({
      email: application.email.toLowerCase(),
      passwordHash: application.password, // Already bcrypt-hashed in the apply step
      fullName: application.fullName,
      phone: application.phone,
      role: 'mentor',
      provider: 'email',
      isApproved: true,
      status: 'approved',
    });
  }

  // 2. Create or update Mentor profile
  let mentorProfile = await Mentor.findOne({ email: application.email.toLowerCase() });
  if (mentorProfile) {
    mentorProfile.userId = user._id;
    mentorProfile.status = 'approved';
    mentorProfile.isActive = true;
    mentorProfile.fullName = application.fullName;
    mentorProfile.currentRole = application.currentRole;
    mentorProfile.company = application.company;
    mentorProfile.experience = application.experience;
    mentorProfile.expertise = application.expertise || [];
    mentorProfile.bio = application.bio;
    mentorProfile.availability = application.availability;
    mentorProfile.linkedinUrl = application.linkedin || null;
    mentorProfile.phone = application.phone;
    mentorProfile.industry = application.industry || '';
    mentorProfile.startupsMentored = application.startupsMentored || '';
    mentorProfile.websiteUrl = application.website || '';
    // Only overwrite the photo if the application actually has one, so a
    // re-approval never blanks an image the mentor set later.
    if (application.profileImage) mentorProfile.profileImage = application.profileImage;
    await mentorProfile.save();
  } else {
    mentorProfile = await Mentor.create({
      userId: user._id,
      fullName: application.fullName,
      email: application.email.toLowerCase(),
      phone: application.phone,
      profileImage: application.profileImage || null,
      currentRole: application.currentRole,
      company: application.company,
      experience: application.experience,
      expertise: application.expertise || [],
      bio: application.bio,
      availability: application.availability,
      linkedinUrl: application.linkedin || null,
      industry: application.industry || '',
      startupsMentored: application.startupsMentored || '',
      websiteUrl: application.website || '',
      status: 'approved',
      isActive: true,
    });
  }

  // 3. Update application status
  application.status = 'approved';
  application.approvedAt = new Date();
  await application.save();

  // 4. Send approval email
  // Mentors get their own branded sign-in page; it routes them straight to the
  // mentor dashboard on success.
  const loginLink = `${FRONTEND_URL}/mentor-login`;
  const resetLink = `${FRONTEND_URL}/forgot-password`;
  await sendEmail({
    to: application.email,
    subject: '🎉 Congratulations! Your Mentor Application Has Been Approved',
    html: getMentorApprovalEmail(application.fullName, loginLink, application.email, resetLink),
  });

  return application;
}

// ─── REJECT ─────────────────────────────────────────────────────────
async function rejectMentorApplication(applicationId, reason) {
  const application = await MentorApplication.findById(applicationId);
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.status !== 'pending') {
    throw new ApiError(400, `Cannot reject - application is already ${application.status}`);
  }

  application.status = 'rejected';
  application.rejectionReason = reason || '';
  application.rejectedAt = new Date();
  await application.save();

  // Send rejection email
  await sendEmail({
    to: application.email,
    subject: 'Update on Your Mentor Application - Startups India Ecosystem',
    html: getMentorRejectionEmail(application.fullName, reason),
  });

  return application;
}

// ─── GET DETAILS ────────────────────────────────────────────────────
async function getApplicationDetails(applicationId) {
  const application = await MentorApplication.findById(applicationId).lean();
  if (!application) throw new ApiError(404, 'Application not found');
  return application;
}

// ─── MENTOR DASHBOARD DATA ─────────────────────────────────────────
async function getMentorDashboard(userId) {
  const mentorProfile = await Mentor.findOne({ userId }).lean();
  if (!mentorProfile) throw new ApiError(404, 'Mentor profile not found');

  // Get matched mentee requests
  const matchedRequests = await MentorRequest.find({ matchedMentor: userId })
    .populate('user', 'fullName email avatarUrl')
    .sort({ createdAt: -1 })
    .lean();

  // Get pending requests (unmatched, for the mentor's expertise areas)
  const pendingRequests = await MentorRequest.find({ status: 'pending' })
    .populate('user', 'fullName email avatarUrl')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const stats = {
    totalMentees: mentorProfile.totalMentees || matchedRequests.length,
    totalSessions: mentorProfile.totalSessions || 0,
    rating: mentorProfile.rating || 0,
    upcomingSessionsCount: matchedRequests.filter(r => r.status === 'matched').length,
  };

  return {
    profile: mentorProfile,
    stats,
    matchedRequests,
    pendingRequests,
  };
}

// ─── MENTOR PROFILE ─────────────────────────────────────────────────
async function getMentorProfile(userId) {
  const profile = await Mentor.findOne({ userId }).lean();
  if (!profile) throw new ApiError(404, 'Mentor profile not found');
  return profile;
}

async function updateMentorProfile(userId, updates) {
  // Fields a mentor may edit on their own profile. Name/email stay fixed (email
  // is the login identity); everything else about the professional profile is
  // theirs to update, including the photo.
  const allowed = [
    'bio', 'availability', 'linkedinUrl', 'phone', 'profileImage', 'achievements',
    'expertise', 'previousCompanies', 'currentRole', 'company', 'experience',
    'industry', 'startupsMentored', 'websiteUrl',
  ];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  const profile = await Mentor.findOneAndUpdate(
    { userId },
    { $set: filtered },
    { new: true }
  ).lean();
  if (!profile) throw new ApiError(404, 'Mentor profile not found');
  return profile;
}

// ─── MENTOR'S MATCHED REQUESTS ──────────────────────────────────────
async function getMentorRequests(userId) {
  return MentorRequest.find({ matchedMentor: userId })
    .populate('user', 'fullName email avatarUrl phone')
    .sort({ createdAt: -1 })
    .lean();
}

// ─── EMAIL TEMPLATES ────────────────────────────────────────────────
function getMentorApprovalEmail(fullName, loginLink, email, resetLink) {
  const inner = `
    <tr>
      <td style="padding:36px 32px 28px;">
        ${pill('Approved')}
        <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:32px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
          Congratulations, ${fullName}!
        </h1>
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          We are thrilled to inform you that your mentor application has been <strong style="color: #10B981;">approved</strong>! Welcome to the Startups India Ecosystem mentor community.
        </p>
        <p style="margin:0 0 20px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          You can now log in to your Mentor Dashboard to manage your mentees, set your availability, and start making an impact.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
          <p style="margin: 0 0 10px 0; color: #1a1a1a; font-family:sans-serif; font-size: 14px; font-weight: 700;">Your sign-in details</p>
          <p style="margin: 0 0 6px 0; color: #475569; font-family:sans-serif; font-size: 14px; line-height: 1.6;">
            <strong style="color: #1a1a1a;">Email:</strong> ${email}
          </p>
          <p style="margin: 0 0 12px 0; color: #475569; font-family:sans-serif; font-size: 14px; line-height: 1.6;">
            <strong style="color: #1a1a1a;">Password:</strong> the password you created when you applied
          </p>
          <p style="margin: 0; color: #64748b; font-family:sans-serif; font-size: 13px; line-height: 1.6;">
            Forgotten it? <a href="${resetLink}" style="color: #e63946; font-weight: 600;">Reset your password</a>.
          </p>
        </div>

        ${ctaBtn(loginLink, 'Log In to Your Dashboard')}

        <div style="background: #f0fdf4; border-left: 4px solid #10B981; padding: 16px; border-radius: 8px; margin-top: 24px;">
          <p style="margin: 0; color: #166534; font-family:sans-serif; font-size: 14px; font-weight: 600;">What's Next?</p>
          <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #15803d; font-family:sans-serif; font-size: 14px; line-height: 1.8;">
            <li>Complete your mentor profile</li>
            <li>Set your availability hours</li>
            <li>Review and accept mentee requests</li>
            <li>Start impactful mentoring sessions</li>
          </ul>
        </div>
      </td>
    </tr>
    ${hr()}
  `;
  return wrap('Your application has been approved!', 'Mentor Approval', inner);
}

function getMentorRejectionEmail(fullName, reason) {
  const inner = `
    <tr>
      <td style="padding:36px 32px 28px;">
        <h2 style="margin:0 0 16px;font-family:sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;">
          Dear ${fullName},
        </h2>
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          Thank you for your interest in becoming a mentor with Startups India Ecosystem. We truly appreciate the time you took to apply.
        </p>
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          After careful review, we are unable to approve your application at this time.
        </p>
        ${reason ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0; color: #92400e; font-family:sans-serif; font-size: 14px; font-weight: 600;">Feedback:</p>
          <p style="margin: 8px 0 0 0; color: #78350f; font-family:sans-serif; font-size: 14px; line-height: 1.6;">${reason}</p>
        </div>` : ''}
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          We encourage you to reapply in the future as our program requirements evolve. Your expertise is valuable, and we hope to work together soon.
        </p>
      </td>
    </tr>
    ${hr()}
  `;
  return wrap('Update on your mentor application', 'Mentor Application', inner);
}

/**
 * Fully remove a mentor: delete the application, delete the Mentor profile (so
 * they drop off the public listing), and downgrade the linked User back to a
 * normal 'user'.
 *
 * The User account itself is NOT deleted - it may own enrolments, payments or
 * other data, and nuking it would orphan those. Downgrading the role is the
 * reversible, non-destructive way to revoke mentor status.
 */
async function deleteMentor(applicationId) {
  const application = await MentorApplication.findById(applicationId);
  if (!application) throw new ApiError(404, 'Application not found');

  const email = application.email.toLowerCase();

  // Drop the public-facing profile.
  await Mentor.deleteOne({ email });

  // Revoke mentor access without destroying the account.
  const user = await User.findOne({ email });
  if (user && user.role === 'mentor') {
    user.role = 'user';
    await user.save();
  }

  await MentorApplication.deleteOne({ _id: application._id });

  // Send status removal email
  try {
    await sendEmail({
      to: email,
      subject: 'Update on Your Mentor Status - Startups India Ecosystem',
      html: wrap(
        'Your mentor profile has been removed.',
        'Profile Update',
        `<tr>
          <td style="padding:36px 32px 28px;">
            <h2 style="margin:0 0 16px;font-family:sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;">
              Dear ${application.fullName},
            </h2>
            <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
              This is to inform you that your mentor status has been deactivated and your public profile has been removed from the Startups India Ecosystem platform.
            </p>
            <p style="margin:0;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
              If you have any questions or believe this is an error, please reach out to our support team at <a href="mailto:${env.SMTP_FROM || 'support@startupsindia.in'}" style="color:#e63946;text-decoration:none;font-weight:600;">${env.SMTP_FROM || 'support@startupsindia.in'}</a>.
            </p>
          </td>
        </tr>
        ${hr()}`
      )
    });
  } catch (emailErr) {
    console.error('Failed to send mentor deletion email:', emailErr);
  }

  return { deleted: true };
}

module.exports = {
  approveMentorApplication,
  rejectMentorApplication,
  deleteMentor,
  getApplicationDetails,
  getMentorDashboard,
  getMentorProfile,
  updateMentorProfile,
  getMentorRequests,
};
