import { Router } from 'express';
import { body } from 'express-validator';

import {
    showAdminDashboard,
    showUserManagement,
    processUserUpdate,
    processUserDelete
} from '../controllers/adminController.js';

import {
    requireOwner,
    requireStaff
} from '../middleware/auth.js';

const router = Router();

router.get(
    '/',
    requireOwner,
    showAdminDashboard
);

router.get(
    '/users',
    requireStaff,
    showUserManagement
);

router.post(
    '/users/:id/update',
    requireOwner,

    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters.'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required.')
        .normalizeEmail(),

    body('role')
        .isIn([
            'owner',
            'moderator',
            'user'
        ])
        .withMessage('Invalid role.'),

    processUserUpdate
);

router.post(
    '/users/:id/delete',
    requireOwner,
    processUserDelete
);

export default router;