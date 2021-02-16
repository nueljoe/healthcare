import path from 'path';
import sharp from 'sharp';
import moment from 'moment';
import knex from '../database';
import PaymentReferenceGenerator from '../utils/PaymentReferenceGenerator';
import paystack from '../utils/paystack';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a new subscription
     */
    async subscribe(req, res, next) {
        const { transaction, user, body } = req;

        try {
            // Check if the user has an active subscription
            const userActiveSubscription = await knex.first()
                .from('course_subscriptions')
                .where('user_id', user.id)
                .where('expires_at', '<=', new Date());

            if (userActiveSubscription) {
                throw new PermissionError(`Sorry, you still have an active subscription expiring at ${userActiveSubscription.expires_at}.`);
            }

            const plan = await knex.first().from('subscription_plans')
                .where('id', body.plan_id)
                .andWhere('is_public', true);
            
            if (!plan) {
                throw new ClientError('Sorry, the plan you selected is not available');
            }

            let amountToBePaid = 0;
            let subscriptionExpiration;

            if (body.billing_duration.toLowerCase() === 'monthly') {
                amountToBePaid = plan.price_per_month;

                subscriptionExpiration = moment(new Date).add(1, 'month');
            } else if (body.billing_duration.toLowerCase() === 'annual') {
                const amountPerYear = plan.price_per_month * 12;
                const discountOnAnnualBilling = amountPerYear * plan.annual_billing_discount;
                amountToBePaid = amountPerYear - discountOnAnnualBilling;

                subscriptionExpiration = moment(new Date).add(1, 'year');
            } else {
                throw new ClientError('Billing duration must be either monthly or annual');
            }

            const PRG = new PaymentReferenceGenerator(body);

            const [ subscriptionId ] = await knex('course_subscriptions')
                .transacting(transaction)
                .insert({
                    user_id: user.id,
                    plan_id: plan.id,
                    payment_reference: PRG.reference,
                    billing_duration: body.billing_duration.toLowerCase(),
                    expires_at: new Date(subscriptionExpiration)
                });

            // Begin payment initiation
            await knex('payments')
                .transacting(transaction)
                .insert({
                    resource: 'subscription',
                    resource_id: subscriptionId,
                    type: 'online',
                    reference: PRG.reference,
                    amount: amountToBePaid,
                    user_id: user.id
                });


            let paystackResponse;

            paystackResponse = await paystack.initiatePayment({
                amount: amountToBePaid,
                email: user.email,
                reference: PRG.reference,
                metadata: JSON.stringify({
                    custom_fields: [
                    {
                        display_name: 'User ID',
                        variable_name: 'user_id',
                        value: user.id
                    },
                    {
                        display_name: 'Subscription ID',
                        variable_name: 'subscription_id',
                        value: subscriptionId
                    },
                    ]  
                })
            });

            console.log(paystackResponse);

            if (!paystackResponse.status) {
                throw new Error(paystackResponse.message);
            }
            
            await transaction.commit();

            res.status(201).json({
                status: 'success',
                message: 'Your subscription was initiated successfully',
                data: paystackResponse && paystackResponse.data
            });

        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },

    /**
     * Fetches a paginated list subscriptions
     */
    async fetchSubscriptions(req, res, next) {
        const { user, limit, offset } = req;

        try {
            if (user.label !== 'admin') {
                throw new PermissionError();
            }

            const whereClause = {};

            // if (req.query.status === 'cancelled') {
            //     whereClause.cancelled_at = null;
            // }
            
            // if (req.query.status === 'delivered') {
            //     whereClause.delivered_at = null;
            // }

            const subscriptions = await knex
                .select(
                    'subscription.id as id',
                    'subscription.billing_duration as billing_duration',
                    'subscription.plan_id as plan_id',
                    'subscription.user_id as user_id',
                    'subscription.payment_reference as payment_reference',
                    'subscription.expires_at as expires_at',
                    'subscription.created_at as created_at',

                    'profile.first_name as user_first_name',
                    'profile.last_name as user_last_name',

                    'plan.label as plan_label',

                    'payment.id as payment_id',
                    'payment.type as payment_type',
                    'payment.amount as amount',
                    'payment.status as payment_status',
                    'payment.paid_at as paid_at',
                )
                .from('course_subscriptions as subscription')
                .innerJoin('user_profiles as profile', 'profile.user_id', 'subscription.user_id')
                .innerJoin('subscription_plans as plan', 'plan.id', 'subscription.plan_id')
                .innerJoin('payments as payment', 'payment.reference', 'subscription.payment_reference')
                .where('payment.resource', 'subscription')
                .limit(limit)
                .offset(offset)
                .orderBy('created_at', 'desc');

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: subscriptions
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches the details of a subscription by it's ID
     */
    async fetchSubscription(req, res, next) {
        const { user, params } = req;

        try {
            const subscriptionQuery = knex
                .first(
                    'subscription.id as id',
                    'subscription.billing_duration as billing_duration',
                    'subscription.plan_id as plan_id',
                    'subscription.user_id as user_id',
                    'subscription.payment_reference as payment_reference',
                    'subscription.expires_at as expires_at',
                    'subscription.created_at as created_at',

                    'profile.first_name as user_first_name',
                    'profile.last_name as user_last_name',

                    'plan.label as plan_label',

                    'payment.id as payment_id',
                    'payment.type as payment_type',
                    'payment.amount as amount',
                    'payment.status as payment_status',
                    'payment.paid_at as paid_at',
                )
                .from('course_subscriptions as subscription')
                .innerJoin('user_profiles as profile', 'profile.user_id', 'subscription.user_id')
                .innerJoin('subscription_plans as plan', 'plan.id', 'subscription.plan_id')
                .innerJoin('payments as payment', 'payment.reference', 'subscription.payment_reference')
                .where('subscription.id', params.id)
                .where('payment.resource', 'subscription')
                
            if (user.label !== 'admin') {
                subscriptionQuery = subscriptionQuery.where('subscription.user_id', user.id);
            }

            const subscription = await subscriptionQuery;
            
            if (!subscription) {
                throw new NotFoundError('Subscription not found');
            }

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: subscription
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * This deletes an unpaid subscription
     */
    async cancelSubscription(req, res, next) {
        const { user, params } = req;

        try {
            const subscription = await knex.first(
                    'subscription.id as id',
                    'subscription.billing_duration as billing_duration',
                    'subscription.plan_id as plan_id',
                    'subscription.user_id as user_id',
                    'subscription.payment_reference as payment_reference',
                    'subscription.expires_at as expires_at',

                    'plan.label as plan_label',

                    'payment.id as payment_id',
                    'payment.type as payment_type',
                    'payment.amount as amount',
                    'payment.payment_status as payment_status',
                    'payment.paid_at as paid_at',
                )
                .from('course_subscriptions as subscription')
                .innerJoin('users as user', 'user.id', 'subscription.user_id')
                .innerJoin('subscription_plans as plan', 'plan.id', 'subscription.plan_id')
                .innerJoin('payments as payment', 'payment.reference', 'subscription.payment_reference')
                .where('id', params.id);

            if (!susbcription) {
                throw new NotFoundError('Susbcription not found. It may have already been cancelled');
            }

            if (user.id !== susbcription.user_id) {
                throw new PermissionError();
            }

            order.items = await knex('course_subscriptions')
                .delete({ cancelled_at: new Date() })
                .where('id', subscription.id)

            res.status(200).json({
                status:'success',
                message: `Order ${order.reference} has been cancelled`,
            });
        } catch (error) {
            next(error);
        }
    },
};
