import { Router } from 'express';

// Create a new router instance
const router = Router();

// Middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';

// Controllers
import {
    homePage,
    aboutPage,
    productsPage,      // Products page controller
    demoPage,
    testErrorPage
} from './index.js';

import {
    catalogPage,
    courseDetailPage
} from './catalog/catalog.js';

import {
    facultyPage,
    facultyDetailPage
} from './faculty/faculty.js';

import contactRoutes from './forms/contact.js';

import registrationRoutes from './forms/registration.js';

import loginRoutes from './forms/login.js';
import { processLogout, showDashboard } from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';

router.use('/faculty', (req, res, next) => {
    res.addStyle(
        '<link rel="stylesheet" href="/css/faculty.css">'
    );

    next();
});

router.use('/catalog', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
    next();
});

// Add contact-specific styles to all contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add login-specific styles to all login routes
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

// Contact form routes
router.use('/contact', contactRoutes);

// Registration routes
router.use('/register', registrationRoutes);

// ==================================================
// Basic Site Pages
// ==================================================
router.get('/', homePage);
router.get('/about', aboutPage);
router.get('/products', productsPage);

// ==================================================
// Faculty Directory
// ==================================================
router.get('/faculty', facultyPage);
router.get('/faculty/:facultyId', facultyDetailPage);

// ==================================================
// Course Catalog
// ==================================================
router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

// ==================================================
// Demo Page (uses custom middleware)
// ==================================================
router.get('/demo', addDemoHeaders, demoPage);

// ==================================================
// Test Route for 500 Errors
// ==================================================
router.get('/test-error', testErrorPage);

// Login routes (form and submission)
router.use('/login', loginRoutes);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

// Export the configured router
export default router;