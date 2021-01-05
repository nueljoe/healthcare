import path from 'path';
import sharp from 'sharp';
import knex from '../database';
import { ClientError, NotFoundError, PermissionError } from '../errors';

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

            res.status(202).json({
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
            console.log(file);

            const fileName = file ? `user-${user.id}-avatar.jpeg` : "";
            
           if (file) {
                // First, upload the file to the cloud or save locally. Then proceed if successful
                await sharp(file.buffer)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(path.resolve(__dirname, `../public/images/avatars/${fileName}`), (err, info) => {
                        console.log(err)
                    }); // For now, let's save on disk. We'll push files to the cloud later.
           }

            await knex('user_profiles')
                .update({ avatar: fileName })
                .where('user_id', user.id);
            
            res.status(202).json({
                status: 'success',
                message: 'Your profile picture was updated successfully',
                data: {
                    "avatar": fileName
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
};