/**
 * Controller methods for static application pages.
 * These routes do not require database access or complex business logic.
 */

/**
 * Render the application landing page.
 * This page serves as the primary entry point for authentication.
 */
const homePage = (req, res) => {
    res.render('home', {
        title: 'Welcome Home'
    });
};

/**
 * Render the application information page.
 * Provides an overview of the character creator and its goals.
 */
const aboutPage = (req, res) => {
    res.render('about', {
        title: 'About Me'
    });
};

/**
 * Intentionally trigger a server error.
 * Used to verify custom error handling and error page rendering.
 */
const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

/**
 * Export static page controllers.
 */
export {
    homePage,
    aboutPage,
    testErrorPage
};