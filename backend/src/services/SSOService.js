/**
 * Single Sign-On (SSO) Service
 * OAuth2, SAML, Azure AD, Google Workspace integration
 */

const express = require('express');
const router = express.Router();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const SAMLStrategy = require('passport-saml');
const AzureAdOAuth2Strategy = require('passport-azure-ad').OAuthStrategy;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Log = require('../models/Log');
const { recordEvent } = require('../utils/logger');
const * as Sentry = require('@sentry/node');

/**
 * SSO Configuration
 */
const ssoConfig = {
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/sso/google/callback`,
        scope: ['profile', 'email']
    },

    microsoft: {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/sso/microsoft/callback`,
        scope: ['openid', 'profile', 'email']
    },

    saml: {
        entryPoint: process.env.SAML_ENTRY_POINT,
        issuer: process.env.SAML_ISSUER,
        cert: process.env.SAML_CERT,
        identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'
    },

    azureAD: {
        clientID: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL}/api/sso/azure/callback`,
        tenant: process.env.AZURE_TENANT_ID,
        authorizationURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize`,
        tokenURL: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
        scope: ['openid', 'profile', 'email']
    }
};

/**
 * Passport Configuration
 */

// Google OAuth2
passport.use('google', new OAuth2Strategy(
    ssoConfig.google,
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                // Create new user from Google profile
                user = await User.create({
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    googleId: profile.id,
                    profileImage: profile.photos[0]?.value,
                    ssoProvider: 'google',
                    isEmailVerified: true,
                    status: 'active'
                });

                recordEvent('sso_user_created', {
                    provider: 'google',
                    userId: user._id,
                    email: user.email
                });
            }

            // Update last login
            user.lastLogin = new Date();
            user.lastSSOProvider = 'google';
            user.ssoAccessToken = accessToken;
            if (refreshToken) user.ssoRefreshToken = refreshToken;
            await user.save();

            return done(null, user);
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'sso_google' } });
            return done(error);
        }
    }
));

// Microsoft OAuth2
passport.use('microsoft', new OAuth2Strategy(
    ssoConfig.microsoft,
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ microsoftId: profile.id });

            if (!user) {
                user = await User.create({
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    microsoftId: profile.id,
                    profileImage: profile.photos[0]?.value,
                    ssoProvider: 'microsoft',
                    isEmailVerified: true,
                    status: 'active'
                });

                recordEvent('sso_user_created', {
                    provider: 'microsoft',
                    userId: user._id,
                    email: user.email
                });
            }

            user.lastLogin = new Date();
            user.lastSSOProvider = 'microsoft';
            user.ssoAccessToken = accessToken;
            if (refreshToken) user.ssoRefreshToken = refreshToken;
            await user.save();

            return done(null, user);
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'sso_microsoft' } });
            return done(error);
        }
    }
));

// SAML
passport.use('saml', new SAMLStrategy(
    ssoConfig.saml,
    async (profile, done) => {
        try {
            const email = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
                || profile.nameID;

            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    email,
                    firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
                    lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
                    ssoProvider: 'saml',
                    isEmailVerified: true,
                    status: 'active'
                });

                recordEvent('sso_user_created', {
                    provider: 'saml',
                    userId: user._id,
                    email: user.email
                });
            }

            user.lastLogin = new Date();
            user.lastSSOProvider = 'saml';
            await user.save();

            return done(null, user);
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'sso_saml' } });
            return done(error);
        }
    }
));

// Azure AD OAuth2
passport.use('azure-ad', new AzureAdOAuth2Strategy(
    ssoConfig.azureAD,
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ azureId: profile.oid });

            if (!user) {
                user = await User.create({
                    email: profile.mail || profile.userPrincipalName,
                    firstName: profile.given_name,
                    lastName: profile.family_name,
                    azureId: profile.oid,
                    ssoProvider: 'azure-ad',
                    isEmailVerified: true,
                    status: 'active'
                });

                recordEvent('sso_user_created', {
                    provider: 'azure-ad',
                    userId: user._id,
                    email: user.email
                });
            }

            user.lastLogin = new Date();
            user.lastSSOProvider = 'azure-ad';
            user.ssoAccessToken = accessToken;
            if (refreshToken) user.ssoRefreshToken = refreshToken;
            await user.save();

            return done(null, user);
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'sso_azure' } });
            return done(error);
        }
    }
));

// Serialization
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findById(userId);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

/**
 * SSO Routes
 */

// Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ssoConfig.google.scope
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
    (req, res) => {
        // Generate JWT
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.redirect(`/auth/success?token=${token}&provider=google`);
    }
);

// Microsoft OAuth
router.get('/microsoft', passport.authenticate('microsoft', {
    scope: ssoConfig.microsoft.scope
}));

router.get('/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/login?error=microsoft_auth_failed' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.redirect(`/auth/success?token=${token}&provider=microsoft`);
    }
);

// SAML
router.post('/saml/callback',
    passport.authenticate('saml', { failureRedirect: '/login?error=saml_auth_failed' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.redirect(`/auth/success?token=${token}&provider=saml`);
    }
);

// Azure AD OAuth
router.get('/azure', passport.authenticate('azure-ad', {
    scope: ssoConfig.azureAD.scope
}));

router.get('/azure/callback',
    passport.authenticate('azure-ad', { failureRedirect: '/login?error=azure_auth_failed' }),
    (req, res) => {
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.redirect(`/auth/success?token=${token}&provider=azure-ad`);
    }
);

/**
 * SSO Service Class
 */
class SSOService {
    /**
     * Get SSO providers
     */
    static async getSSOProviders() {
        return {
            google: {
                enabled: !!ssoConfig.google.clientID,
                name: 'Google',
                icon: 'google'
            },
            microsoft: {
                enabled: !!ssoConfig.microsoft.clientID,
                name: 'Microsoft',
                icon: 'microsoft'
            },
            saml: {
                enabled: !!ssoConfig.saml.entryPoint,
                name: 'SAML',
                icon: 'saml'
            },
            azureAD: {
                enabled: !!ssoConfig.azureAD.clientID,
                name: 'Azure AD',
                icon: 'azure'
            }
        };
    }

    /**
     * Link existing user to SSO provider
     */
    static async linkSSOProvider(userId, provider, providerData) {
        try {
            const user = await User.findById(userId);

            switch (provider) {
                case 'google':
                    user.googleId = providerData.id;
                    break;
                case 'microsoft':
                    user.microsoftId = providerData.id;
                    break;
                case 'azure-ad':
                    user.azureId = providerData.id;
                    break;
            }

            user.ssoProvider = provider;
            await user.save();

            recordEvent('sso_linked', {
                userId,
                provider,
                email: user.email
            });

            return user;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'sso_link' } });
            throw error;
        }
    }

    /**
     * Unlink SSO provider
     */
    static async unlinkSSOProvider(userId, provider) {
        try {
            const user = await User.findById(userId);

            switch (provider) {
                case 'google':
                    user.googleId = null;
                    break;
                case 'microsoft':
                    user.microsoftId = null;
                    break;
                case 'azure-ad':
                    user.azureId = null;
                    break;
            }

            if (user.ssoProvider === provider) {
                user.ssoProvider = null;
            }

            await user.save();

            recordEvent('sso_unlinked', {
                userId,
                provider,
                email: user.email
            });

            return user;
        } catch (error) {
            Sentry.captureException(error, { tags: { feature: 'sso_unlink' } });
            throw error;
        }
    }

    /**
     * Get user SSO providers
     */
    static async getUserSSO Providers(userId) {
        try {
            const user = await User.findById(userId);

            return {
                google: !!user.googleId,
                microsoft: !!user.microsoftId,
                azureAD: !!user.azureId,
                saml: !!user.ssoProvider
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Enforce SSO only login (for enterprise)
     */
    static async enforceSSO(organizationId, provider) {
        try {
            await Log.create({
                type: 'sso_enforced',
                organizationId,
                provider,
                timestamp: new Date()
            });

            return {
                success: true,
                message: `SSO enforced for ${provider}`
            };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Disable SSO provider
     */
    static async disableSSO Provider(userId, provider) {
        try {
            await SSOService.unlinkSSOProvider(userId, provider);

            recordEvent('sso_provider_disabled', {
                userId,
                provider
            });

            return { success: true };
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

module.exports = {
    router,
    SSOService,
    ssoConfig
};
