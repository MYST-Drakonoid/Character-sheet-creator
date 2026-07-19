import pool from './db.js';

export const getAllUsers = async () => {
    const query = `
        SELECT
            users.id,
            users.name,
            users.email,
            users.role,
            users.created_at,
            COUNT(characters.id) AS character_count
        FROM users
        LEFT JOIN characters
            ON characters.user_id = users.id
        GROUP BY users.id
        ORDER BY users.created_at DESC
    `;

    const result = await pool.query(query);
    return result.rows;
};

export const getAdminStats = async () => {
    const query = `
        SELECT
            (
                SELECT COUNT(*)
                FROM users
            ) AS user_count,

            (
                SELECT COUNT(*)
                FROM characters
            ) AS character_count,

            (
                SELECT COUNT(*)
                FROM users
                WHERE role = 'owner'
            ) AS owner_count,

            (
                SELECT COUNT(*)
                FROM users
                WHERE role = 'moderator'
            ) AS moderator_count
    `;

    const result = await pool.query(query);

    return result.rows[0];
};

export const updateUser = async ({
    userId,
    name,
    email,
    role
}) => {
    const query = `
        UPDATE users
        SET
            name = $1,
            email = $2,
            role = $3
        WHERE id = $4
        RETURNING
            id,
            name,
            email,
            role
    `;

    const result = await pool.query(query, [
        name,
        email,
        role,
        userId
    ]);

    return result.rows[0];
};

export const findUserByEmail = async (
    email,
    excludedUserId
) => {
    const query = `
        SELECT id
        FROM users
        WHERE LOWER(email) = LOWER($1)
          AND id <> $2
    `;

    const result = await pool.query(query, [
        email,
        excludedUserId
    ]);

    return result.rows[0];
};

export const deleteUser = async (
    userId
) => {
    const query = `
        DELETE FROM users
        WHERE id = $1
        RETURNING
            id,
            name,
            email,
            role
    `;

    const result = await pool.query(query, [
        userId
    ]);

    return result.rows[0];
};