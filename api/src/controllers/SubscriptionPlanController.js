import { create } from 'handlebars';
import knex from '../database';
import { ClientError, PermissionError, NotFoundError } from '../errors';

/**
 * @fileoverview Manages subscription plans
 */

export default {
    /**
     * Create a new subscription plan
     */
    async create(req, res, next) {
        const { user, body } = req;

        body.label = body.label.toLowerCase();
        
        try {
            if (user.label !== 'admin') {
                throw new PermissionError();
            }
            
            const planWithSameLabel = await knex.first().from('subscription_plans').where('label', body.label);

            if (planWithSameLabel) {
                throw new ClientError('A plan with the same label already exists');
            } 
            
            const [ id ] = await knex('subscription_plans')
                .insert(body);
            
            res.status(201).json({
                status: 'success',
                message: 'Plan was created successfully',
                data: {
                    id,
                    label: body.label
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a list of subscription plans
     */
    async fetchPlans(req, res, next) {
        const { user } = req;

        try {
            const plansQuery = knex.select()
                .from('subscription_plans')

            if (!user || (user && user.label !== 'admin')) {
                plansQuery.where({
                    is_public: true
                });
            }

            const plans = await plansQuery;

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: plans
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a single subscription plan by ID
     */
    async fetchPlan(req, res, next) {
        const { user, params } = req; 

        try {
            const planQuery = knex.first()
                .from('subscription_plans')
                .where('id', params.id);

            if (!user || (user && user.label !== 'admin')) {
                planQuery = planQuery.where({
                    is_public: true
                });
            }

            const plan = await planQuery;

            if (!plan) {
                throw new NotFoundError('Plan not found');
            }

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: plan
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Updates a subscription plan by ID
     */
    async updatePlan(req, res, next) {
        const { user, params, body } = req;

        try {
            if (user.label !== 'admin') {
                throw new PermissionError();
            }

            const plan = await knex.first()
                .from('subscription_plans')
                .where('id', params.id);

            if (!plan) {
                throw new NotFoundError('Plan not found');
            }

            await knex('subscription_plans')
                .update(body)
                .where({ id: params.id });

            res.status(200).json({
                status:'success',
                message: 'Plan was updated successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a subscription plan by ID
     */
    async deletePlan(req, res, next) {
        const { user, params } = req;
        let message = '';

        try {
            if (user.label !== 'admin') {
                throw new PermissionError('');
            }

            const plan = await knex.first()
                .from('subscription_plans')
                .where('id', params.id);

            if (!plan) {
                throw new NotFoundError('Plan not found');
            }

            const planInUse = await knex.first()
                .from('course_subscriptions')
                .where('plan_id', params.id);

            if (planInUse) {
                await knex('subscription_plans')
                    .update({ is_public: false })
                    .where({ id: params.id });

                message = `This plan is currently in use. It has not been deleted, but won't be accessible to the public`;
            } else {
                await knex('subscription_plans')
                    .delete()
                    .where({ id: params.id });

                message = 'Plan was deleted successfully'
            }

            res.status(200).json({
                status:'success',
                message,
            });
        } catch (error) {
            next(error);
        }
    }
}
