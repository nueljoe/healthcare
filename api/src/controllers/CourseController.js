import knex from '../database';
import _slugify from '../utils/_slugify';
import PaymentReferenceGenerator from '../utils/PaymentReferenceGenerator';
import paystack from '../utils/paystack';
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
            
                knex('courses')
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

    // ************************************************************************* //
    // ************************************************************************* //
    // ***************************** COURSE LECTURES *************************** //
    // ************************************************************************* //
    // ************************************************************************* //

    /**
     * Creates a new course lecture
     */
    async createCourseLecture(req, res, next) {
        const { user, params, body } = req;
        const trx = await knex.transaction();

        try {
            if (!body.video && !body.text) {
                throw new ClientError('Please provide a either a video, text, or both');
            }

            if (user.label === 'member') {
                throw new PermissionError('Ordinary members can not create course lectures');
            }
            
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (course.creator_id !== user.id) {
                throw new PermissionError();
            }

            const courseModule = await knex.first().from('course_modules')
                .where('course_id', course.id)
                .andWhere('id', params.moduleId);

            if (!courseModule) {
                throw new NotFoundError('Module not found');
            }

            // Find the last lecture in the module
            const lectureAtLastPositionInModule = await knex.first('id', 'position')
                .from('course_lectures')
                .where('module_id', courseModule.id)
                .orderBy('position', 'desc');

            const position = lectureAtLastPositionInModule ? lectureAtLastPositionInModule.position + 1 : 1;

            const slug =  _slugify(body.title);

            const [ id ] = await knex('course_lectures')
                .transacting(trx)
                .insert({
                ...body,
                slug,
                position,
                course_id: course.id,
                module_id: courseModule.id
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
                message: 'Lecture was successfully created',
                data: { id, title: body.title, slug, position }
            });
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },
    
    /**
     * Updates a course lecture
     */
    async updateCourseLecture(req, res, next) {
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

            const lecture = await knex.first().from('course_modules').where({ id: params.lectureId });

            if (!lecture) {
                throw new NotFoundError('Lecture not found');
            }

            let slug;

            if (body.title) {
                slug = body.title.toLowerCase() !== course.title.toLowerCase() ? _slugify(body.title) : course.slug;
            }

            await knex('course_lectures')
                .transacting(trx)
                .where('id', lecture.id)
                .update({
                    ...body,
                    slug,
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
                message: 'Lecture was successfully updated',
                data: {
                    ...body,
                    slug
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
    async updateLectureStatus(req, res, next) {
        const { user, params, body: { is_published } } = req;
        const trx = await knex.transaction();

        const intendingStatus = is_published ? 'published' : 'unpublished';

        const genericSuccessResponse = {
            status: 'success',
            message: `This lecture has already been ${intendingStatus}`
        };

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }

            const lecture = await knex.first().from('course_lectures').where({ id: params.lectureId });

            if (!lecture) {
                throw new NotFoundError('Lecture not found');
            }
            
            if (lecture.is_published && is_published) {
               return res.status(202).json(genericSuccessResponse);
            }

            if (!lecture.is_published && !is_published) {
                return res.status(202).json(genericSuccessResponse);
             }

            await knex('course_modules')
                .transacting(trx)
                .where('id', params.lectureId)
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
                message: `Lecture was successfully ${intendingStatus}`
            });
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },

    /**
     * Update the position a course lecture
     */
    async updateLecturePosition(req, res, next) {
        const { user, params, body } = req;
        const trx = await knex.transaction();

        const genericSuccessResponse = {
            status: 'success',
            message: `Lecture was moved successfully`
        };

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (user.id !== course.creator_id) {
                throw new PermissionError();
            }

            const lecture = await knex.first().from('course_lectures').where({
                id: params.lectureId,
                module_id: params.moduleId
            });

            if (!lecture) {
                throw new NotFoundError('Lecture not found');
            }

            const courseModule = await knex.first().from('course_modules').where({ id: body.module_id });

            if (!courseModule) {
                throw new NotFoundError('Unable to move lecture to a module that does not exist');
            }

            const lecturesAtOrBelowNewPosition = await knex.select('id', 'position')
                .from('course_lectures')
                .where('module_id', body.module_id)
                .andWhere('position', '>=', body.position)
                .andWhereNot('id', params.moduleId);
            
            console.log(lecturesAtOrBelowNewPosition);

            await Promise.all(lecturesAtOrBelowNewPosition.map(async lecture => {
                return knex('course_lectures')
                    .transacting(trx)
                    .where('id', lecture.id)
                    .update({
                    position: lecture.position + 1,
                    updated_at: new Date()
                });
            }));
            
            await Promise.all([ // In an attempt to achieve concurrency
                knex('course_lectures')
                    .transacting(trx)
                    .where('id', lecture.id)
                    .update({
                        position: body.position,
                        module_id: body.module_id,
                        updated_at: new Date()
                    }),
            
                knex('courses')
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
     * Fetch all lectures in a course module
     */
    async fetchLecturesInModule(req, res, next) {
        const { params } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            const courseModule = await knex.first().from('course_modules').where({ id: params.moduleId });

            if (!courseModule) {
                throw new NotFoundError('Module not found');
            }

            const lectures = await knex.select().from('course_lectures')
                .where('course_id', course.id)
                .andWhere('module_id', module.id)
                .orderBy('position', 'asc')

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: lectures
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a course lecture
     */
    async fetchLecture(req, res, next) {
        const { params } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });

            if (!course) {
                throw new NotFoundError('Course not found');
            }

            if (course.creator_id !== user.id) {
                throw new PermissionError();
            }

            const lecture = await knex.first().from('course_lectures')
                .where('id', params.lectureId)
                .andWhere('course_id', course.id)

            if (!lecture) {
                throw new NotFoundError('Lecture not found');
            }

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: lecture
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a course lecture
     */
    async deleteCourseLecture(req, res, next) {
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

            const lecture = await knex.first().from('course_lectures').where({ id: params.lectureId });

            if (!lecture) {
                throw new NotFoundError('Lecture not found');
            }

            await knex('course_lectures')
                .transacting(trx)
                .delete()
                .where({ id: lecture.id });

            await knex('courses')
                .transacting(trx)
                .where('id', course.id)
                .update({
                    updated_at: new Date()
                });

            await trx.commit();
            
            res.status(202).json({
                status: 'success',
                message: 'Lecture was successfully deleted',
            });
        } catch (error) {
            await trx.rollback(error);
            next(error);
        }
    },

    // ************************************************************************* //
    // ************************************************************************* //
    // ***************************** COURSE ENROLLMENT *************************** //
    // ************************************************************************* //
    // ************************************************************************* //
    /**
     * Creates a new course enrollment
     * @param { object } payload - An object containing details of the intending enrollment
     * @param { number } payload.course_id - The associated course's ID
     * @param { number } payload.user_id - The ID of the user to be enrolled
     * @param { string | undefined } payload.payment_reference - The payment reference for the course in the
     * case where the course is not free.
     * @param { object } transaction - A DB transaction object
     */
    async enroll({course_id, user_id, payment_reference = ''}, transaction) {
        try {
            await knex('enrolled_courses')
                .transacting(transaction)
                .insert({
                    course_id,
                    user_id,
                    payment_reference
                });

            await transaction.commit();

            res.status(201).json({
                status: 'success',
                message: 'Your have been successfully enrolled'
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    },

    // ************************************************************************* //
    // ************************************************************************* //
    // ***************************** NEW COURSE PAYMENTS *************************** //
    // ************************************************************************* //
    // ************************************************************************* //
    /**
     * Initiates the enrollment of a user into a course
     */
    async initiateCourseEnrollment(req, res, next) {
        const { user, transaction, params } = req;

        try {
            const course = await knex.first().from('courses').where({ slug: params.slug });
            
            if (!course) {
                throw new NotFoundError('Course not found');
            }
            
            if (course.creator_id === user.id) {
                throw new PermissionError('You can not be enrolled in your own course.');
            }

            const sameCourseEnrolled = await knex.first().from('enrolled_courses').where({
                course_id: course.id,
                user_id: user.id
            });

            if (sameCourseEnrolled) {
                throw new PermissionError('You are already enrolled in this course');
            }

            // Enroll the user immediately if the course is free.
            if (!course.price) {
                await knex('enrolled_courses')
                .transacting(transaction)
                .insert({
                    course_id,
                    user_id,
                    payment_reference
                });

                await transaction.commit();

                return res.status(201).json({
                    status: 'success',
                    message: 'You have been successfully enrolled'
                });
            }

            const PRG = new PaymentReferenceGenerator({
                user_id: user.id,
                user_email: user.email,
                course_slug: course.slug
            });

            const amount = course.discount ? course.price - (course.price * course.discount) : course.price;

            await knex('payments')
                .transacting(transaction)
                .insert({
                    amount,
                    resource: 'course',
                    resource_id: course.id,
                    user_id: user.id,
                    reference: PRG.reference,
                });

            const paystackResponse = await paystack.initiatePayment({
                amount,
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
                        display_name: 'Course ID',
                        variable_name: 'course_id',
                        value: course.id
                    },
                    {
                        display_name: 'Course',
                        variable_name: 'course_title',
                        value: course.title
                    }
                  ]  
                })
            });

            if (!paystackResponse.status) {
                throw new Error(paystackResponse.message);
            }

            await transaction.commit();

            res.status(201).json({
                status: 'success',
                message: 'Payment was successfully initialized',
                data: paystackResponse.data
            });
        } catch (error) {
            await transaction.rollback(error);
            next(error);
        }
    }
}
