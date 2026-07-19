const { InvestorApplication } = require('../../models/InvestorApplication');
const { User } = require('../users/user.model');
const { Investor } = require('../profiles/investor.model');
const { sendEmail } = require('../../utils/emailService');
const { ApiError } = require('../../utils/apiError');
const env = require('../../config/env');

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
      status: 'approved',
      isVerified: true,
      approvedAt: new Date(),
    });
  }

  // 3. Mark the application approved.
  application.status = 'approved';
  application.approvedAt = new Date();
  await application.save();

  // 4. Approval email with sign-in guidance (no plaintext password — we only
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
    throw new ApiError(400, `Cannot reject — application is already ${application.status}`);
  }

  application.status = 'rejected';
  application.rejectionReason = reason || '';
  application.rejectedAt = new Date();
  await application.save();

  await sendEmail({
    to: application.email,
    subject: 'Update on Your Investor Application — Startup India Incubation',
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
    'yearsOfExperience', 'investorType',
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
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#f5f5f5;"><tr><td align="center" style="padding:40px 20px;">
    <table role="presentation" style="max-width:600px;width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <tr><td style="background:linear-gradient(135deg,#e63946,#ff6b6b);padding:40px 30px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;">🚀 Startup India Incubation</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Empowering Entrepreneurs, Building Tomorrow</p>
      </td></tr>
      <tr><td style="padding:40px 30px;">
        <div style="text-align:center;margin-bottom:24px;"><span style="font-size:48px;">🎉</span></div>
        <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:24px;font-weight:700;text-align:center;">Congratulations, ${fullName}!</h2>
        <p style="margin:0 0 16px;color:#666;font-size:16px;line-height:1.6;">Your investor application has been <strong style="color:#10B981;">approved</strong>! Welcome to the Startup India Incubation investor network.</p>
        <p style="margin:0 0 20px;color:#666;font-size:16px;line-height:1.6;">You can now log in to your Investor Dashboard to manage your profile and connect with startups.</p>
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;margin-bottom:20px;">
          <p style="margin:0 0 10px;color:#1a1a1a;font-size:14px;font-weight:700;">Your sign-in details</p>
          <p style="margin:0 0 6px;color:#475569;font-size:14px;"><strong style="color:#1a1a1a;">Email:</strong> ${email}</p>
          <p style="margin:0 0 12px;color:#475569;font-size:14px;"><strong style="color:#1a1a1a;">Password:</strong> the password you created when you applied</p>
          <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">For your security we never store your password in a readable form, so we can't include it here. Forgotten it? <a href="${resetLink}" style="color:#e63946;font-weight:600;">Reset your password</a>.</p>
        </div>
        <table role="presentation" style="width:100%;border-collapse:collapse;"><tr><td align="center" style="padding:8px 0 24px;">
          <a href="${loginLink}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#e63946,#ff6b6b);color:#fff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">Log In to Your Dashboard →</a>
        </td></tr></table>
      </td></tr>
      <tr><td style="background:#fafafa;padding:24px 30px;text-align:center;border-top:1px solid #eee;">
        <p style="margin:0;color:#999;font-size:12px;">© ${new Date().getFullYear()} Startup India Incubation. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

function getInvestorRejectionEmail(fullName, reason) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5;">
  <table role="presentation" style="width:100%;border-collapse:collapse;background:#f5f5f5;"><tr><td align="center" style="padding:40px 20px;">
    <table role="presentation" style="max-width:600px;width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <tr><td style="background:#1a1a1a;padding:40px 30px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;">Startup India Incubation</h1>
      </td></tr>
      <tr><td style="padding:40px 30px;">
        <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:22px;font-weight:700;">Dear ${fullName},</h2>
        <p style="margin:0 0 16px;color:#666;font-size:16px;line-height:1.6;">Thank you for your interest in joining the Startup India Incubation investor network. We appreciate the time you took to apply.</p>
        <p style="margin:0 0 16px;color:#666;font-size:16px;line-height:1.6;">After careful review, we are unable to approve your application at this time.</p>
        ${reason ? `<div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin-bottom:16px;"><p style="margin:0;color:#92400e;font-size:14px;font-weight:600;">Feedback:</p><p style="margin:8px 0 0;color:#78350f;font-size:14px;line-height:1.6;">${reason}</p></div>` : ''}
        <p style="margin:0;color:#666;font-size:16px;line-height:1.6;">You are welcome to reapply in the future.<br><br>Best regards,<br><strong>The Startup India Incubation Team</strong></p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
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
