const express = require('express');
const { z } = require('zod');
const env = require('../../config/env');
const { asyncHandler } = require('../../utils/asyncHandler');
const { validateBody } = require('../../middlewares/validateBody');
const { authRequired } = require('../../middlewares/authMiddleware');
const authService = require('./auth.service.js');
const { User } = require('../users/user.model');

const router = express.Router();

const authCookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
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
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await authService.signup(req.body);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 });
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
        },
        session: { access_token: result.accessToken, refresh_token: result.refreshToken },
      },
    });
  })
);

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

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 });
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

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 });
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

router.post(
  '/oauth/facebook',
  validateBody(
    z.object({
      accessToken: z.string().min(1),
    })
  ),
  asyncHandler(async (req, res) => {
    const result = await authService.loginWithFacebook(req.body, env);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 });
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

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken || req.body?.refreshToken;
    const result = await authService.refresh(token, env);

    res.cookie('accessToken', result.accessToken, { ...authCookieOptions, maxAge: 15 * 60 * 1000 });
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
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.fullName,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
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

module.exports = { authRouter: router };
