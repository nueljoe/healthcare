import crypto from 'crypto';
import moment from 'moment';
import knex from '../database';
import { ClientError, NotFoundError, PermissionError } from '../errors';
import _bcrypt from '../utils/_bcrypt';
import { makeToken } from '../utils/_jwt';
import mailer from '../utils/mailer';
import env from '../utils/env';

export default {
    /**
     * Creates a new account
     */
    async createAccount(req, res, next) {
        const { body } = req;
        const transaction = await knex.transaction();

        try {
            const userWithSameEmail = await knex.first('id').from('users').where('email', body.email);

            if (userWithSameEmail) {
                throw new ClientError('An account exists with this email');
            }

            if (body.password !== body.confirm_password) {
                throw new ClientError('Passwords do not match');
            }

            const encryptedPassword = await _bcrypt.hash(body.password);

            const tokenPayload = JSON.stringify({ email: body.email, date: new Date().toString() });
            const confirmationToken = crypto.createHmac('sha256', tokenPayload, { encoding: 'utf-8' })
                                        .update('token')
                                        .digest('hex');

            const permission = await knex.first('id').from('permissions').where('label', 'member');

            const [userId] = await knex('users')
                .transacting(transaction)
                .insert({
                    email: body.email,
                    password: encryptedPassword,
                    permission_id: permission.id,
                    confirmation_token: confirmationToken
                });            

            await Promise.all([
                knex('user_profiles')
                    .transacting(transaction)
                    .insert({
                        first_name: body.first_name,
                        last_name: body.last_name,
                        user_id: userId
                    }, ['last_name', 'first_name']),

                knex('subscribers')
                    .transacting(transaction)
                    .insert({
                        email: body.email,
                    })
            ]);

            await mailer.sendAccountVerification({
                first_name: body.first_name,
                last_name: body.last_name,
                email: body.email,
                verification_url: `${env.get('FRONTEND_BASEURL')}/auth/verify?token=${confirmationToken}`
            });

            await transaction.commit();

            res.status(201).json({
                status: 'success',
                message: 'Account successfully created',
                data: {
                    id: userId,
                    email: body.email
                }
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },

    /**
     * Verify an account
     */
    async verifyAccount(req, res, next) {
        const { query: { token } } = req;
        const genericErrorMsg = 'Invalid token provided.';

        try {
            if (!token) {
                throw new ClientError(genericErrorMsg);
            }

            const user = await knex.first(['id', 'email'])
                .from('users')
                .where('confirmation_token', token);

            console.log(user)

            if (!user) {
                throw new ClientError(genericErrorMsg);
            }

            await knex('users')
                .where('id', user.id)
                .update({
                    verified_at: new Date(),
                    confirmation_token: null,
                    last_logged_in_at: new Date(),
                });
            
            const payload = { id: user.id, email: user.email };

            res.status(200).json({
                status: 'success',
                message: 'You have successfully verified your account.',
                data: {
                    ...payload,
                    token: makeToken(payload)
                }
                })
        } catch (error) {
            next(error);
        }
    },

    /**
     * Sign in a user
     */
    async signIn(req, res, next) {
        const { body } = req;
        const genericErrorMsg = 'Email or password is incorrect';

        try {
            const user = await knex.first().from('users').where('email', body.email);

            if (!user) {
                throw new ClientError(genericErrorMsg);
            }

            const passwordMatch = await _bcrypt.compare(body.password, user.password);

            if (!passwordMatch) {
                throw new ClientError(genericErrorMsg);
            }

            const payload = { id: user.id, email: user.email };

            res.status(200).json({
                status: 'success',
                message: 'Signed in successfully',
                data: {
                    ...payload,
                    token: makeToken(payload)
                }
            })
        } catch (error) {
            next(error);
        }
    },

    /**
     * Implements the functionality that allows a user to change their password by providing the current
     * one and a new one
     */
    async changePassword(req, res, next) {
        const { user, body } = req;

        try {
            const currentPasswordIsValid = await _bcrypt.compare(body.current_password, user.password);

            if (!currentPasswordIsValid) {
                throw new ClientError('Current password provided is incorrect');
            }

            if (body.new_password !== body.confirm_password) {
                throw new ClientError('Passwords do not match');
            }

            const encryptedPassword = await _bcrypt.hash(body.new_password);

            await knex('users')
                .where('id', user.id)
                .update({ password: encryptedPassword });

            res.status(200).json({
                status: 'success',
                message: 'Password was updated successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Resends the verification mail
     */
    async resendVerification(req, res, next) {
        const { query: { email } } = req;

        try {
            if (!email) {
                throw new ClientError('Please provide an email address');
            }

            const user = await knex.first(['user.id', 'user.verified_at', 'profile.first_name', 'profile.last_name'])
                .from('users as user')
                .where('email', email)
                .innerJoin('user_profiles as profile', 'user.id', 'profile.user_id');

            if (!user) {
                throw new NotFoundError('We are unable to identify your account. Please check your email');
            }

            if (user.verified_at) {
                throw new PermissionError('Cannot perform this operaion on a verified account');
            }

            const tokenPayload = JSON.stringify({ email, date: new Date().toString() });
            const token = crypto.
                            createHmac('sha256', tokenPayload, { encoding: 'utf-8' })
                            .update('token')
                            .digest('hex');

            await knex('users')
                .where('id', user.id)
                .update({ confirmation_token: token });

            await mailer.sendAccountVerification({
                first_name: user.first_name,
                last_name: user.last_name,
                email,
                verification_url: `${env.get('FRONTEND_BASEURL')}/auth/verify?token=${token}`
            });

            res.status(200).json({
                status: 'success',
                message: 'A verification mail has been sent to you',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Allow users to request a password when they can not remember their password
     */
    async initiatePasswordReset(req, res, next) {
        const { body } = req;

        try {
            if (!body.email) {
                throw new ClientError('Please provide an email address');
            }

            const user = await knex.first(['id', 'email']).from('users').where('email', body.email);

            if (!user) {
                throw new NotFoundError('We are unable to identify your account. Please check your email');
            }

            const tokenPayload = JSON.stringify({ email: user.email, date: new Date().toString() });
            const token = crypto.
                            createHmac('sha256', tokenPayload, { encoding: 'utf-8' })
                            .update('password_token')
                            .digest('hex');

            await knex('password_tokens')
                .insert({
                    user_id: user.id,
                    token 
                });

            await mailer.sendPasswordResetLink({
                email: user.email,
                password_reset_link: `${env.get('FRONTEND_BASEURL')}/auth/reset-password?token=${token}`
            });

            res.status(200).json({
                status: 'success',
                message: 'A link has been sent to your email'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Resets the user password
     */
    async resetPassword(req, res, next) {
        const { body, query } = req;
        const transaction = await knex.transaction();

        try {
            if (!query.token) {
                throw new ClientError('No reset token provided');
            }

            const passwordTokenObject = await knex.first(['user_id', 'created_at']).from('password_tokens').where('token', query.token);

            console.log(passwordTokenObject);

            if (!passwordTokenObject) {
                throw new ClientError('Invalid token');
            }

            
            if (body.password !== body.confirm_password) {
                throw new ClientError('Passwords do not match');
            }
            
            const encryptedPassword = await _bcrypt.hash(body.password);

            await knex('users')
                .where('id', passwordTokenObject.user_id)
                .transacting(transaction)
                .update({ password: encryptedPassword });

            await knex('password_tokens').del()
                .where('user_id', passwordTokenObject.user_id);

            await transaction.commit();

            res.status(200).json({
                status: 'success',
                message: 'Password was reset successfully'
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    }
};
