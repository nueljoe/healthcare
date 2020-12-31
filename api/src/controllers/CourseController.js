import knex from '../database';
import _slugify from '../utils/_slugify';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a new course
     */
    async createCourse(req, res, next) {
        const { user, body } = req;

        try {
            if (user.label === 'member') {
                throw new PermissionError('Ordinary members can not create courses');
            }

            const category = await knex.first('id', 'label', 'parent_id').from('course_categories')
                .where('id', body.category_id)
                .andWhere('is_active', true);
            
            if (!category) {
                throw new ClientError('Invalid category');
            }

            if (category.parent_id) {
                throw new ClientError(`${category.label} is a subcategory`);
            }

            const subcategory = await knex.first('id').from('course_categories')
                .where('id', body.subcategory_id)
                .andWhere('is_active', true)
                .andWhere('parent_id', body.category_id);
            
            if (!subcategory) {
                throw new ClientError('Invalid subcategory');
            }

            const slug =  _slugify(body.title);

            const [ id ] = await knex('courses').insert({
                ...body,
                slug,
                creator_id: user.id
            });

            res.status(201).json({
                status: 'success',
                message: 'Course was successfully created',
                data: { id, slug }
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Updates a course
     */
    async updateCourse(req, res, next) {
        const { user, params, body } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

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
                message: 'Course was successfully updated',
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
     * Publishes/Unpublishes a course
     */
    async updateStatus(req, res, next) {
        const { user, params, body: { is_published } } = req;

        const intendingStatus = is_published ? 'published' : 'unpublished';

        const genericSuccessResponse = {
            status: 'success',
            message: `This course has already been ${intendingStatus}`
        };

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }
            
            if (course.is_published && is_published) {
               return res.status(202).json(genericSuccessResponse);
            }

            if (!course.is_published && !is_published) {
                return res.status(202).json(genericSuccessResponse);
             }


            await knex('courses')
                .where('id', course.id)
                .update({
                is_published,
                updated_at: new Date()
            });

            res.status(202).json({
                status: 'success',
                message: `Course was successfully ${intendingStatus}`
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetch all courses
     */
    async fetchCourses(req, res, next) {
        const { limit, offset } = req;

        try {
            const courses = await knex.select().from('courses')
                .orderBy('created_at', 'desc')
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
     * Fetches a course
     */
    async fetchCourse(req, res, next) {
        const { params } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            res.status(201).json({
                status: 'success',
                message: 'Query successful',
                data: course
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a course
     */
    async deleteCourse(req, res, next) {
        const { user, params: { slug } } = req;

        try {
            const course = await knex.first().from('courses').where({ slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }

            // We must check first if any user is enrolled in the course.

            await knex('courses').delete().where({ slug });

            res.status(202).json({
                status: 'success',
                message: 'Course was successfully deleted',
            });
        } catch (error) {
            next(error);
        }
    },

    // ************************************************************************* //
    // ************************************************************************* //
    // ******************************* COURSE MODULES ************************** //
    // ************************************************************************* //
    // ************************************************************************* //

    /**
     * Creates a new module for a course
     */
    async createCourseModule(req, res, next) {
        const { user, params, body } = req;
        const trx = await knex.transaction();

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

            // Find the existing modules on the course
            const moduleAtLastPosition = await knex.first('id', 'position')
                .from('course_modules')
                .where('course_id', course.id)
                .orderBy('position', 'desc');

            const position = moduleAtLastPosition ? moduleAtLastPosition.position + 1 : 1;

            const [ id ] = await knex('course_modules')
                .transacting(trx)
                .insert({
                ...body,
                position,
                course_id: course.id
            });

            await knex('courses')
                .transacting(trx)
                .where('id', course.id)
                .update({
                updated_at: new Date()
            });

            await trx.commit();
            
            res.status(201).json({
                status: 'success',
                message: 'Module was successfully created',
                data: { id, title: body.title, position }
            });
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },
    
    /**
     * Updates a course module
     */
    async updateCourseModule(req, res, next) {
        const { user, params, body } = req;
        const trx = await knex.transaction();

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }

            const courseModule = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!courseModule) {
                throw new NotFoundError('Module not found');
            }

            await knex('course_modules')
                .transacting(trx)
                .where('id', courseModule.id)
                .update({
                    ...body,
                    updated_at: new Date()
                });
                
            await knex('courses')
                .transacting(trx)
                .where('id', course.id)
                .update({
                updated_at: new Date()
            });

            await trx.commit();
            
            res.status(202).json({
                status: 'success',
                message: 'Module was successfully updated',
                data: {
                    ...body
                }
            });
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },

    /**
     * Publishes/Unpublishes a course module
     */
    async updateModuleStatus(req, res, next) {
        const { user, params, body: { is_published } } = req;
        const trx = await knex.transaction();

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

            const courseModule = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!courseModule) {
                throw new NotFoundError('Module not found');
            }
            
            if (courseModule.is_published && is_published) {
               return res.status(202).json(genericSuccessResponse);
            }

            if (!courseModule.is_published && !is_published) {
                return res.status(202).json(genericSuccessResponse);
             }

            await knex('course_modules')
                .transacting(trx)
                .where('id', params.moduleId)
                .update({
                is_published,
                updated_at: new Date()
            });

            await knex('courses')
                .transacting(trx)
                .where('id', course.id)
                .update({
                updated_at: new Date()
            });

            await trx.commit();

            res.status(202).json({
                status: 'success',
                message: `Module was successfully ${intendingStatus}`
            });
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },

    /**
     * Update the position a course module
     */
    async updateModulePosition(req, res, next) {
        const { user, params, body } = req;
        const trx = await knex.transaction();

        const genericSuccessResponse = {
            status: 'success',
            message: `Module was moved successfully`
        };

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }

            const courseModule = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!courseModule) {
                throw new NotFoundError('Module not found');
            }

            if (courseModule.position !== body.position) {
                const modulesAtOrBelowNewPosition = await knex.select('id', 'position')
                    .from('course_modules')
                    .where('course_id', course.id)
                    .andWhere('position', '>=', body.position)
                    .andWhereNot('id', params.moduleId);
                
                console.log(modulesAtOrBelowNewPosition);

                await Promise.all(modulesAtOrBelowNewPosition.map(async courseModule => {
                    return knex('course_modules')
                        .transacting(trx)
                        .where('id', courseModule.id)
                        .update({
                        position: courseModule.position + 1,
                        updated_at: new Date()
                    });
                }));
            } else {
                await trx.commit();
                return res.status(202).json(genericSuccessResponse);
            }
            
            await Promise.all([ // In an attempt to achieve concurrency
                knex('course_modules')
                    .transacting(trx)
                    .where('id', params.moduleId)
                    .update({
                        position: body.position,
                        updated_at: new Date()
                    }),
            
                knex('course_modules')
                    .transacting(trx)
                    .where('id', course.id)
                    .update({
                        updated_at: new Date()
                    })
            ]);
            
            await trx.commit();
            
            res.status(202).json(genericSuccessResponse);
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },

    /**
     * Fetch all modules in a course
     */
    async fetchCourseModules(req, res, next) {
        const { params } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            const modules = await knex.select().from('course_modules')
                .where('course_id', course.id)
                .orderBy('position', 'asc')

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: modules
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
        const trx = await knex.transaction();

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (course.creator_id !== user.id) {
                throw new PermissionError();
            }

            const courseModule = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!courseModule) {
                throw new NotFoundError('Module not found');
            }

            await knex('course_modules')
                .transacting(trx)
                .delete()
                .where({ id: params.moduleId });    

            await knex('courses')
                .transacting(trx)
                .where('id', course.id)
                .update({
                    updated_at: new Date()
                });

            await trx.commit();
            
            res.status(202).json({
                status: 'success',
                message: 'Module was successfully deleted',
            });
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },
}
