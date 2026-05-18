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

// Export the configured router
export default router;