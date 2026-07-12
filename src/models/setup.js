import db from './db.js';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize the application database.
 *
 * Executes the project's seed.sql file to create the database
 * schema and any default data required by the application.
 *
 * TODO:
 * - Decide later whether to skip seeding if the database
 *   has already been initialized.
 */
const setupDatabase = async () => {
    console.log('Initializing database...');

    const result = await db.query(`
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_name = 'users'
        ) AS exists;
    `);

    if (!result.rows[0].exists) {
        const seedPath = join(__dirname, 'sql', 'seed.sql');
        const seedSQL = fs.readFileSync(seedPath, 'utf8');

        await db.query(seedSQL);

        console.log('Database initialized successfully.');
    } else {
        console.log('Database already initialized.');
    }

    return true;
};

/**
 * Test the database connection.
 */
const testConnection = async () => {
    const result = await db.query('SELECT NOW() AS current_time');

    console.log(
        'Database connection successful:',
        result.rows[0].current_time
    );

    return true;
};

export { setupDatabase, testConnection };