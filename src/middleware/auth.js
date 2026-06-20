/**
 * Authentication middleware for protected routes.
 *
 * Verifies that a valid user session exists before allowing access
 * to application features that require authentication.
 *
 * Current authentication model:
 * - Session-based authentication
 * - User data stored on req.session.user
 *
 * Future enhancements may include:
 * - Role-based access control
 * - Permission-based authorization
 * - Character ownership validation
 * - Administrative access levels
 */
const requireLogin = (req, res, next) => {
    /**
     * Check whether the current request has an active authenticated session.
     */
    if (req.session && req.session.user) {
        /**
         * Expose authentication status to EJS views so navigation
         * and page content can adjust accordingly.
         */
        res.locals.isLoggedIn = true;

        /**
         * Continue processing the requested route.
         */
        next();
    } else {
        /**
         * Unauthenticated users are redirected to the login page.
         */
        res.redirect('/login');
    }
};

export { requireLogin };