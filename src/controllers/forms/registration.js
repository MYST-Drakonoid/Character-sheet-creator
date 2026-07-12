import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser } from '../../models/forms/registration.js';

const router = Router();

const renderRegistrationForm = (res, values = {}, error = null) => {
    res.render('forms/registration/form', {
        title: 'Sign Up',
        error,
        name: values.name || '',
        email: values.email || '',
        emailConfirm: values.emailConfirm || ''
    });
};

/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];

/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    renderRegistrationForm(res);
};


/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array());

        renderRegistrationForm(
            res,
            req.body,
            errors.array()[0].msg
        );

        return;
    }

    const { name, email, password } = req.body;

    try {
        const existingEmail = await emailExists(email);

        if (existingEmail) {
            console.log('Email already exists');

            renderRegistrationForm(
                res,
                req.body,
                'An account with that email already exists.'
            );

            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await saveUser(name, email, hashedPassword);

        console.log('User registered successfully');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);

        renderRegistrationForm(
            res,
            req.body,
            'Something went wrong while signing up. Please try again.'
        );
    }
};



/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);

/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);



export default router;