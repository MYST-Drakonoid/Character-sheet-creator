import { body, validationResult } from 'express-validator';
import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { Router } from 'express';

const router = Router();

/**
 * Validation rules for the Log In form.
 *
 * TODO: Consider improving password validation message.
 * Current rule checks for length, but the message says "Password is required."
 */
const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password is required')
];

/**
 * Display the Log In form.
 */
const showLoginForm = (req, res) => {
  if (req.session?.user) {
    return res.redirect('/dashboard');
  }

  return res.render('forms/login/form', {
    title: 'Log In',
    email: '',
    error: null
  });
};
/**
 * Process Log In form submission.
 */
const processLogin = async (req, res) => {
    const errors = validationResult(req);

    /**
     * If validation fails, return the user to the Log In form.
     * The submitted email is preserved, but the password is not.
     */
    if (!errors.isEmpty()) {
        console.log(errors.array());

        res.render('forms/login/form', {
            title: 'Log In',
            email: req.body.email || '',
            error: 'Please enter a valid email and password.'
        });

        return;
    }

    const { email, password } = req.body;

    try {
        /**
         * Look up the user account by email.
         */
        const user = await findUserByEmail(email);

        /**
         * Do not reveal whether the email or password was wrong.
         */
        if (!user) {
            console.log('User not found');

            res.render('forms/login/form', {
                title: 'Log In',
                email,
                error: 'Invalid email or password.'
            });

            return;
        }

        /**
         * Verify the submitted password against the stored password hash.
         */
        const passMatch = await verifyPassword(password, user.password);

        if (!passMatch) {
            console.log('Invalid password');

            res.render('forms/login/form', {
                title: 'Log In',
                email,
                error: 'Invalid email or password.'
            });

            return;
        }

        /**
         * SECURITY: Remove password before storing user data in session.
         */
        const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
        };

        req.session.regenerate((sessionError) => {
        if (sessionError) {
            console.error('Session regeneration failed:', sessionError);

            return res.status(500).render('forms/login/form', {
            title: 'Log In',
            email,
            error: 'Something went wrong while logging in.'
            });
        }

        req.session.user = sessionUser;

        req.session.save((saveError) => {
            if (saveError) {
            console.error('Session save failed:', saveError);

            return res.status(500).render('forms/login/form', {
                title: 'Log In',
                email,
                error: 'Something went wrong while logging in.'
            });
            }

            return res.redirect('/dashboard');
        });
        });
    } catch (error) {
        console.log('error logging in:', error);

        /**
         * If something unexpected fails, preserve the submitted email
         * and show a generic error message.
         */
        res.render('forms/login/form', {
            title: 'Log In',
            email: req.body.email || '',
            error: 'Something went wrong while logging in. Please try again.'
        });
    }
};

/**
 * Handle user logout.
 *
 * NOTE: connect.sid is the default session cookie name because no custom
 * session cookie name is currently configured in server.js.
 *
 * TODO: Update this note if a custom session cookie name is added later.
 */
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    /**
     * Destroy the session in the session store.
     */
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);

            /**
             * Clear the browser cookie even if server-side session destruction fails.
             */
            res.clearCookie('connect.sid');

            /**
             * TODO: Decide whether logout failure should redirect home
             * or show a real server error in production.
             */
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

/**
 * Display the protected dashboard.
 *
 * Requires requireLogin middleware before this route.
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    /**
     * Security cleanup in case password data accidentally reaches the session.
     *
     * TODO: Remove this defensive cleanup once session user shape is finalized
     * and tested.
     */
    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }

    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

/**
 * Log In routes.
 */
router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

/**
 * Export router and root-level authentication handlers.
 */
export default router;
export { processLogout, showDashboard };