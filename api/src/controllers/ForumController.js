import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import knex from '../database';
import _slugify from '../utils/_slugify';
import removeFile from '../utils/removeFile';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a new discussion
     */
    async createDiscussion(req, res, next) {
        const { user, body } = req;

        try {
            const slug = _slugify(body.title);

            const [ id ] = await knex('discussions')
                .insert({
                    title: body.title,
                    slug,
                    user_id: user.id
                });
            
            res.status(201).json({
                status: 'success',
                message: 'Your discussion was opened succesfully',
                data: { id, slug }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetch all discussions
     */
    async fetchDiscussions(req, res, next) {
        const { limit, offset } = req;

        try {
            const discussions = await knex
                .select()
                .from('discussions')
                .orderBy('created_at', 'desc')
                .offset(offset)
                .limit(limit);

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: discussions
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a single discussion
     */
    async fetchDiscussion(req, res, next) {
        const { params } = req;

        try {
            const discussion = await knex
                .first()
                .from('discussions')
                .where({ slug: params.slug });

            if (!discussion) {
                throw new NotFoundError('Discussion not found');
            }

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: discussion,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a discussion
     */
    async deleteDiscussion(req, res, next) {
        const { user, params: { slug } } = req;

        try {
            const discussion = await knex.first().from('discussions').where({ slug });

            if (!discussion) {
                throw new NotFoundError('discussion not found');
            }

            if (user.id !== discussion.user_id && user.label !== 'admin') {
                throw new PermissionError();
            }

            await knex('discussions').delete().where({ slug });

            res.status(200).json({
                status: 'success',
                message: 'Discussion was successfully deleted',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Adds a comment to a discussion
     */
    async addComment(req, res, next) {
        const { user, body } = req;

        try {
            const discussion = await knex.first().from('discussions').where({ slug });

            if (!discussion) {
                throw new NotFoundError('Discussion not found');
            }

            if (!discussion.responder_id && discussion.user_id !== user.id && user.label !== 'admin') {
                throw new PermissionError('You are not permitted to join this discussion');
            }

            if (discussion.responder_id && discussion.responder_id !== user.id && user.label === 'admin') {
                throw new PermissionError('Another admin is on this discussion');
            }

            const [ id ] = await knex('discussion_comments')
                .insert({
                    body: body.body, // `body`.`body` point is to the body of the comment. Obviously lol..
                    user_id: user.id,
                    discussion_id: discussion.id
                });
            
            res.status(201).json({
                status: 'success',
                message: 'Your discussion was opened succesfully',
                data: { id }
            });
        } catch (error) {
            next(error);
        }
    },
   
    /**
     * Fetches the comments on a discussion
     */
    async fetchDiscussionComments(req, res, next) {
        const { offset, limit, params } = req;

        try {
            const discussion = await knex
                .first()
                .from('discussions')
                .where({ slug: params.slug });

            if (!discussion) {
                throw new NotFoundError('Discussion not found');
            }

            const comments = await knex
                .select()
                .from('discussion_comments')
                .orderBy('created_at', 'asc')
                .offset(offset)
                .limit(limit);

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: comments,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a comment
     */
    async deleteComment(req, res, next) {
        const { user, params: { slug } } = req;

        try {
            const discussion = await knex.first().from('discussions').where({ slug });

            if (!discussion) {
                throw new NotFoundError('discussion not found');
            }

            if (user.id !== discussion.user_id && user.label !== 'admin') {
                throw new PermissionError();
            }

            await knex('discussions').delete().where({ slug });

            res.status(200).json({
                status: 'success',
                message: 'Discussion was successfully deleted',
            });
        } catch (error) {
            next(error);
        }
    },
}


