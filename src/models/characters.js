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

const createCharacter = async ({ userId, name, level }) => {
    const query = `
        INSERT INTO characters (
            user_id,
            name,
            level
        )
        VALUES ($1, $2, $3)
        RETURNING id, user_id, name, level, created_at
    `;

    const result = await db.query(query, [
        userId,
        name,
        level
    ]);

    return result.rows[0];
};

export { getCharactersByUserId, createCharacter };