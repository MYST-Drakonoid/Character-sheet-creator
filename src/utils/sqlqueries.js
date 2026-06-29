import db from '../models/db.js';

/**
 * Generic insert helper.
 */
export const insertRecord = async (table, data) => {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`);

    const query = `
        INSERT INTO ${table} (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *;
    `;

    const result = await db.query(query, values);
    return result.rows[0];
};

/**
 * Get all rows from a table.
 */
export const getAllRecords = async (table, orderBy = 'id') => {
    const query = `
        SELECT *
        FROM ${table}
        ORDER BY ${orderBy};
    `;

    const result = await db.query(query);
    return result.rows;
};

/**
 * Get one row by id.
 */
export const getRecordById = async (table, id) => {
    const query = `
        SELECT *
        FROM ${table}
        WHERE id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

/**
 * Get character by id and logged-in user.
 */
export const getCharacterById = async (characterId, userId) => {
    const query = `
        SELECT *
        FROM characters
        WHERE id = $1
          AND user_id = $2;
    `;

    const result = await db.query(query, [characterId, userId]);
    return result.rows[0];
};

/**
 * Get a character's child-table records.
 */
export const getCharacterChildRecords = async (table, characterId, userId, orderBy = 'id') => {
    const query = `
        SELECT child.*
        FROM ${table} child
        JOIN characters ch
            ON child.character_id = ch.id
        WHERE child.character_id = $1
          AND ch.user_id = $2
        ORDER BY ${orderBy};
    `;

    const result = await db.query(query, [characterId, userId]);
    return result.rows;
};