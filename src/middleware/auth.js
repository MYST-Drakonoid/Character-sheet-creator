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
const requireLogin = (
    req,
    res,
    next
) => {
    if (!req.session?.user) {
        return res.redirect('/login');
    }

    res.locals.isLoggedIn = true;
    next();
};

const requireRole = (
    ...allowedRoles
) => {
    return (req, res, next) => {
        const user = req.session?.user;

        if (!user) {
            return res.redirect('/login');
        }

        if (!allowedRoles.includes(user.role)) {
            const error = new Error(
                'You do not have permission to access this page.'
            );

            error.status = 403;
            return next(error);
        }

        next();
    };
};

const requireOwner = requireRole('owner');

const requireStaff = requireRole(
    'owner',
    'moderator'
);

export { requireLogin, requireRole, requireOwner, requireStaff };