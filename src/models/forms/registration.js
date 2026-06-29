import db from '../db.js';

/**
 * User account data access methods.
 *
 * Handles creation and retrieval of user records used by the
 * application's authentication system.
 *
 * TODO: Expand this model as account features are added.
 * Future additions may include:
 * - User roles and permissions
 * - Account preferences
 * - Profile information
 * - Password reset functionality
 * - Email verification
 */

/**
 * Check whether an email address is already registered.
 *
 * Used during account creation to prevent duplicate accounts.
 *
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} True if the email exists; otherwise false.
 */
const emailExists = async (email) => {
    const query = `
        SELECT EXISTS(
            SELECT 1
            FROM users
            WHERE email = $1
        ) as exists
    `;

    const result = await db.query(query, [email]);

    return result.rows[0].exists;
};

/**
 * Create a new user account.
 *
 * SECURITY:
 * Passwords must be hashed before calling this function.
 * Never store plain-text passwords.
 *
 * @param {string} name - The user's display name.
 * @param {string} email - The user's email address.
 * @param {string} hashedPassword - The securely hashed password.
 * @returns {Promise<Object>} Newly created user record without password data.
 */
const saveUser = async (name, email, hashedPassword) => {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at
    `;

    const result = await db.query(query, [name, email, hashedPassword]);

    return result.rows[0];
};

/**
 * Retrieve all registered users.
 *
 * TODO: Determine whether this function belongs in a future
 * administrative model instead of the core user model.
 *
 * TODO: Add pagination if the user base grows significantly.
 *
 * SECURITY:
 * Password fields are intentionally excluded from the query.
 *
 * @returns {Promise<Array>} Array of user records.
 */
const getAllUsers = async () => {
    const query = `
        SELECT
            id,
            name,
            email,
            created_at
        FROM users
        ORDER BY created_at DESC
    `;

    const result = await db.query(query);

    return result.rows;
};

export { emailExists, saveUser, getAllUsers };