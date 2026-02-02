/**
 * SCIM (System for Cross-domain Identity Management) Service
 * User provisioning and sync for enterprise
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Enterprise = require('../models/Enterprise');
const Log = require('../models/Log');
const { recordEvent } = require('../utils/logger');
const Sentry = require('@sentry/node');

/**
 * SCIM Configuration
 */
const scimConfig = {
    version: '2.0',
    schemas: [
        'urn:ietf:params:scim:schemas:core:2.0:User',
        'urn:ietf:params:scim:schemas:core:2.0:Group',
        'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'
    ],
    resourceTypes: [
        {
            name: 'User',
            endpoint: '/Users',
            schema: 'urn:ietf:params:scim:schemas:core:2.0:User',
            schemaExtensions: [
                'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'
            ]
        },
        {
            name: 'Group',
            endpoint: '/Groups',
            schema: 'urn:ietf:params:scim:schemas:core:2.0:Group'
        }
    ]
};

/**
 * SCIM Middleware - Authentication
 */
const scimAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: 'Unauthorized',
            status: 401
        });
    }

    const token = authorization.slice(7);

    // Verify SCIM token (implement your token validation)
    if (token === process.env.SCIM_TOKEN) {
        next();
    } else {
        res.status(403).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: 'Forbidden',
            status: 403
        });
    }
};

router.use(scimAuth);

/**
 * Helper to convert MongoDB User to SCIM format
 */
const userToSCIM = (user) => {
    return {
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
        id: user._id.toString(),
        externalId: user.externalId || user._id.toString(),
        userName: user.email,
        name: {
            formatted: `${user.firstName} ${user.lastName}`,
            familyName: user.lastName,
            givenName: user.firstName,
            middleName: user.middleName || '',
            honorificPrefix: '',
            honorificSuffix: ''
        },
        displayName: `${user.firstName} ${user.lastName}`,
        emails: [
            {
                value: user.email,
                type: 'work',
                primary: true
            },
            ...(user.secondaryEmail ? [{ value: user.secondaryEmail, type: 'home' }] : [])
        ],
        phoneNumbers: user.phone ? [{ value: user.phone, type: 'work' }] : [],
        active: user.status === 'active',
        groups: user.groupIds || [],
        meta: {
            resourceType: 'User',
            created: user.createdAt,
            lastModified: user.updatedAt,
            location: `${process.env.API_URL}/scim/v2/Users/${user._id}`
        },
        'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User': {
            employeeNumber: user.employeeNumber,
            costCenter: user.costCenter,
            organization: user.organization,
            organizationalUnit: user.organizationalUnit,
            department: user.department,
            manager: user.manager ? {
                value: user.manager._id.toString(),
                $ref: `${process.env.API_URL}/scim/v2/Users/${user.manager._id}`
            } : undefined
        }
    };
};

/**
 * Helper to convert SCIM format to MongoDB User
 */
const scimToUser = (scimUser) => {
    const user = {
        email: scimUser.userName,
        firstName: scimUser.name?.givenName || '',
        lastName: scimUser.name?.familyName || '',
        middleName: scimUser.name?.middleName,
        externalId: scimUser.externalId,
        status: scimUser.active ? 'active' : 'inactive',
        phone: scimUser.phoneNumbers?.[0]?.value,
        secondaryEmail: scimUser.emails?.find(e => e.type === 'home')?.value
    };

    const enterprise = scimUser['urn:ietf:params:scim:schemas:extension:enterprise:2.0:User'];
    if (enterprise) {
        user.employeeNumber = enterprise.employeeNumber;
        user.costCenter = enterprise.costCenter;
        user.organization = enterprise.organization;
        user.organizationalUnit = enterprise.organizationalUnit;
        user.department = enterprise.department;
    }

    return user;
};

/**
 * GET /scim/v2/Users
 * List users with filtering, sorting, pagination
 */
router.get('/Users', async (req, res) => {
    try {
        const {
            filter,
            startIndex = 1,
            count = 20,
            sortBy,
            sortOrder = 'ascending'
        } = req.query;

        // Parse filter (e.g., "userName eq \"user@example.com\"")
        const query = {};
        if (filter) {
            const [field, operator, value] = filter.split(' ');
            const fieldMap = {
                'userName': 'email',
                'displayName': 'displayName',
                'emails': 'email',
                'active': 'status'
            };

            const mongoField = fieldMap[field] || field;

            switch (operator) {
            case 'eq':
                query[mongoField] = value.replace(/"/g, '');
                break;
            case 'contains':
                query[mongoField] = { $regex: value.replace(/"/g, ''), $options: 'i' };
                break;
            case 'startsWith':
                query[mongoField] = { $regex: `^${value.replace(/"/g, '')}`, $options: 'i' };
                break;
            }
        }

        // Sort
        const sortOptions = {};
        if (sortBy) {
            const mongoField = sortBy === 'userName' ? 'email' : sortBy;
            sortOptions[mongoField] = sortOrder === 'ascending' ? 1 : -1;
        }

        // Pagination
        const skip = (startIndex - 1) * count;
        const limit = parseInt(count);

        // Fetch users
        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalResults = await User.countDocuments(query);

        // Format response
        const resources = users.map(userToSCIM);

        res.json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
            totalResults,
            startIndex: parseInt(startIndex),
            itemsPerPage: limit,
            Resources: resources
        });

        recordEvent('scim_users_listed', {
            count: users.length,
            filter
        });

    } catch (error) {
        Sentry.captureException(error, { tags: { feature: 'scim_list' } });
        res.status(500).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: error.message,
            status: 500
        });
    }
});

/**
 * GET /scim/v2/Users/:id
 * Get specific user
 */
router.get('/Users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
                detail: 'User not found',
                status: 404
            });
        }

        res.json(userToSCIM(user));

        recordEvent('scim_user_retrieved', { userId: user._id });

    } catch (error) {
        Sentry.captureException(error);
        res.status(500).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: error.message,
            status: 500
        });
    }
});

/**
 * POST /scim/v2/Users
 * Create new user
 */
router.post('/Users', async (req, res) => {
    try {
        const scimUser = req.body;
        const userData = scimToUser(scimUser);

        // Check if user already exists
        const existing = await User.findOne({ email: userData.email });
        if (existing) {
            return res.status(409).json({
                schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
                detail: 'User already exists',
                status: 409
            });
        }

        // Create user
        const user = await User.create({
            ...userData,
            ssoProvider: 'scim',
            isEmailVerified: true,
            status: 'active'
        });

        res.status(201).json(userToSCIM(user));

        recordEvent('scim_user_created', {
            userId: user._id,
            email: user.email
        });

    } catch (error) {
        Sentry.captureException(error, { tags: { feature: 'scim_create' } });
        res.status(400).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: error.message,
            status: 400
        });
    }
});

/**
 * PUT /scim/v2/Users/:id
 * Update user (replace)
 */
router.put('/Users/:id', async (req, res) => {
    try {
        const scimUser = req.body;
        const userData = scimToUser(scimUser);

        const user = await User.findByIdAndUpdate(
            req.params.id,
            userData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
                detail: 'User not found',
                status: 404
            });
        }

        res.json(userToSCIM(user));

        recordEvent('scim_user_updated', {
            userId: user._id,
            email: user.email
        });

    } catch (error) {
        Sentry.captureException(error, { tags: { feature: 'scim_update' } });
        res.status(400).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: error.message,
            status: 400
        });
    }
});

/**
 * PATCH /scim/v2/Users/:id
 * Update user (partial)
 */
router.patch('/Users/:id', async (req, res) => {
    try {
        const { Operations } = req.body;

        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
                detail: 'User not found',
                status: 404
            });
        }

        // Apply PATCH operations
        for (const op of Operations) {
            if (op.op === 'replace') {
                const path = op.path.split('.');
                let target = user;

                for (let i = 0; i < path.length - 1; i++) {
                    target = target[path[i]];
                }

                target[path[path.length - 1]] = op.value;
            }
        }

        user = await user.save();

        res.json(userToSCIM(user));

        recordEvent('scim_user_patched', {
            userId: user._id,
            operations: Operations.length
        });

    } catch (error) {
        Sentry.captureException(error, { tags: { feature: 'scim_patch' } });
        res.status(400).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: error.message,
            status: 400
        });
    }
});

/**
 * DELETE /scim/v2/Users/:id
 * Delete user
 */
router.delete('/Users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
                detail: 'User not found',
                status: 404
            });
        }

        res.status(204).send();

        recordEvent('scim_user_deleted', {
            userId: user._id,
            email: user.email
        });

    } catch (error) {
        Sentry.captureException(error, { tags: { feature: 'scim_delete' } });
        res.status(500).json({
            schemas: ['urn:ietf:params:scim:api:messages:2.0:Error'],
            detail: error.message,
            status: 500
        });
    }
});

/**
 * GET /scim/v2/.well-known/scim-configuration
 * SCIM Configuration Endpoint
 */
router.get('/.well-known/scim-configuration', (req, res) => {
    res.json({
        schemas: ['urn:ietf:params:scim:schemas:core:2.0:ServiceProviderConfig'],
        documentationUri: `${process.env.API_URL}/docs/scim`,
        patch: {
            supported: true
        },
        bulk: {
            supported: true,
            maxOperations: 1000,
            maxPayloadSize: 104857600
        },
        changePassword: {
            supported: true
        },
        sort: {
            supported: true
        },
        etag: {
            supported: true
        },
        filter: {
            supported: true,
            maxResults: 100
        },
        authentication: [
            {
                type: 'oauthbearertoken',
                name: 'OAuth Bearer Token',
                description: 'Authentication via OAuth Bearer Token'
            }
        ]
    });
});

/**
 * GET /scim/v2/ResourceTypes
 * List resource types
 */
router.get('/ResourceTypes', (req, res) => {
    res.json({
        schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
        totalResults: scimConfig.resourceTypes.length,
        itemsPerPage: scimConfig.resourceTypes.length,
        startIndex: 1,
        Resources: scimConfig.resourceTypes
    });
});

/**
 * GET /scim/v2/Schemas
 * List schemas
 */
router.get('/Schemas', (req, res) => {
    res.json({
        schemas: ['urn:ietf:params:scim:api:messages:2.0:ListResponse'],
        totalResults: scimConfig.schemas.length,
        Resources: scimConfig.schemas.map(schema => ({
            id: schema,
            name: schema,
            description: `${schema} Schema`
        }))
    });
});

/**
 * SCIM Service Class
 */
class SCIMService {
    /**
     * Bulk import users
     */
    static async bulkImportUsers(users) {
        try {
            const results = [];

            for (const scimUser of users) {
                try {
                    const userData = scimToUser(scimUser);
                    const user = await User.create({
                        ...userData,
                        ssoProvider: 'scim',
                        isEmailVerified: true
                    });

                    results.push({
                        status: 'success',
                        user: userToSCIM(user)
                    });
                } catch (error) {
                    results.push({
                        status: 'error',
                        error: error.message
                    });
                }
            }

            recordEvent('scim_bulk_import', {
                count: users.length,
                successful: results.filter(r => r.status === 'success').length
            });

            return results;
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }

    /**
     * Export users
     */
    static async exportUsers(filters = {}) {
        try {
            const users = await User.find(filters);
            return users.map(userToSCIM);
        } catch (error) {
            Sentry.captureException(error);
            throw error;
        }
    }
}

module.exports = {
    router,
    SCIMService,
    scimConfig
};
