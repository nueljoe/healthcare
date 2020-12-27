import knex from '../database';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Handles new email subscriptions
     */
    async createSubscription(req, res, next) {
        const { body: { email } } = req;

        const responseBody = {
            status: 'success',
            message: 'Subscription successful'
        };

        try {
            const duplicateSubscription = await knex.first().from('subscribers').where('email', email);

            if (duplicateSubscription) {
                return res.status(201).json(responseBody);
            }

            await knex('subscribers').insert({ email });

            res.status(201).json(responseBody);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Updates a subscription
     */
    async updateSubscription(req, res, next) {
        const { params: { id }, body } = req;

        try {
            const subscription = await knex.first().from('subscribers').where('id', id);

            if (!subscription) {
                throw new NotFoundError('Subscription not found');
            }

            await knex('subscribers')
                .where('id', id)
                .update({ ...body });

            res.status(202).json({
                status: 'success',
                message: 'Subscription successfully updated'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Unsubscribes from company mails
     */
    async unsubscribe(req, res, next) {
        const { body: { email } } = req;

        try {
            await knex('subscribers')
                .where('email', email)
                .delete();

            res.status(202).json({
                status: 'success',
                message: 'Successfully unsubscribed'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetch all subscriptions
     */
    async fetchSubscriptions(req, res, next) {
        const { user } = req;

        try {
            // if (user.label !== 'admin') {
            //     throw new PermissionError();
            // }

            const subscriptions = await knex.select().from('subscribers');

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: subscriptions
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetch a single subscription by ID
     */
    async fetchSubscription(req, res, next) {
        const { params: { id } } = req;

        try {
            const subscription = await knex.first().from('subscribers').where('id', id);

            if (!subscription) {
                throw new NotFoundError('Subscription not found');
            }

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: subscriptions
            });
        } catch (error) {
            next(error);
        }
    }
};