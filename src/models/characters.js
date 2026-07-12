import db from './db.js';

/**
 * Retrieve all characters owned by one user.
 *
 * @param {number} userId - Logged-in user's database ID.
 * @returns {Promise<Array>} Characters owned by that user.
 */
const getCharactersByUserId = async (userId) => {
    const query = `
        SELECT
            id,
            name,
            level,
            created_at,
            updated_at
        FROM characters
        WHERE user_id = $1
        ORDER BY created_at DESC
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
};

export { getCharactersByUserId };