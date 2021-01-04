import knex from '../database';
import _slugify from '../utils/_slugify';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a new course enrollment
     */
    async enroll(req, res, next) {
        const { user, params } = req;

        try {            
            const course = await knex.first().from('courses').where({ slug: params.slug });
            
            if (!course) {
                throw new NotFoundError('Course not found');
            }
            
            if (course.creator_id !== user.id) {
                throw new PermissionError();
            }

            const sameCourseEnrolled = await knex.first().from('enrolled_courses').where({
                course_id: course.id,
                user_id: user.id
            });

            if (sameCourseEnrolled) {
                throw new PermissionError('You are already enrolled in this course');
            }

            await knex('enrolled_courses').insert({
                course_id: course.id,
                user_id: user.id,
                payment_reference: 
            });

            res.status(201).json({
                status: 'success',
                message: 'Your have been successfully enrolled'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetch all enrollments
     */
    async fetchEnrollments(req, res, next) {
        const { limit, offset, params } = req;

        try {
            const courses = await knex.select().from('course_modules')
                .where('course_id', params.id)
                .orderBy('position', 'desc')
                .offset(offset)
                .limit(limit);

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: courses
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a course module
     */
    async fetchCourseModule(req, res, next) {
        const { params } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (course.creator_id !== user.id) {
                throw new PermissionError();
            }

            const module = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!module) {
                throw new NotFoundError('Course not found');
            }

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: course
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Cancels a user's enrollment in a course
     */
    async cancelEnrollment(req, res, next) {
        const { user, params } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (course.creator_id !== user.id) {
                throw new PermissionError();
            }

            const module = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!module) {
                throw new NotFoundError('Course module not found');
            }


            await knex('course_modules').delete().where({ id: params.moduleId });

            res.status(202).json({
                status: 'success',
                message: 'Module was successfully deleted',
            });
        } catch (error) {
            next(error);
        }
    },
}
