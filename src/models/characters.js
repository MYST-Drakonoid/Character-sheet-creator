import db from './db.js';
import { body } from 'express-validator';

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

const characterValidation = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Character name is required.'),

    body('level')
        .isInt({ min: 1, max: 20 })
        .withMessage('Level must be between 1 and 20.')
        .toInt()
];

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