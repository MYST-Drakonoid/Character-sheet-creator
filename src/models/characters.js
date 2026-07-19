import db from './db.js';

/**
 * Retrieve all characters owned by one user.
 *
 * @param {number} userId - Logged-in user's database ID.
 * @returns {Promise<Array>} Characters owned by that user.
 */
const getCharactersByUserId = async (
    userId,
    sort = 'created'
) => {
    const sortOptions = {
        name: 'name ASC',
        level: 'level DESC',
        created: 'created_at DESC',
        updated: 'updated_at DESC'
    };

    const orderBy =
        sortOptions[sort] || sortOptions.created;

    const query = `
        SELECT
            id,
            name,
            level,
            created_at,
            updated_at
        FROM characters
        WHERE user_id = $1
        ORDER BY ${orderBy}
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
    level,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma
}) => {
    const query = `
        UPDATE characters
        SET
            name = $1,
            level = $2,
            strength = $3,
            dexterity = $4,
            constitution = $5,
            intelligence = $6,
            wisdom = $7,
            charisma = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
          AND user_id = $10
        RETURNING id, user_id, name, level, created_at, updated_at
    `;

    const result = await db.query(query, [
        name,
        level,
        strength,
        dexterity,
        constitution,
        intelligence,
        wisdom,
        charisma,
        characterId,
        userId
    ]);

    return result.rows[0];
};

const deleteCharacter = async (
    characterId,
    userId
) => {
    const query = `
        DELETE FROM characters
        WHERE id = $1
          AND user_id = $2
        RETURNING id
    `;

    const result = await db.query(query, [
        characterId,
        userId
    ]);

    return result.rows[0];
};

export { getCharactersByUserId, createCharacter, updateCharacter, deleteCharacter };