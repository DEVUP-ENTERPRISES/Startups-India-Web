const { InvestorApplication } = require('../../models/InvestorApplication');
const { User } = require('../users/user.model');
const { Investor } = require('../profiles/investor.model');
const { sendEmail } = require('../../utils/emailService');
const { ApiError } = require('../../utils/apiError');
const env = require('../../config/env');
const { wrap, pill, ctaBtn, hr } = require('../../utils/emailTemplates');

// Mirror of mentorApproval.service.js. An investor application only becomes a
// login account + public profile on approval; the chosen password lives on the
// application (bcrypt-hashed) until then.
const FRONTEND_URL = env.FRONTEND_URL;

// ─── APPROVE ────────────────────────────────────────────────────────
async function approveInvestorApplication(applicationId) {
  const application = await InvestorApplication.findById(applicationId);
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.status === 'approved') throw new ApiError(400, 'Application already approved');

  // 1. Create or upgrade the User account (role=investor).
  let user = await User.findOne({ email: application.email.toLowerCase() });
  if (user) {
    user.role = 'investor';
    user.isApproved = true;
    user.status = 'approved';
    if (!user.passwordHash) user.passwordHash = application.password;
    user.fullName = user.fullName || application.fullName;
    user.phone = user.phone || application.phone;
    await user.save();
  } else {
    user = await User.create({
      email: application.email.toLowerCase(),
      passwordHash: application.password, // already bcrypt-hashed at apply time
      fullName: application.fullName,
      phone: application.phone,
      role: 'investor',
      provider: 'email',
      isApproved: true,
      status: 'approved',
    });
  }

  // 2. Create or update the public Investor profile. isVerified=true is what the
  //    public listing filters on, so approval is what makes them appear.
  let profile = await Investor.findOne({ email: application.email.toLowerCase() });
  if (profile) {
    profile.userId = user._id;
    profile.status = 'approved';
    profile.isVerified = true;
    profile.fullName = application.fullName;
    profile.investorType = application.investorType;
    profile.organizationName = application.organizationName;
    profile.investmentFocus = application.investmentFocus || [];
    profile.preferredStages = application.preferredStages || [];
    profile.ticketSize = application.ticketSize;
    profile.bio = application.bio;
    profile.linkedinUrl = application.linkedin || null;
    profile.websiteUrl = application.websiteUrl || null;
    profile.location = application.location || null;
    profile.yearsOfExperience = application.yearsOfExperience ?? null;
    profile.phone = application.phone;
    profile.geography = application.geography || null;
    profile.numberOfInvestments = application.numberOfInvestments || null;
    profile.portfolioWebsite = application.portfolioWebsite || null;
    // Only overwrite the photo if the application has one, so a re-approval never
    // blanks an image the investor set later.
    if (application.profileImage) profile.profileImage = application.profileImage;
    profile.approvedAt = new Date();
    await profile.save();
  } else {
    profile = await Investor.create({
      userId: user._id,
      fullName: application.fullName,
      email: application.email.toLowerCase(),
      phone: application.phone,
      profileImage: application.profileImage || null,
      investorType: application.investorType,
      organizationName: application.organizationName,
      investmentFocus: application.investmentFocus || [],
      preferredStages: application.preferredStages || [],
      ticketSize: application.ticketSize,
      bio: application.bio,
      linkedinUrl: application.linkedin || null,
      websiteUrl: application.websiteUrl || null,
      location: application.location || null,
      yearsOfExperience: application.yearsOfExperience ?? null,
      geography: application.geography || null,
      numberOfInvestments: application.numberOfInvestments || null,
      portfolioWebsite: application.portfolioWebsite || null,
      status: 'approved',
      isVerified: true,
      approvedAt: new Date(),
    });
  }

  // 3. Mark the application approved.
  application.status = 'approved';
  application.approvedAt = new Date();
  await application.save();

  // 4. Approval email with sign-in guidance (no plaintext password - we only
  //    stored a hash).
  const loginLink = `${FRONTEND_URL}/investor-login`;
  const resetLink = `${FRONTEND_URL}/forgot-password`;
  await sendEmail({
    to: application.email,
    subject: '🎉 Congratulations! Your Investor Application Has Been Approved',
    html: getInvestorApprovalEmail(application.fullName, loginLink, application.email, resetLink),
  });

  return application;
}

// ─── REJECT ─────────────────────────────────────────────────────────
async function rejectInvestorApplication(applicationId, reason) {
  const application = await InvestorApplication.findById(applicationId);
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.status !== 'pending') {
    throw new ApiError(400, `Cannot reject - application is already ${application.status}`);
  }

  application.status = 'rejected';
  application.rejectionReason = reason || '';
  application.rejectedAt = new Date();
  await application.save();

  await sendEmail({
    to: application.email,
    subject: 'Update on Your Investor Application - Startups India Ecosystem',
    html: getInvestorRejectionEmail(application.fullName, reason),
  });

  return application;
}

// ─── DELETE ─────────────────────────────────────────────────────────
// Removes the application + public profile, and downgrades the login account to
// a normal user. The User account is kept so unrelated data isn't orphaned.
async function deleteInvestor(applicationId) {
  const application = await InvestorApplication.findById(applicationId);
  if (!application) throw new ApiError(404, 'Application not found');

  const email = application.email.toLowerCase();
  await Investor.deleteOne({ email });

  const user = await User.findOne({ email });
  if (user && user.role === 'investor') {
    user.role = 'user';
    await user.save();
  }

  await InvestorApplication.deleteOne({ _id: application._id });

  // Send status removal email
  try {
    await sendEmail({
      to: email,
      subject: 'Update on Your Investor Status - Startups India Ecosystem',
      html: wrap(
        'Your investor profile has been removed.',
        'Profile Update',
        `<tr>
          <td style="padding:36px 32px 28px;">
            <h2 style="margin:0 0 16px;font-family:sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;">
              Dear ${application.fullName},
            </h2>
            <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
              This is to inform you that your investor status has been deactivated and your public profile has been removed from the Startups India Ecosystem platform.
            </p>
            <p style="margin:0;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
              If you have any questions or believe this is an error, please contact our support team at <a href="mailto:${env.SMTP_FROM || 'support@startupsindia.in'}" style="color:#e63946;text-decoration:none;font-weight:600;">${env.SMTP_FROM || 'support@startupsindia.in'}</a>.
            </p>
          </td>
        </tr>
        ${hr()}`
      )
    });
  } catch (emailErr) {
    console.error('Failed to send investor deletion email:', emailErr);
  }

  return { deleted: true };
}

// ─── DETAILS / DASHBOARD / PROFILE ──────────────────────────────────
async function getApplicationDetails(applicationId) {
  const application = await InvestorApplication.findById(applicationId).lean();
  if (!application) throw new ApiError(404, 'Application not found');
  return application;
}

async function getInvestorDashboard(userId) {
  const profile = await Investor.findOne({ userId }).lean();
  if (!profile) throw new ApiError(404, 'Investor profile not found');

  const stats = {
    portfolioCount: profile.portfolioCount || 0,
    totalInvestments: profile.totalInvestments || 0,
    totalStartupsSupported: profile.totalStartupsSupported || 0,
    rating: profile.rating || 0,
  };

  return { profile, stats };
}

async function getInvestorProfile(userId) {
  const profile = await Investor.findOne({ userId }).lean();
  if (!profile) throw new ApiError(404, 'Investor profile not found');
  return profile;
}

async function updateInvestorProfile(userId, updates) {
  // Fields an investor may edit on their own profile. Name/email stay fixed
  // (email is the login identity); everything else is theirs, including the photo.
  const allowed = [
    'bio', 'linkedinUrl', 'websiteUrl', 'phone', 'profileImage', 'location',
    'investmentFocus', 'preferredStages', 'ticketSize', 'organizationName',
    'yearsOfExperience', 'investorType', 'geography', 'numberOfInvestments',
    'portfolioWebsite',
  ];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  const profile = await Investor.findOneAndUpdate(
    { userId },
    { $set: filtered },
    { new: true }
  ).lean();
  if (!profile) throw new ApiError(404, 'Investor profile not found');
  return profile;
}

// ─── EMAIL TEMPLATES ────────────────────────────────────────────────
function getInvestorApprovalEmail(fullName, loginLink, email, resetLink) {
  const inner = `
    <tr>
      <td style="padding:36px 32px 28px;">
        ${pill('Approved')}
        <h1 style="margin:0 0 12px;font-family:sans-serif;font-size:32px;font-weight:900;color:#0a0a0a;line-height:1.15;letter-spacing:-0.5px;">
          Congratulations, ${fullName}!
        </h1>
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          Your investor application has been <strong style="color:#10B981;">approved</strong>! Welcome to the Startups India Ecosystem investor network.
        </p>
        <p style="margin:0 0 20px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          You can now log in to your Investor Dashboard to manage your profile and connect with startups.
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
      </td>
    </tr>
    ${hr()}
  `;
  return wrap('Your application has been approved!', 'Investor Approval', inner);
}

function getInvestorRejectionEmail(fullName, reason) {
  const inner = `
    <tr>
      <td style="padding:36px 32px 28px;">
        <h2 style="margin:0 0 16px;font-family:sans-serif;font-size:24px;font-weight:900;color:#0a0a0a;">
          Dear ${fullName},
        </h2>
        <p style="margin:0 0 16px;font-family:sans-serif;font-size:15px;color:#555;line-height:1.75;">
          Thank you for your interest in joining the Startups India Ecosystem investor network. We appreciate the time you took to apply.
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
          You are welcome to reapply in the future.
        </p>
      </td>
    </tr>
    ${hr()}
  `;
  return wrap('Update on your investor application', 'Investor Application', inner);
}

module.exports = {
  approveInvestorApplication,
  rejectInvestorApplication,
  deleteInvestor,
  getApplicationDetails,
  getInvestorDashboard,
  getInvestorProfile,
  updateInvestorProfile,
};
