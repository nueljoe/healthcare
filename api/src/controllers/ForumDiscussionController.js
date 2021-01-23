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
                    body: body.body, // `body`.`body` points to a `body` field on the `Request.body` object. Lol..I'm sure you knew
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
                .select(
                    'discussions.id as id',
                    'discussions.title as title',
                    'discussions.slug as slug',
                    'discussions.responder_id as responder_id',
                    'discussions.body as body',
                    'discussions.created_at as created_at',
                    'user_profile.user_id as user_id',
                    'user_profile.first_name as user_firstname',
                    'user_profile.last_name as user_lastname',
                    'user_profile.avatar as user_avatar',
                    'user_profile.bio as user_bio',
                )
                .from('discussions')
                .innerJoin('user_profiles as user_profile', 'user_profile.user_id', 'discussions.user_id')
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
     * Searches the discussions table for a token
     */
    async searchDiscussions(req, res, next) {
        const { limit, offset } = req;

        try {
            const discussions = await knex
                .select(
                    'discussions.id as id',
                    'discussions.title as title',
                    'discussions.slug as slug',
                    'discussions.responder_id as responder_id',
                    'discussions.body as body',
                    'discussions.created_at as created_at',
                    'user_profile.user_id as user_id',
                    'user_profile.first_name as user_firstname',
                    'user_profile.last_name as user_lastname',
                    'user_profile.avatar as user_avatar',
                    'user_profile.bio as user_bio',
                )
                .from('discussions')
                .innerJoin('user_profiles as user_profile', 'user_profile.user_id', 'discussions.user_id')
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
                .first(
                    'discussions.id as id',
                    'discussions.title as title',
                    'discussions.slug as slug',
                    'discussions.responder_id as responder_id',
                    'discussions.body as body',
                    'discussions.created_at as created_at',
                    'user_profile.user_id as user_id',
                    'user_profile.first_name as user_firstname',
                    'user_profile.last_name as user_lastname',
                    'user_profile.avatar as user_avatar',
                    'user_profile.bio as user_bio',
                )
                .from('discussions')
                .innerJoin('user_profiles as user_profile', 'user_profile.user_id', 'discussions.user_id')
                .where('discussions.id', params.id);

            if (!discussion) {
                throw new NotFoundError('Discussion not found');
            }

            discussion.comments = await knex
                .select(
                    'comments.id as id',
                    'comments.body as body',
                    'comments.created_at as created_at',
                    'user_profile.user_id as user_id',
                    'user_profile.first_name as user_firstname',
                    'user_profile.last_name as user_lastname',
                    'user_profile.avatar as user_avatar',
                )
                .from('discussion_comments as comments')
                .innerJoin('user_profiles as user_profile', 'user_profile.user_id', 'comments.user_id')
                .where('comments.discussion_id', discussion.id)
                .orderBy('comments.created_at', 'asc')

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
        const { user, params: { id } } = req;

        try {
            const discussion = await knex.first().from('discussions').where({ id });

            if (!discussion) {
                throw new NotFoundError('Discussion not found');
            }

            if (user.id !== discussion.user_id && user.label !== 'admin') {
                throw new PermissionError();
            }

            await knex('discussions').delete().where({ id });

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
        const { user, transaction, body, params } = req;

        try {
            const discussion = await knex.first().from('discussions').where({ id: params.id });

            if (!discussion) {
                throw new NotFoundError('Discussion not found');
            }

            if (!discussion.responder_id && discussion.user_id !== user.id && user.label !== 'admin') {
                throw new PermissionError('You are not permitted to join this discussion');
            }

            if (discussion.responder_id && discussion.responder_id !== user.id && user.label === 'admin') {
                throw new PermissionError('Another admin is on this discussion');
            }

            if (!discussion.responder_id && user.label === 'admin') {
                await knex('discussions')
                    .transacting(transaction)
                    .update({ responder_id: user.id })
                    .where('id', discussion.id);
            }

            const [ id ] = await knex('discussion_comments')
                .transacting(transaction)
                .insert({
                    body: body.body, // `body`.`body` point is to the body of the comment. Obviously lol..
                    user_id: user.id,
                    discussion_id: discussion.id
                });
            
            await transaction.commit();
            
            res.status(201).json({
                status: 'success',
                message: 'Your response was added succesfully',
                data: { id }
            });
        } catch (error) {
            await transaction.rollback(error);
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
                .where({ id: params.id });

            if (!discussion) { 
                throw new NotFoundError('Discussion not found');
            }

            const comments = await knex
                .select(
                    'comments.id as id',
                    'comments.body as body',
                    'comments.created_at as created_at',
                    'user_profile.user_id as user_id',
                    'user_profile.first_name as user_firstname',
                    'user_profile.last_name as user_lastname',
                    'user_profile.avatar as user_avatar',
                )
                .from('discussion_comments as comments')
                .innerJoin('user_profiles as user_profile', 'user_profile.user_id', 'comments.user_id')
                .where('discussion_id', params.id)
                .orderBy('comments.created_at', 'asc')
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
     * Deletes a discussion's comment
     */
    async deleteComment(req, res, next) {
        const { user, params: { id, commentId } } = req;

        try {
            const discussion = await knex.first().from('discussions').where({ id });

            if (!discussion) {
                throw new NotFoundError('Discussion not found');
            }

            if (user.id !== discussion.user_id && user.label !== 'admin') {
                throw new PermissionError();
            }

            await knex('discussion_comments').delete().where({ id: commentId, discussion_id: id });

            res.status(200).json({
                status: 'success',
                message: 'Comment was successfully deleted',
            });
        } catch (error) {
            next(error);
        }
    },
}
