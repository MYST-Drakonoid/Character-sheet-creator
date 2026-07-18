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

const createCharacter = async ({
    userId,
    name,
    level,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma
}) => {
    const query = `
        INSERT INTO characters (
            user_id,
            name,
            level,
            strength,
            dexterity,
            constitution,
            intelligence,
            wisdom,
            charisma
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
    `;

    const result = await db.query(query, [
        userId,
        name,
        level,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma
    ]);

    return result.rows[0];
};

const updateCharacter = async ({
    characterId,
    userId,
    name,
    level
}) => {
    const query = `
        UPDATE characters
        SET
            name = $1,
            level = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
          AND user_id = $4
        RETURNING id, user_id, name, level, created_at, updated_at
    `;

    const result = await db.query(query, [
        name,
        level,
        characterId,
        userId
    ]);

    return result.rows[0];
};

export { getCharactersByUserId, createCharacter, updateCharacter };