import path from 'path';
import sharp from 'sharp';
import knex from '../database';
import PaymentReferenceGenerator from '../utils/PaymentReferenceGenerator';
import paystack from '../utils/paystack';
import { ClientError, NotFoundError, PermissionError } from '../errors';
import { trace } from 'joi';

export default {
    /**
     * Fetches a user's profile
     */
    async fetchProfile(req, res, next) {
        const { user } = req;

        try {
            const enrolledCourses = await knex
                .first()
                .from('user_profiles')
                .where('user_id', user.id);

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: enrolledCourses
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update basic profile
     */
    async updateProfile(req, res, next) {
        const { user, body } = req;

        try {
            if (body.gender && !['male', 'female'].includes(body.gender)) {
                throw new ClientError('Gender must be one of "male" or "female"!');
            }

            await knex('user_profiles')
                .update(body)
                .where('user_id', user.id);

            res.status(200).json({
                status: 'success',
                message: 'Your profile was updated successfully'
            })
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Upload avatar
     */
    async uploadAvatar(req, res, next) {
        const { user, file } = req;

        try {
            const filePath = file ? `images/avatars/user-${user.id}-avatar.jpeg` : "";
            
            if (file) {
                    // First, upload the file to the cloud or save locally. Then proceed if successful
                    await sharp(file.buffer)
                        .toFormat('jpeg')
                        .jpeg({ quality: 90 })
                        .toFile(path.resolve(__dirname, `../public/${filePath}`), (err, info) => {
                            console.log(err)
                        }); // For now, let's save on disk. We'll push files to the cloud later.
            }

            await knex('user_profiles')
                .update({ avatar: filePath })
                .where('user_id', user.id);
            
            res.status(200).json({
                status: 'success',
                message: 'Your profile picture was updated successfully',
                data: {
                    avatar: filePath
                }
            })
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a list of course the current user is enrolled in
     */
    async fetchCoursesEnrolled(req, res, next) {
        const { user, query: { limit, offset } } = req;

        try {

            const coursesEnrolled = await knex
                .select('enrollment.completed_at', 'enrollment.last_lecture_viewed', 'course.title', 'course.slug', 'course.banner')
                // .select('enrollment.completed_at', 'enrollment.last_lecture_viewed', 'course')
                .from('enrolled_courses as enrollment')
                .where('user_id', user.id)
                .leftOuterJoin('courses as course', 'enrollment.course_id', 'course.id')
                .limit(limit)
                .offset(offset);

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: coursesEnrolled
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Fetches a list of course created by the current user
     */
    async fetchCoursesCreated(req, res, next) {
        const { user, query: { limit, offset } } = req;

        try {

            const coursesCreated = await knex
                .select()
                .from('courses')
                .where('creator_id', user.id)
                .limit(limit)
                .offset(offset);

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: coursesCreated
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a user's payment history
     */
    async fetchPaymentHistory(req, res, next) {
        const { user, query: { limit, offset, reference, is_paid } } = req;

        const whereClause = {};

        try {
            if (is_paid !== undefined)  {
                whereClause.is_paid = is_paid;
            }
            
            if (reference) {
                whereClause.reference = reference;
            }

            const payments = await knex.select()
                .from('payments')
                .where('user_id', user.id)
                .andWhere(whereClause)
                .limit(limit)
                .offset(offset);

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: payments
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a paginated list orders created by the current user
     */
    async fetchOrders(req, res, next) {
        const { user, query: { limit, offset } } = req;

        try {

            const orders = await knex
                .select(
                    'order.id as id',
                    'order.reference as reference',
                    'order.cancelled_at as cancelled_at',
                    'order.delivered_at as delivered_at',
                    'order.created_at as created_at',
                    'payment.paid_at as paid_at',
                    'payment.amount as total_amount',
                    'payment.reference as payment_reference',
                    'payment.status as payment_status',
                    )
                .from('orders as order')
                .innerJoin('payments as payment', 'payment.resource_id', 'order.id')
                .where('order.user_id', user.id)
                .andWhere('payment.resource', 'order')
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
     * Adds a product to a user's cart
     */
    async addToCart(req, res, next) {
        const { user, body } = req;

        try {
            const product = await knex.first('id', 'stock').from('products')
            .where({
                id: body.product_id,
                is_published: true
            });

            if (!product) {
                throw new NotFoundError('Product not found');
            }

            // Typically, you want to check the quantity against the unit in stock. But we ain't doing that yet.

            const duplicateItemInCart = await knex.first().from('cart_items')
                .where('product_id', body.product_id)
                .andWhere('user_id', user.id);

            console.log(duplicateItemInCart);

            if (!duplicateItemInCart) {
                await knex('cart_items').insert({ ...body, user_id: user.id });
            } else {
                await knex('cart_items')
                    .update({ quantity: duplicateItemInCart.quantity + 1 })
                    .where('product_id', body.product_id)
                    .andWhere('user_id', user.id);
            }

            res.status(201).json({
                status: 'success',
                message: 'Product was added to cart successfully'
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Allows the user to update the quantity of an item in their cart
     */
    async updateCartItem(req, res, next) {
        const { user, params, body } = req;

        try {
            const cartItem = await knex.first().from('cart_items')
                .where('id', params.itemId)
                .andWhere('user_id', user.id);

            if (!cartItem) {
                throw new NotFoundError('Unable to find the cart item');
            }

            // Typically, you want to check the quantity against the unit in stock for the product. But we ain't doing that yet.

            await knex('cart_items')
                .update({ ...body })
                .where('id', cartItem.id);

            res.status(201).json({
                status: 'success',
                message: 'Cart item was successfully updated'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Allows the user to remove an item from their cart
     */
    async removeCartItem(req, res, next) {
        const { user, params } = req;

        try {
            const cartItem = await knex.first().from('cart_items')
                .where('id', params.itemId)
                .andWhere('user_id', user.id);

            if (!cartItem) {
                throw new NotFoundError('Unable to find the cart item');
            }

            // Typically, you want to check the quantity against the unit in stock for the product. But we ain't doing that yet.

            await knex('cart_items')
                .delete()
                .where('id', cartItem.id);

            res.status(201).json({
                status: 'success',
                message: 'Cart item was successfully removed'
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Fetches all the items in a user's cart
     */
    async fetchCart(req, res, next) {
        const { user, query: { limit, offset, reference, is_paid } } = req;

        const whereClause = {};

        try {
            if (is_paid !== undefined)  {
                whereClause.is_paid = is_paid;
            }
            
            if (reference) {
                whereClause.reference = reference;
            }

            const cart = await knex
                .select('item.id', 
                    'item.product_id', 
                    'item.quantity', 
                    'product.name', 
                    'product.img_url', 
                    'product.slug', 
                    'product.price', 
                    'product.discount', 
                    'product.stock')
                .from('cart_items as item')
                .rightOuterJoin('products as product', 'product.id', 'item.product_id')
                .where('user_id', user.id)
                .andWhere(whereClause)
                .limit(limit)
                .offset(offset);

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: cart
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Allows the user to delete all the items in their cart
     */
    async clearCart(req, res, next) {
        const { user } = req;

        try {
            await knex('cart_items').delete().where('user_id', user.id);

            res.status(201).json({
                status: 'success',
                message: 'Your cart was cleared successfully'
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Creates an order off the items in the user's cart
     */
    async checkout(req, res, next) {
        const { user, transaction, body } = req;

        try {
            if (body.payment_type !== 'online' && body.payment_type !== 'cash') {
                throw new ClientError('Payment type must be either "online" or "cash"');
            }

            const cartItems = await knex
                .select('item.product_id', 
                    'item.quantity', 
                    'product.name', 
                    'product.img_url', 
                    'product.slug', 
                    'product.price', 
                    'product.discount', 
                    'product.stock')
                .from('cart_items as item')
                .innerJoin('products as product')
                .where('user_id', user.id);

            if (!cartItems.length) {
                throw new ClientError('No item in cart!');
            }

            // Create an order
            const [ orderId ] = await knex('orders')
                .transacting(transaction)
                .insert({
                    user_id: user.id,
                    reference: `301${Date.now() * cartItems.length + Math.floor(Math.random() * 100000) + 1}`,
                });

            const orderItems = [];
            let orderTotalAmount = 0;

            let itemPrice = 0;
            cartItems.forEach((item, index) => {
                itemPrice = item.discount ? item.price - (item.price * item.discount) : item.price;

                orderItems[index] = {
                    order_id: orderId,
                    product_id: item.product_id,
                    amount: itemPrice,
                    quantity: item.quantity
                };

                orderTotalAmount = orderTotalAmount + (itemPrice * item.quantity);
            });
                
            // Create order items
             await knex('order_items')
                .transacting(transaction)
                .insert(orderItems);

            // Clear the cart. We're done with it
            await knex('cart_items')
                .transacting(transaction)
                .delete()
                .where('user_id', user.id);
            
            const PRG = new PaymentReferenceGenerator({ order_items: orderItems });

            // initialize a payment
            await knex('payments')
                .transacting(transaction)
                .insert({
                    type: body.payment_type,
                    amount: orderTotalAmount,
                    resource: 'order',
                    resource_id: orderId,
                    user_id: user.id,
                    reference: PRG.reference,
                });

            let paystackResponse;

            if (body.payment_type === 'online') {
                paystackResponse = await paystack.initiatePayment({
                    amount: orderTotalAmount,
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
                            display_name: 'Order ID',
                            variable_name: 'order_id',
                            value: orderId
                        },
                      ]  
                    })
                });

                console.log(paystackResponse);
    
                if (!paystackResponse.status) {
                    throw new Error(paystackResponse.message);
                }
            }
            
            await transaction.commit();

            res.status(201).json({
                status: 'success',
                message: 'Your order was placed successfully',
                data: paystackResponse && paystackResponse.data
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },
};
