import knex from '../database';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Verifies a payment
     */
    async verifyPayment(req, res, next) {
        const { transaction, body } = req;

        try {            
            const payment = await knex.first()
                .from('payments')
                .where('status', 'pending')
                .andWhere('reference', body.data.reference)
            
            if (!payment) {
                throw new NotFoundError('Payment not found');
            }

            if (body.event === 'charge.failed') {
                await knex('payments')
                    .transacting(transaction)
                    .update({ status: 'success' })

            } else if (body.event === 'charge.success') {

                if (payment.resource === 'course') {
                    await knex('enrolled_courses')
                        .transacting(transaction)
                        .insert({
                            user_id: payment.user_id,
                            course_id: payment.resource_id,
                            payment_reference:  payment.reference
                        });
                } else {
                    // update the status of an order
                }
    
                await knex('payments')
                    .transacting(transaction)
                    .update({ status: 'success', paid_at: body.data.paid_at })
            }

            await transaction.commit();

            res.status(200).json({
                status: 'success',
                message: 'Payment status has been updated'
            })
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },

    /**
     * Fetches all payments ever made
     */
    async fetchPayments(req, res, next) {
        const { user, query: { limit, offset, reference, is_paid } } = req;

        const whereClause = {};

        try {
            if (user.label !== 'admin') {
                throw new PermissionError();
            }

            if (is_paid !== undefined)  {
                whereClause.is_paid = is_paid;
            }
            
            if (reference) {
                whereClause.reference = reference;
            }

            const payments = await knex.select()
                .from('payments')
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
};