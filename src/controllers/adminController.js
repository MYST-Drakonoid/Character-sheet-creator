import {
    validationResult
} from 'express-validator';

import {
    getAdminStats,
    getAllUsers,
    updateUser,
    findUserByEmail,
    deleteUser
} from '../models/admin.js';

export const showAdminDashboard = async (
    req,
    res,
    next
) => {
    try {
        const stats = await getAdminStats();

        res.render('admin/index', {
            title: 'Admin Dashboard',
            stats
        });
    } catch (error) {
        next(error);
    }
};

export const showUserManagement = async (
    req,
    res,
    next
) => {
    try {
        const users = await getAllUsers();

        res.render('admin/users', {
            title: 'User Management',
            users,
            error: null,
            canEditUsers:
                req.session.user.role === 'owner'
        });
    } catch (error) {
        next(error);
    }
};

export const processUserUpdate = async (
    req,
    res,
    next
) => {
    try {
        const userId = Number(req.params.id);
        const currentUserId =
            Number(req.session.user.id);

        if (
            !Number.isInteger(userId) ||
            userId < 1
        ) {
            const error = new Error(
                'Invalid user ID.'
            );

            error.status = 400;
            throw error;
        }

        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {
            const users =
                await getAllUsers();

            return res.status(400).render(
                'admin/users',
                {
                    title:
                        'User Management',

                    users,

                    error: errors
                        .array()
                        .map(
                            (item) =>
                                item.msg
                        )
                        .join(' '),

                    canEditUsers: true
                }
            );
        }

        const {
            name,
            email,
            role
        } = req.body;

        if (
            userId === currentUserId &&
            role !== 'owner'
        ) {
            const users =
                await getAllUsers();

            return res.status(400).render(
                'admin/users',
                {
                    title:
                        'User Management',

                    users,

                    error:
                        'You cannot remove your own owner role.',

                    canEditUsers: true
                }
            );
        }

        const duplicateUser =
            await findUserByEmail(
                email,
                userId
            );

        if (duplicateUser) {
            const users =
                await getAllUsers();

            return res.status(400).render(
                'admin/users',
                {
                    title:
                        'User Management',

                    users,

                    error:
                        'That email address is already in use.',

                    canEditUsers: true
                }
            );
        }

        const updatedUser =
            await updateUser({
                userId,
                name,
                email,
                role
            });

        if (!updatedUser) {
            const error = new Error(
                'User not found.'
            );

            error.status = 404;
            throw error;
        }

        /*
         * If the owner edits their own account,
         * update the session immediately.
         */
        if (userId === currentUserId) {
            req.session.user.name =
                updatedUser.name;

            req.session.user.email =
                updatedUser.email;

            req.session.user.role =
                updatedUser.role;
        }

        res.redirect('/admin/users');
    } catch (error) {
        next(error);
    }
};

export const processUserDelete = async (
    req,
    res,
    next
) => {
    try {
        const userId = Number(req.params.id);
        const currentUserId =
            Number(req.session.user.id);

        if (
            !Number.isInteger(userId) ||
            userId < 1
        ) {
            const error = new Error(
                'Invalid user ID.'
            );

            error.status = 400;
            throw error;
        }

        if (userId === currentUserId) {
            const users =
                await getAllUsers();

            return res.status(400).render(
                'admin/users',
                {
                    title:
                        'User Management',

                    users,

                    error:
                        'You cannot delete your own account from the admin page.',

                    canEditUsers: true
                }
            );
        }

        const deletedUser =
            await deleteUser(userId);

        if (!deletedUser) {
            const error = new Error(
                'User not found.'
            );

            error.status = 404;
            throw error;
        }

        res.redirect('/admin/users');
    } catch (error) {
        next(error);
    }
};