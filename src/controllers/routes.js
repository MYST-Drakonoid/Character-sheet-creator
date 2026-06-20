import { Router } from 'express';

/**
 * Main application router.
 * Defines top-level routes and mounts feature-specific route modules.
 */

// Create a new router instance.
const router = Router();

/**
 * Static page controllers.
 */
import {
    homePage,
    aboutPage,
    testErrorPage
} from './index.js';

/**
 * Authentication route modules.
 */
import registrationRoutes from './forms/registration.js';
import loginRoutes from './forms/login.js';

/**
 * Authentication controllers and middleware.
 */
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

/**
 * LEGACY: Route-specific stylesheet injection.
 * Preserved as a reference while the application's CSS is rebuilt.
 */

// // Add registration-specific styles to all registration routes
// router.use('/register', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
//     next();
// });

// // Add login-specific styles to all login routes
// router.use('/login', (req, res, next) => {
//     res.addStyle('<link rel="stylesheet" href="/css/login.css">');
//     next();
// });

/**
 * Registration routes.
 * Handles account creation and related functionality.
 */
router.use('/register', registrationRoutes);

/**
 * Basic site pages.
 */
router.get('/', homePage);
router.get('/about', aboutPage);

/**
 * Development route used to verify error handling.
 */
router.get('/test-error', testErrorPage);

/**
 * Login routes.
 * Handles authentication and session creation.
 */
router.use('/login', loginRoutes);

/**
 * Authenticated user routes.
 */
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

/**
 * Export the configured router.
 */
export default router;