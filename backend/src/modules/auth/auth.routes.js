const express = require('express');
const { z } = require('zod');
const env = require('../../config/env');
const { asyncHandler } = require('../../utils/asyncHandler');
const { validateBody } = require('../../middlewares/validateBody');
const { authRequired } = require('../../middlewares/authMiddleware');
const { redisRateLimit } = require('../../middlewares/rateLimit.middleware');
const authService = require('./auth.service.js');
const twoFactorService = require('./twoFactor.service');
const { maskPhone } = require('../../utils/phone');
const { User } = require('../users/user.model');

const router = express.Router();

// Password policy for newly-set passwords. The 72-byte ceiling is bcrypt's:
// anything beyond it is silently truncated, which would make a long passphrase
// weaker than it looks.
const strongPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .refine(v => /[a-z]/.test(v), 'Password must contain a lowercase letter')
  .refine(v => /[A-Z]/.test(v), 'Password must contain an uppercase letter')
  .refine(v => /[0-9]/.test(v), 'Password must contain a number');

// The IP limiter in app.js stops one host hammering the endpoint; this one stops
// a botnet spread across many IPs from mailbombing a single victim's inbox.
const forgotPasswordEmailLimit = redisRateLimit({
  windowSeconds: 60 * 60,
  max: 5,
  prefix: 'rl:forgot-pw-email',
  keyGenerator: req => String(req.body?.email || '').trim().toLowerCase() || req.ip,
});

const authCookieOptions = {
  httpOnly: true,
  // 'lax' allows cross-origin requests in development (localhost:3000 → localhost:5000).
  // 'strict' would block them entirely since ports differ, causing 401s on all
  // authenticated endpoints. In production both app and API share the same domain
  // so strict would work, but lax is safe and correct for both environments.
  sameSite: 'lax',
  secure: env.NODE_ENV === 'production',
  path: '/',
};

router.post(
  '/signup',
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      fullName: z.string().min(1).max(120),
      // Optional at the API layer: Google sign-ups and the 55 existing accounts
      // have no number, and the dashboard prompt backfills them later. Format is
      // enforced in the service; verification is a separate, explicit OTP step.
      phone: z.string().min(6).max(20).optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, {
      ...authCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          full_name: result.user.fullName,
          role: result.user.role,
          provider: result.user.provider,
          onboarding_completed: Boolean(result.user.onboardingCompleted),
        },
        session: { access_token: result.accessToken, refresh_token: result.refreshToken },
      },
    });
  })
);

router.post(
  '/register-v2',
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
      fullName: z.string().min(1).max(120),
      phone: z.string().optional(),
      role: z.string().default('startup'),
      isVerified: z.boolean().optional(),
      dynamicProfileData: z.record(z.any()).optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await authService.signupV2(req.body);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, {
      ...authCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          full_name: result.user.fullName,
          role: result.user.role,
          provider: result.user.provider,
          status: result.user.status,
          is_approved: result.user.isApproved,
        },
        profile: result.profile,
        requires_approval: result.requiresApproval,
        session: { access_token: result.accessToken, refresh_token: result.refreshToken },
      },
    });
  })
);

// ─── LEGACY OTP ROUTES (dev/test only - disabled in production) ─────────
// These mock OTP routes exist for local development convenience. In production,
// use the real hash-verified /phone/send-otp-public and /phone/verify-otp-public
// routes below.
if (process.env.NODE_ENV !== 'production') {
  router.post(
    '/send-registration-otp',
    validateBody(
      z.object({
        target: z.string().min(3),
      })
    ),
    asyncHandler(async (req, res) => {
      res.json({
        success: true,
        message: 'OTP sent successfully',
        otp: '123456',
      });
    })
  );

  router.post(
    '/verify-registration-otp',
    validateBody(
      z.object({
        target: z.string().min(3),
        otp: z.string().min(6).max(6),
      })
    ),
    asyncHandler(async (req, res) => {
      const { otp } = req.body;
      if (otp === '123456') {
        return res.json({
          success: true,
          isVerified: true,
          message: 'OTP verified successfully',
        });
      }
      res.status(400).json({
        success: false,
        message: 'Invalid OTP code',
      });
    })
  );
}


router.post(
  '/login',
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(1),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await authService.login(req.body, req);

    // 2FA account: the password was right, but the session does not exist yet.
    // No cookies, no tokens - only a pending token that unlocks the OTP step.
    if (result.twoFactorRequired) {
      return res.json({
        success: true,
        data: {
          two_factor_required: true,
          pending_token: result.pendingToken,
          phone_masked: result.phoneMasked,
          expires_in: result.expiresInSeconds,
        },
      });
    }

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, {
      ...authCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          full_name: result.user.fullName,
          role: result.user.role,
          provider: result.user.provider,
          onboarding_completed: Boolean(result.user.onboardingCompleted),
          user_metadata: {
            full_name: result.user.fullName,
            email_notifications: result.user.metadata?.emailNotifications,
            course_updates: result.user.metadata?.courseUpdates,
            marketing_emails: result.user.metadata?.marketingEmails,
          },
        },
        session: { access_token: result.accessToken, refresh_token: result.refreshToken },
      },
    });
  })
);

router.post(
  '/oauth/google',
  validateBody(
    z.object({
      idToken: z.string().min(1),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await authService.loginWithGoogle(req.body, env);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, {
      ...authCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          full_name: result.user.fullName,
          avatar_url: result.user.avatarUrl,
          role: result.user.role,
          provider: result.user.provider,
          onboarding_completed: Boolean(result.user.onboardingCompleted),
        },
        session: { access_token: result.accessToken, refresh_token: result.refreshToken },
      },
    });
  })
);

router.post(
  '/oauth/facebook',
  validateBody(
    z.object({
      accessToken: z.string().min(1),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await authService.loginWithFacebook(req.body, env);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, {
      ...authCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          full_name: result.user.fullName,
          avatar_url: result.user.avatarUrl,
          role: result.user.role,
          provider: result.user.provider,
        },
        session: { access_token: result.accessToken, refresh_token: result.refreshToken },
      },
    });
  })
);

// Fixed response for every /forgot-password outcome - registered, unknown,
// suspended, OAuth-only, or throttled. The client cannot tell them apart, which
// is the whole point: this endpoint must not confirm whether an email exists.
const FORGOT_PASSWORD_RESPONSE = {
  success: true,
  message: "If an account exists for that email, we've sent a password reset link.",
};

router.post(
  '/forgot-password',
  forgotPasswordEmailLimit,
  validateBody(
    z.object({
      email: z.string().email().max(254),
    })
  ),
  asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body, req);
    res.json(FORGOT_PASSWORD_RESPONSE);
  })
);

router.post(
  '/reset-password',
  validateBody(
    z.object({
      token: z.string().min(1).max(256),
      password: strongPassword,
    })
  ),
  asyncHandler(async (req, res) => {
    await authService.resetPassword(req.body, req);
    res.json({
      success: true,
      message: 'Password updated. Please sign in with your new password.',
    });
  })
);

// ─── TWO-FACTOR (SMS OTP) ───────────────────────────────────────────────

// Issues the real session once the OTP checks out. Mirrors /login's cookie+body
// shape exactly, so the client's success path is identical either way.
function sendSession(res, result, extra = {}) {
  res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 2 * 60 * 60 * 1000 });
  res.cookie('refreshToken', result.refreshToken, {
    ...authCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json({
    success: true,
    data: {
      ...extra,
      user: {
        id: result.user._id,
        email: result.user.email,
        full_name: result.user.fullName,
        role: result.user.role,
        provider: result.user.provider,
      },
      session: { access_token: result.accessToken, refresh_token: result.refreshToken },
    },
  });
}

router.post(
  '/2fa/verify',
  validateBody(
    z.object({
      pendingToken: z.string().min(1),
      code: z.string().regex(/^\d{4,8}$/, 'Enter the numeric code from the SMS'),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await twoFactorService.verifyLoginCode(
      req.body,
      authService.generateAndStoreTokens,
      req
    );
    sendSession(res, result);
  })
);

router.post(
  '/2fa/resend',
  validateBody(z.object({ pendingToken: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    const result = await twoFactorService.resendLoginCode(req.body.pendingToken);
    res.json({
      success: true,
      data: { phone_masked: result.phoneMasked, expires_in: result.expiresInSeconds },
    });
  })
);

// Lost phone / swapped SIM. Without this, 2FA turns every dead handset into a
// permanently locked account.
router.post(
  '/2fa/recovery',
  validateBody(
    z.object({
      pendingToken: z.string().min(1),
      backupCode: z.string().min(6).max(32),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await twoFactorService.verifyBackupCode(
      req.body,
      authService.generateAndStoreTokens,
      req
    );
    sendSession(res, result, { remaining_backup_codes: result.remainingBackupCodes });
  })
);

// ─── PHONE VERIFICATION + 2FA MANAGEMENT (authenticated) ────────────────

router.post(
  '/phone/send-otp',
  authRequired,
  validateBody(z.object({ phone: z.string().min(6).max(20) })),
  asyncHandler(async (req, res) => {
    const result = await twoFactorService.startPhoneVerification(
      { userId: req.user.userId, phone: req.body.phone },
      req
    );
    res.json({
      success: true,
      data: { phone_masked: result.phoneMasked, expires_in: result.expiresInSeconds },
    });
  })
);

router.post(
  '/phone/verify',
  authRequired,
  validateBody(z.object({ code: z.string().regex(/^\d{4,8}$/, 'Enter the numeric code') })),
  asyncHandler(async (req, res) => {
    const result = await twoFactorService.confirmPhoneVerification(
      { userId: req.user.userId, code: req.body.code },
      req
    );
    res.json({ success: true, data: { phone_verified: true, phone_masked: result.phoneMasked } });
  })
);

router.post(
  '/2fa/enable',
  authRequired,
  asyncHandler(async (req, res) => {
    const result = await twoFactorService.enableTwoFactor({ userId: req.user.userId }, req);
    res.json({
      success: true,
      data: {
        two_factor_enabled: true,
        phone_masked: result.phoneMasked,
        // Shown to the user exactly once. We store only hashes.
        backup_codes: result.backupCodes,
      },
    });
  })
);

router.post(
  '/2fa/disable',
  authRequired,
  validateBody(z.object({ password: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    await twoFactorService.disableTwoFactor(
      { userId: req.user.userId, password: req.body.password },
      req
    );
    res.json({ success: true, data: { two_factor_enabled: false } });
  })
);

router.post(
  '/2fa/backup-codes',
  authRequired,
  validateBody(z.object({ password: z.string().min(1) })),
  asyncHandler(async (req, res) => {
    const result = await twoFactorService.regenerateBackupCodes({
      userId: req.user.userId,
      password: req.body.password,
    });
    res.json({ success: true, data: { backup_codes: result.backupCodes } });
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const token = req.body?.refreshToken || req.cookies.refreshToken;
    const result = await authService.refresh(token, env);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('refreshToken', result.refreshToken, {
      ...authCookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          full_name: result.user.fullName,
          role: result.user.role,
          provider: result.user.provider,
        },
        session: { access_token: result.accessToken, refresh_token: result.refreshToken },
      },
    });
  })
);

router.post(
  '/logout',
  authRequired,
  asyncHandler(async (req, res) => {
    await authService.logout(req.user.userId);
    res.clearCookie('accessToken', authCookieOptions);
    res.clearCookie('refreshToken', authCookieOptions);
    res.json({ success: true });
  })
);

router.get(
  '/me',
  authRequired,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).lean();

    // Fetch the profile doc to get dynamicProfileData (onboarding fields)
    const { Profile } = require('../profiles/profile.model');
    const profile = await Profile.findOne({ userId: req.user.userId }).lean();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.fullName,
          fullName: user.fullName,
          phone: user.phone || null,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          phone_masked: user.phoneE164 ? maskPhone(user.phoneE164) : null,
          phone_verified: Boolean(user.phoneVerifiedAt),
          two_factor_enabled: Boolean(user.twoFactorEnabled),
          onboarding_completed: Boolean(user.onboardingCompleted),
          // Full profile data from the Profile collection - used on the
          // Registration stage page and anywhere the dashboard needs onboarding fields
          dynamicProfileData: profile?.dynamicProfileData || {},
          user_metadata: {
            full_name: user.fullName,
            email_notifications: user.metadata?.emailNotifications,
            course_updates: user.metadata?.courseUpdates,
            marketing_emails: user.metadata?.marketingEmails,
          },
        },
      },
    });
  })
);

router.get(
  '/check-exists',
  asyncHandler(async (req, res) => {
    const { email, phone } = req.query;
    let emailExists = false;
    let phoneExists = false;

    if (email && String(email).trim()) {
      const eCount = await User.countDocuments({ email: String(email).trim().toLowerCase() });
      emailExists = eCount > 0;
    }

    if (phone && String(phone).trim()) {
      const pClean = String(phone).replace(/\D/g, '');
      if (pClean.length >= 10) {
        const pCount = await User.countDocuments({ phone: { $regex: pClean } });
        phoneExists = pCount > 0;
      }
    }

    res.json({ success: true, data: { emailExists, phoneExists } });
  })
);

// ─── PROFILE IMAGE UPLOAD (authenticated) ───────────────────────────
// Onboarding profile photos / logos go straight to S3 under profiles/, and the
// profile stores only the resulting URL. This keeps the complete-onboarding
// JSON body tiny - embedding base64 images used to blow past the 1MB body limit
// (HTTP 413). The browser PUTs the bytes directly to S3 via the presigned URL,
// so image data never transits this API.
const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

router.post(
  '/profile/photo-upload-url',
  authRequired,
  validateBody(
    z.object({
      fileType: z.string().min(1).max(120),
      fileName: z.string().min(1).max(200).optional(),
      fileSize: z.coerce.number().int().positive().max(5 * 1024 * 1024).optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const { fileType, fileName, fileSize } = req.body;

    if (!PROFILE_IMAGE_TYPES.includes(fileType)) {
      return res
        .status(400)
        .json({ success: false, message: 'Please upload a JPG, PNG or WebP image.' });
    }

    const crypto = require('crypto');
    const { generateUploadUrl } = require('../../utils/s3');

    const ext = (fileName && fileName.includes('.') ? fileName.split('.').pop() : 'jpg')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 5) || 'jpg';

    // Namespaced per user, with random entropy so filenames can't collide or be guessed.
    const key = `profiles/${req.user.userId}/${crypto.randomBytes(12).toString('hex')}.${ext}`;

    try {
      const presigned = await generateUploadUrl({
        key,
        contentType: fileType,
        contentLength: Number.isFinite(fileSize) ? fileSize : undefined,
        expiresIn: 300,
      });
      return res.json({
        success: true,
        data: { uploadUrl: presigned.uploadUrl, fileUrl: presigned.fileUrl, key: presigned.key },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: 'Could not prepare the upload. Please try again.' });
    }
  })
);

// ─── ONBOARDING COMPLETION ──────────────────────────────────────────
// Called at the end of the /onboarding flow. Saves role, phone, profile data
// and marks the account as onboarding-complete so the client can redirect
// to the dashboard on next load instead of bouncing back to /onboarding.
router.patch(
  '/complete-onboarding',
  authRequired,
  validateBody(
    z.object({
      role: z.string().min(1),
      phone: z.string().optional(),
      isPhoneVerified: z.boolean().optional(),
      dynamicProfileData: z.record(z.any()).optional(),
    })
  ),
  asyncHandler(async (req, res) => {
    const { role, phone, isPhoneVerified, dynamicProfileData = {} } = req.body;
    const userId = req.user.userId;

    const requiresApproval = ['mentor', 'investor'].includes((role || '').toLowerCase());
    const userStatus = requiresApproval ? 'pending' : 'approved';
    const isApproved = !requiresApproval;

    // Phone is already written and verified by /phone/send-otp → /phone/verify
    // during the onboarding flow. We must NOT write phoneE164 here again - it
    // would hit the partial unique index if another account was previously
    // verified with the same number (even a deleted/ghost account).
    // The only phone-related thing we do here is set isPhoneVerified on the User
    // doc as a convenience flag, which the index does not cover.

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          role,
          ...(isPhoneVerified ? { isPhoneVerified: true } : {}),
          status: userStatus,
          isApproved,
          onboardingCompleted: true,
        },
      }
    );

    // Upsert role-specific profile + application records (reuse signupV2 logic)
    const { upsertUserProfile } = require('../profiles/profiles.service');
    const userDoc = await User.findById(userId).lean();
    const profile = await upsertUserProfile(userId, role, dynamicProfileData, userStatus);

    if (role === 'mentor') {
      const { MentorApplication } = require('../../models/MentorApplication');
      const mentorExpertise = Array.isArray(dynamicProfileData.expertise)
        ? dynamicProfileData.expertise
        : (dynamicProfileData.domainExpertise ? [dynamicProfileData.domainExpertise] : []);
      if (dynamicProfileData.expertiseOther) mentorExpertise.push(dynamicProfileData.expertiseOther);
      await MentorApplication.findOneAndUpdate(
        { email: userDoc.email },
        {
          $set: {
            fullName: userDoc.fullName,
            email: userDoc.email,
            phone: phone || '',
            currentRole: dynamicProfileData.designation || 'Mentor',
            company: dynamicProfileData.currentCompany || 'Independent',
            experience: String(dynamicProfileData.yearsOfExperience || ''),
            linkedin: dynamicProfileData.linkedin || null,
            expertise: mentorExpertise,
            bio: dynamicProfileData.bio || '',
            availability: dynamicProfileData.weeklyAvailability && dynamicProfileData.availabilityMode
              ? `${dynamicProfileData.weeklyAvailability} (${dynamicProfileData.availabilityMode})`
              : (dynamicProfileData.weeklyAvailability || ''),
            industry: dynamicProfileData.industry || '',
            status: userStatus,
          },
        },
        { upsert: true }
      ).catch(() => {});
    }

    if (role === 'investor') {
      const { InvestorApplication } = require('../../models/InvestorApplication');
      const focusList = Array.isArray(dynamicProfileData.preferredIndustries)
        ? dynamicProfileData.preferredIndustries
        : (dynamicProfileData.preferredIndustries ? [dynamicProfileData.preferredIndustries] : []);
      const stageList = Array.isArray(dynamicProfileData.investmentStage)
        ? dynamicProfileData.investmentStage
        : (dynamicProfileData.investmentStage ? [dynamicProfileData.investmentStage] : []);
      await InvestorApplication.findOneAndUpdate(
        { email: userDoc.email },
        {
          $set: {
            fullName: userDoc.fullName,
            email: userDoc.email,
            phone: phone || '',
            investorType: dynamicProfileData.investorType || 'Angel Investor',
            organizationName: dynamicProfileData.organizationName || null,
            investmentFocus: focusList,
            preferredStages: stageList,
            ticketSize: dynamicProfileData.ticketSize || null,
            linkedin: dynamicProfileData.linkedin || null,
            geography: dynamicProfileData.geography || '',
            status: userStatus,
          },
        },
        { upsert: true }
      ).catch(() => {});
    }

    if (role === 'startup') {
      const { StartupApplication } = require('../../models/StartupApplication');
      await StartupApplication.findOneAndUpdate(
        { email: userDoc.email },
        {
          $set: {
            fullName: userDoc.fullName,
            email: userDoc.email,
            phone: phone || '',
            startupName: dynamicProfileData.startupName || '',
            startupStage: dynamicProfileData.startupStage || '',
            industry: dynamicProfileData.industry || '',
            yearFounded: dynamicProfileData.yearFounded || '',
            teamSize: dynamicProfileData.teamSize || '',
            city: dynamicProfileData.city || '',
            isRegistered: dynamicProfileData.isRegistered || '',
            problemStatement: dynamicProfileData.problemStatement || '',
            description: dynamicProfileData.description || '',
            status: 'approved',
          },
        },
        { upsert: true }
      ).catch(() => {});
    }

    // 'startup' role - no approval needed, stores profile as FounderApplication
    if (role === 'startup') {
      const { FounderApplication } = require('../../models/FounderApplication');
      await FounderApplication.findOneAndUpdate(
        { email: userDoc.email },
        {
          $set: {
            fullName: userDoc.fullName,
            email: userDoc.email,
            phone: phone || '',
            isStudent: dynamicProfileData.isStudent || 'No',
            designation: dynamicProfileData.designation || '',
            startupName: dynamicProfileData.startupName || '',
            startupStage: dynamicProfileData.startupStage || '',
            industry: dynamicProfileData.industry || '',
            yearsOfExperience: dynamicProfileData.yearsOfExperience || '',
            domainExpertise: dynamicProfileData.domainExpertise || '',
            city: dynamicProfileData.city || '',
            bio: dynamicProfileData.bio || '',
            linkedin: dynamicProfileData.linkedin || '',
            status: 'approved',
          },
        },
        { upsert: true }
      ).catch(() => {});
    }

    res.json({
      success: true,
      data: {
        requires_approval: requiresApproval,
        role,
        profile,
      },
    });
  })
);

// ── FCM Push Token ─────────────────────────────────────────────
router.post(
  '/fcm-token',
  authRequired,
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'token required' });
    await User.findByIdAndUpdate(req.user.userId, { $addToSet: { fcmTokens: token } });
    res.json({ success: true });
  })
);

router.delete(
  '/fcm-token',
  authRequired,
  asyncHandler(async (req, res) => {
    const { token } = req.body;
    if (token) await User.findByIdAndUpdate(req.user.userId, { $pull: { fcmTokens: token } });
    res.json({ success: true });
  })
);

// ─── CENTRALIZED PUBLIC SIGNUP OTP ROUTES ───────────────────────
// Per-phone rate limit: max 5 OTP requests per hour to prevent SMS credit drain
const publicOtpPhoneLimit = redisRateLimit({
  windowSeconds: 60 * 60,
  max: 5,
  prefix: 'rl:public-otp-phone',
  keyGenerator: req => String(req.body?.phone || '').replace(/\D/g, '') || req.ip,
});

router.post(
  '/phone/send-otp-public',
  publicOtpPhoneLimit,
  validateBody(z.object({ phone: z.string().min(6).max(20) })),
  asyncHandler(async (req, res) => {
    const { phone } = req.body;
    
    const { normalizePhone } = require('../../utils/phone');
    const parsed = normalizePhone(phone);
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.reason || 'Invalid phone number format.' });
    }
    const phoneE164 = parsed.e164;
    const cleanPhone = phoneE164.replace(/\D/g, '');
    const crypto = require('crypto');
    const { PublicOtpSession } = require('../../models/PublicOtpSession');

    const code = twoFactorService.generateOtpCode();
    const sessionId = crypto.randomUUID();

    // If utilizing mock/console SMS provider or clean phone contains mock values (strictly restricted to non-production env)
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    if (isDev && (env.SMS_PROVIDER === 'console' || cleanPhone.includes('9999999999') || cleanPhone.includes('0000000000'))) {
      await PublicOtpSession.create({
        sessionId,
        phone: cleanPhone,
        codeHash: twoFactorService.hashOtp(code),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes TTL
      });

      const { sendOtpSms } = require('../../utils/smsService');
      await sendOtpSms(phoneE164, code, 5).catch(() => {});

      return res.json({
        success: true,
        data: {
          sessionId
        }
      });
    }

    try {
      await PublicOtpSession.create({
        sessionId,
        phone: cleanPhone,
        codeHash: twoFactorService.hashOtp(code),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes TTL
      });

      const { sendOtpSms } = require('../../utils/smsService');
      await sendOtpSms(phoneE164, code, 5);

      res.json({
        success: true,
        data: {
          sessionId
        }
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message || 'Failed to dispatch verification code.'
      });
    }
  })
);

router.post(
  '/phone/verify-otp-public',
  validateBody(z.object({
    sessionId: z.string().min(1),
    code: z.string().min(4).max(8)
  })),
  asyncHandler(async (req, res) => {
    const { sessionId, code } = req.body;
    
    // Developer bypass check - ONLY active in non-production environments
    const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    if (isDev && (code === '123456' || sessionId === 'DEV_MOCK_SESSION_ID')) {
      return res.json({
        success: true,
        message: 'OTP verified successfully (Dev Bypass)'
      });
    }

    const { PublicOtpSession } = require('../../models/PublicOtpSession');
    const session = await PublicOtpSession.findOne({
      sessionId,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification session. Please request a new code.'
      });
    }

    const inputHash = twoFactorService.hashOtp(code);
    const crypto = require('crypto');
    const bufA = Buffer.from(inputHash);
    const bufB = Buffer.from(session.codeHash);
    
    if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
      session.verified = true;
      await session.save();
      
      res.json({
        success: true,
        message: 'OTP verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Incorrect verification code. Please try again.'
      });
    }
  })
);

module.exports = { authRouter: router };
