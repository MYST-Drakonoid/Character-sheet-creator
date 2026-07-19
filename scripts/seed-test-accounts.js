import 'dotenv/config';
import bcrypt from 'bcrypt';

import pool from '../src/models/db.js';

const TEST_PASSWORD = 'P@$$w0rd!';

const accounts = [
    {
        name: 'Administrator',
        email: 'Admin@test.com',
        role: 'owner'
    },
    {
        name: 'Moderator',
        email: 'Mod@test.com',
        role: 'moderator'
    }
];

async function seedAccounts() {
    try {
        const hashedPassword = await bcrypt.hash(
            TEST_PASSWORD,
            10
        );

        for (const account of accounts) {
            const existingUser = await pool.query(
                `
                SELECT id
                FROM users
                WHERE LOWER(email) = LOWER($1)
                `,
                [account.email]
            );

            if (existingUser.rows.length > 0) {
                await pool.query(
                    `
                    UPDATE users
                    SET role = $1
                    WHERE LOWER(email) = LOWER($2)
                    `,
                    [
                        account.role,
                        account.email
                    ]
                );

                console.log(
                    `Updated ${account.email}`
                );

                continue;
            }

            await pool.query(
                `
                INSERT INTO users (
                    name,
                    email,
                    password,
                    role
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4
                )
                `,
                [
                    account.name,
                    account.email,
                    hashedPassword,
                    account.role
                ]
            );

            console.log(
                `Created ${account.email}`
            );
        }

        console.log('\nDone!');
    } catch (error) {
        console.error(error);
    } finally {
        await pool.end();
    }
}

seedAccounts();