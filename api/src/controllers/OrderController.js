import path from 'path';
import sharp from 'sharp';
import knex from '../database';
import PaymentReferenceGenerator from '../utils/PaymentReferenceGenerator';
import paystack from '../utils/paystack';
import { ClientError, NotFoundError, PermissionError } from '../errors';
import { query } from 'express';

export default {

    /**
     * Fetches a paginated list orders
     */
    async fetchOrders(req, res, next) {
        console.log(req.query);
        const { user, query: { limit, offset } } = req;

        try {
            if (user.label !== 'admin') {
                throw new PermissionError();
            }

            console.log(query.status);

            const whereClause = {};

            if (query.status === 'cancelled') {
                whereClause.cancelled_at = null;
            }
            
            if (query.status === 'delivered') {
                whereClause.delivered_at = null;
            }

            const orders = await knex
                .select()
                .from('orders')
                .whereNot({ ...whereClause })
                .limit(limit)
                .offset(offset)
                .orderBy('created_at', 'desc');

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: orders
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches the details of an order by it's ID
     */
    async fetchOneOrder(req, res, next) {
        const { user, params } = req;

        try {
            const order = await knex
                .first(
                    'order.id as id',
                    'order.reference as reference',
                    'order.cancelled_at as cancelled_at',
                    'order.delivered_at as delivered_at',
                    'order.created_at as created_at',
                    'payment.paid_at as paid_at',
                    'payment.amount as total_amount',
                    'payment.type as payment_type',
                    'payment.reference as payment_reference',
                    'payment.status as payment_status',
                    )
                .from('orders as order')
                .innerJoin('payments as payment', 'payment.resource_id', 'order.id')
                .where('order.reference', params.reference)
                .andWhere('payment.resource', 'order')
                .orderBy('created_at', 'desc');

            if (!order) {
                throw new NotFoundError('Order not found');
            }

            if (user.id !== order.user_id && user.label !== 'admin') {
                throw new PermissionError();
            }

            order.items = await knex
                .select('item.product_id', 'item.amount', 'item.quantity', 'product.name', 'product.slug', 'product.img_url')
                .from('order_items as item')
                .innerJoin('products as product', 'product.id', 'item.product_id')
                .where('order_id', order.id);

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: order
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Cancels an order
     */
    async cancelOrder(req, res, next) {
        const { user, params, body } = req;

        try {
            const order = await knex.first().from('orders').where('reference', params.reference);

            if (!order) {
                throw new NotFoundError('Order not found');
            }

            if (user.id !== order.user_id && user.label !== 'admin') {
                throw new PermissionError();
            }

            if (order.cancelled_at) {
                throw new ClientError('This order has already been cancelled');
            }

            if (order.delivered_at) {
                throw new PermissionError('Unable to cancel orders that have been delivered');
            }

            order.items = await knex('orders')
                .update({ cancelled_at: new Date() })
                .where('id', order.id)

            res.status(200).json({
                status:'success',
                message: `Order ${order.reference} has been cancelled`,
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Marks an order as delivered
     */
    async markAsDelivered(req, res, next) {
        const { transaction, user, params } = req;

        try {
            const order = await knex.first().from('orders').where('reference', params.reference);

            if (!order) {
                throw new NotFoundError('Order not found');
            }

            if (user.id !== order.user_id && user.label !== 'admin') {
                throw new PermissionError();
            }

            if (order.cancelled_at) {
                throw new ClientError('This order has already been cancelled');
            }

            if (order.delivered_at) {
                throw new PermissionError('This order has already been delivered');
            }

            // Update order payment if the payment type is cash
            const orderPayment = await knex.first('id', 'type', 'paid_at')
                .from('payments')
                .where('resource', 'order')
                .andWhere('resource_id', order.id)

            if (!orderPayment) {
                throw new Error('Something is not right. Unable to find payment data for this order');
            }

            if (orderPayment.type === 'cash') {
                // It's rational to assume that payment is recieved before any admin marks an order as delivered in the case of a cash payment.
                await knex('payments')
                    .transacting(transaction)
                    .update({ paid_at: new Date(), status: 'success' })
                    .where('id', orderPayment.id);
            } else {
                if (!orderPayment.paid_at) {
                    throw new PermissionError('Unable to mark as delivered because the order has not been paid for.');
                }
            }

            await knex('orders')
                .transacting(transaction)
                .update({ delivered_at: new Date() })
                .where('id', order.id);            

            await transaction.commit();

            res.status(200).json({
                status:'success',
                message: `Order ${order.reference} was successfully marked as delivered`,
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },
};
