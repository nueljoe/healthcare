import knex from '../database';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a new course
     */
    async createCourse(req, res, next) {
        const { user, body } = req;

        try {
            // if (user.label === 'member') {
            //     throw new PermissionError('Ordinary menbers can not create courses')
            // }

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

            await knex('courses').insert({
                ...body,
                creator_id: user.id
            });

            res.status(201).json({
                status: 'success',
                message: 'Course was successfully created'
            });
        } catch (error) {
            next(error);
        }
    }
}
