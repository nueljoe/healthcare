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
        const { user, query: { limit, offset } } = req;

        try {
            if (user.label !== 'admin') {
                throw new PermissionError();
            }

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
                .offset(offset);

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
            const order = await knex.first().from('orders').where('reference', params.reference);

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
                data: orders
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
        const { user, params } = req;

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

            order.items = await knex('orders')
                .update({ delivered_at: new Date() })
                .where('id', order.id)

            res.status(200).json({
                status:'success',
                message: `Order ${order.reference} was successfully marked as delivered`,s
            });
        } catch (error) {
            next(error);
        }
    },
};
