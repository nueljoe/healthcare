import knex from '../database';
import _slugify from '../utils/_slugify';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a new module for a course
     */
    async createCourseModule(req, res, next) {
        const { user, params, body } = req;

        try {
            if (user.label === 'member') {
                throw new PermissionError('Ordinary members can not create course modules');
            }
            
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (course.creator_id !== user.id) {
                throw new PermissionError();
            }

            const existingCourseModules = await knex.select('id', 'position')
                .from('course_modules')
                .where('course_id', params.id);

            const positionLength = existingCourseModules.length + 1;

            const [ id ] = await knex('course_modules').insert({
                ...body,
                position: positionLength,
                course_id: params.id
            });

            res.status(201).json({
                status: 'success',
                message: 'Module was successfully created',
                data: { id, title: body.title }
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Updates a course module
     */
    async updateCourseModule(req, res, next) {
        const { user, params, body } = req;

        try {
            const module = await knex.first().from('course_modules').where({ id: params.moduleId });
            
            if (!module) {
                throw new NotFoundError('Module not found');
            }

            const module = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }

            if (body.category_id && body.category_id !== course.category_id) {
                const category = await knex.first('id', 'label', 'parent_id').from('course_categories')
                    .where('id', body.category_id)
                    .andWhere('is_active', true);
                
                if (!category) {
                    throw new ClientError('Invalid category');
                }
    
                if (category.parent_id) {
                    throw new ClientError(`${category.label} is a subcategory`);
                }
            }

            if (body.subcategory_id  && body.subcategory_id !== course.subcategory_id) {
                const subcategory = await knex.first('id').from('course_categories')
                    .where('id', body.subcategory_id)
                    .andWhere('is_active', true)
                    .andWhere('parent_id', body.category_id);
                
                if (!subcategory) {
                    throw new ClientError('Invalid subcategory');
                }
            }

            let slug;

            if (body.title) {
                slug = body.title.toLowerCase() !== course.title.toLowerCase() ? _slugify(body.title) : course.slug;
            }


            await knex('courses')
                .where('id', course.id)
                .update({
                ...body,
                slug,
                updated_at: new Date()
            });

            res.status(202).json({
                status: 'success',
                message: 'Module was successfully updated',
                data: {
                    ...body,
                    slug
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Publishes/Unpublishes a course module
     */
    async updateModuleStatus(req, res, next) {
        const { user, params, body: { is_published } } = req;

        const intendingStatus = is_published ? 'published' : 'unpublished';

        const genericSuccessResponse = {
            status: 'success',
            message: `This module has already been ${intendingStatus}`
        };

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }

            const module = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!module) {
                throw new NotFoundError('Course not found');
            }
            
            if (module.is_published && is_published) {
               return res.status(202).json(genericSuccessResponse);
            }

            if (!module.is_published && !is_published) {
                return res.status(202).json(genericSuccessResponse);
             }


            await knex('course_modules')
                .where('id', params.id)
                .update({
                is_published,
                updated_at: new Date()
            });

            res.status(202).json({
                status: 'success',
                message: `Module was successfully ${intendingStatus}`
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetch all modules in a course
     */
    async fetchCourseModules(req, res, next) {
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
     * Deletes a course module
     */
    async deleteCourseModule(req, res, next) {
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
