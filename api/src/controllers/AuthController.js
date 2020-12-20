import crypto from 'crypto';
import knex from '../database';
import { ClientError } from '../errors';
import _bcrypt from '../utils/_bcrypt';
import { makeToken } from '../utils/_jwt';
import mailer from '../utils/mailer';
import env from '../utils/env';

export default {
    async createAccount(req, res, next) {
        const { body } = req;
        const transaction = await knex.transaction();

        try {
            const userWithSameEmail = await knex.first('id').from('users').where('email', body.email);

            if (userWithSameEmail) {
                throw new ClientError('An account exists with this email');
            }

            const encryptedPassword = await _bcrypt.hash(body.password);
            const confirmationToken = crypto.createHmac('sha256', JSON.stringify({ email: body.email }), { encoding: 'utf-8' }).update('token').digest('hex');

            const permission = await knex.first('id').from('permissions').where('label', 'member');

            const [userId] = await knex('users')
                .transacting(transaction)
                .insert({
                    email: body.email,
                    password: encryptedPassword,
                    permission_id: permission.id,
                    confirmation_token: confirmationToken
                }, ['id', 'email']);            

            const [profile, subscriber] = await Promise.all([
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
     * Sign in a user
     */
    async signIn(req, res, next) {
        const { body } = req;
        const genericErrorMsg = 'Email or password is incorrect';

        try {
            const user = await knex.first().from('users').where('email', body.email || 1);

            if (!user) {
                throw new ClientError(genericErrorMsg);
            }

            const passwordMatch = await _bcrypt.compare(body.password, user.password);

            if (!passwordMatch) {
                throw new ClientError(genericErrorMsg);
            }

            const payload = { id: user.id, email: user.email };

            res.status(202).json({
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
    }
};
