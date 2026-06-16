import db from '../db.js';

const saveContactForm = async (name, email, message) => {
    const sql = `
        INSERT INTO contact_form (
            name,
            email,
            message
        )
        VALUES (
            $1,
            $2,
            $3
        )
    `;

    await db.query(sql, [
        name,
        email,
        message
    ]);
};

const getAllContactForms = async () => {
    const sql = `
        SELECT
            id,
            name,
            email,
            message,
            created_at
        FROM contact_form
        ORDER BY created_at DESC
    `;

    const result = await db.query(sql);

    return result.rows;
};

export {
    saveContactForm,
    getAllContactForms
};