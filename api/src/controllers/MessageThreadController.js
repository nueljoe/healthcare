import knex from '../database';
import { NotFoundError, PermissionError, ClientError } from '../errors';

const MessageThreadController = {
    /**
     * Starts a new thread, and a thread must contain at least one message. So this handler
     * expects a non-empty `message_body` string field on the Request body.
     */
    async openThread(req, res, next) {
        const { user, transaction, body } = req;

        try {
            let threadId = 9;
            let recipientId;

            if (!body.recipient_id) {
                recipientId = 1;
            } else {
                if (user.id === Number(body.recipient_id)) {
                    throw new ClientError('You dey ment? Why you go wan message yourself? Bastard user!!');
                }

                const recipient = await knex.first('id').from('users').where('id', body.recipient_id);

                if (!recipient) {
                    throw new NotFoundError('Recipient does not exist');
                }

                recipientId = recipient.id;
            }

            // Actually ensure that the user isn't trying to create a new thread with his/her recipient
            const existingThreadWithRecipient = await knex.first(
                    'thread.id',
                    'current_participant.user_id as current_participant_user_id',
                    'other_participant.user_id as other_participant_user_id',
                )
                .from('message_threads as thread')
                .innerJoin('message_thread_participants as current_participant', 'current_participant.thread_id', 'thread.id')
                .innerJoin('message_thread_participants as other_participant', 'other_participant.thread_id', 'thread.id')
                .where('current_participant.user_id', '=', user.id)
                .andWhere('other_participant.user_id', '=', recipientId);

                console.log(existingThreadWithRecipient);

            if (existingThreadWithRecipient) {
                threadId = existingThreadWithRecipient.id;
            } else {
                [ threadId ] = await knex('message_threads')
                    .transacting(transaction)
                    .insert({});

                // Store thread participants
                await knex('message_thread_participants')
                    .transacting(transaction)
                    .insert([
                        { user_id: user.id, thread_id: threadId }, // One for the homie making the request
                        { user_id: recipientId, thread_id: threadId }, // One for the recipient
                    ]);
            }

            // Store the new message
            await knex('messages')
                .transacting(transaction)
                .insert({
                    body: body.message_body,
                    thread_id: threadId,
                    sender_id: user.id
                });

            await transaction.commit();

            res.status(201).json({
                status: 'success',
                message: 'Thread was opened successfully',
                data: {
                    id: threadId
                }
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },

    /**
     * Sets the `updated_at` field of a thread to `new Date()`. A thread is updated when a new message
     * is added to it.
     * 
     * @param { number } id - A thread ID
     * @param { object } transaction - An database transaction object to be used in the operation
     */
    async setThreadUpdateTime(id, transaction) {
        try {
            await knex('message_threads')
                .transacting(transaction)
                .update({ updated_at: new Date() })
                .where('id', id);
        } catch (error) {
            console.log('SetThreadUpdateTime Error: ', error);
            throw new Error('Unable to update thread at this time.');
        }
    },

    /**
     * Fetches all threads associated with the current user
     */
    async fetchThreads(req, res, next) {
        const { user, offset, limit } = req;

        try {
            // const threads = await knex.select(
            //     'thread.id',
            //     'participant.user_id as participant_user_id',
            // )
            // .from('message_thread_participants as participant')
            // .innerJoin('message_threads as thread', 'participant.thread_id', 'thread.id')
            // .innerJoin('messages as last_message', 'last_message', )
            // .where('participant.user_id', '=', user.id)
            // .offset(offset)
            // .limit(limit)
            // .orderBy('thread.updated_at', 'asc');

            const threads = await knex.select(
                'thread.id',
                'recipient.user_id as recipient_user_id',
                'recipient_profile.first_name as recipient_first_name',
                'recipient_profile.last_name as recipient_last_name',
                'recipient_profile.avatar as recipient_avatar',
                'last_message.id as last_message_id',
                'last_message.body as last_message_body',
                'last_message.read_at as last_message_read_at'
            )
            .from('message_thread_participants as participant')
            .innerJoin('message_threads as thread', 'participant.thread_id', 'thread.id')
            .innerJoin('messages as last_message', 'last_message.thread_id', 'thread.id')
            .innerJoin('message_thread_participants as recipient', 'recipient.thread_id', 'thread.id')
            .innerJoin('user_profiles as recipient_profile', 'recipient_profile.user_id', 'recipient.user_id')
            .where('participant.user_id', '=', user.id)
            .andWhereNot('recipient.user_id', '=', user.id)
            .groupBy('thread.id')
            .offset(offset)
            .limit(limit)
            .orderBy([
                { column: 'last_message.created_at', order: 'desc' },
                { column: 'thread.updated_at', order: 'asc' },
            ]);

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: threads
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Deletes a thread
     */
    async deleteThread(req, res, next) {
        const { user, params } = req;

        try {
            // Check if the user is a participant
            const participant = await knex.first('message_thread_participants.last_deleted_at', 'message_threads.created_at as thread_opened_at')
                .from('message_thread_participants')
                .innerJoin('message_threads', 'message_threads.id', 'message_thread_participants.thread_id')
                .where('thread_id', params.id).andWhere('user_id', user.id);

            if (!participant) {
                throw new PermissionError();
            }

            await knex('message_threads')
                .delete()
                .where('id', params.id);

            res.status(200).json({
                status: 'success',
                message: 'Thread successfully deleted',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Adds a new message to a thread
     */
    async postMessage(req, res, next) {
        const { transaction, user, params, body } = req;

        try {
            // Check if the user is a participant
            const participant = await knex.first('message_thread_participants.last_deleted_at', 'message_threads.created_at as thread_opened_at')
                .from('message_thread_participants')
                .innerJoin('message_threads', 'message_threads.id', 'message_thread_participants.thread_id')
                .where('thread_id', params.id).andWhere('user_id', user.id);

            if (!participant) {
                throw new PermissionError();
            }

            const [ messageId ] = await knex('messages')
                .transacting(transaction)
                .insert({
                    body: body.message_body,
                    thread_id: params.id,
                    sender_id: user.id
                });
            
            await MessageThreadController.setThreadUpdateTime(params.id, transaction);
            
            await transaction.commit();

            res.status(201).json({
                status: 'success',
                message: 'Query successful',
                data: {
                    id: messageId
                }
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },

    /**
     * Fetches all threads associated with the current user
     */
    async fetchThreadMessages(req, res, next) {
        const { user, params, offset, limit } = req;

        try {
            // Check if the user is a participant
            const participant = await knex.first('message_thread_participants.last_deleted_at', 'message_threads.created_at as thread_opened_at')
                .from('message_thread_participants')
                .innerJoin('message_threads', 'message_threads.id', 'message_thread_participants.thread_id')
                .where('thread_id', params.id).andWhere('user_id', user.id);

            if (!participant) {
                throw new PermissionError();
            }

            const messages = await knex.select()
                .from('messages')
                .where('thread_id', params.id)
                .andWhere('created_at', '>=', participant.last_deleted_at || participant.thread_opened_at)
                .offset(offset)
                .limit(limit || 20)
                .orderBy('created_at', 'desc');

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: messages
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Marks all unread messages as read where the sender is not the current user
     */
    async updateReadState(req, res, next) {
        const { user, params } = req;

        try {
            // Check if the user is a participant
            const participant = await knex.first('message_thread_participants.last_deleted_at', 'message_threads.created_at as thread_opened_at')
                .from('message_thread_participants')
                .innerJoin('message_threads', 'message_threads.id', 'message_thread_participants.thread_id')
                .where('thread_id', params.id).andWhere('user_id', user.id);

            if (!participant) {
                throw new PermissionError();
            }

            await knex('messages')
                .update({
                    read_at: new Date(),
                })
                .where('thread_id', params.id)
                .andWhereNot('sender_id', user.id)
                .andWhere('read_at', null);

            res.status(200).json({
                status: 'success',
                message: 'Unread messages were successfully marked as read'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a message froma thread
     */
    async deleteMessage(req, res, next) {
        const { user, params } = req;

        try {
            // Check if the user is a participant
            const participant = await knex.first('message_thread_participants.last_deleted_at', 'message_threads.created_at as thread_opened_at')
                .from('message_thread_participants')
                .innerJoin('message_threads', 'message_threads.id', 'message_thread_participants.thread_id')
                .where('thread_id', params.id).andWhere('user_id', user.id);

            if (!participant) {
                throw new PermissionError();
            }

            const message = await knex('messages')
                .first()
                .where('thread_id', params.id)
                .andWhere('sender_id', user.id)
                .andWhere('id', params.messageId);

            if (!message) {
                throw new NotFoundError('Message not found or it may have been previously deleted');
            }

            if (message.sender_id !== user.id) {
                throw new PermissionError('You can only delete your own messages');
            }

            await knex('messages')
                .delete()
                .where('id', message.id)

            res.status(200).json({
                status: 'success',
                message: 'Message successfully deleted'
            });
        } catch (error) {
            next(error);
        }
    },
};

export default MessageThreadController;
