import knex from '../database';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a product category
     */
    async createCategory(req, res, next) {
        const { body, user } = req;

        try {
            // if (user.label !== 'admin') {
            //     throw new PermissionError();
            // }
            
            const duplicateCategory = await knex.first('id')
            .from('product_categories')
            .where('label', body.label)
            .orWhere('label', body.label.toLowerCase());
            
            if (duplicateCategory) {
                throw new ClientError('A category with a similar label already exists');
            }

            const data = { label: body.label.toLowerCase() };
            
            if (body.parent_id) {
                const parent = await knex.first('id').from('product_categories')
                    .where('parent_id', body.parent_id)

                if (!parent) {
                    throw new ClientError('Parent category does not exist');
                }

                data.parent_id = body.parent_id;
            }

            await knex('product_categories')
                .insert(data);

            res.status(201).json({
                status: 'success',
                message: 'Category successfully created',
                data: body
            })
        } catch (error) {
            next(error);
        }
    },

    /**
     * Updates product category
     */
    async updateCategory(req, res, next) {
        const { user, params, body } = req;

        try {
            // if (user.label !== 'admin') {
            //     throw new PermissionError();
            // }

            const category = await knex.first('id')
                    .from('product_categories')
                    .where('id', params.id);

            if (!category) {
                throw new ClientError('Category not found');
            }

            const data = {};

            if (body.label) {
                const duplicateCategory = await knex.first('id')
                .from('product_categories')
                    .where('id', '!=', params.id)
                    .andWhere('label', body.label)

                console.log(duplicateCategory);
                
                if (duplicateCategory) {
                    throw new ClientError('A category with a similar label already exists');
                }

                data.label = body.label.toLowerCase();
            }

            
            if (body.parent_id) {
                const parent = await knex.first('id').from('product_categories')
                    .where('id', body.parent_id)

                if (!parent) {
                    throw new ClientError('Parent category does not exist');
                }

                data.parent_id = body.parent_id;
            }

            await knex('product_categories')
                .where('id', params.id)
                .update({
                    ...body,
                    ...data
                });

            res.status(201).json({
                status: 'success',
                message: 'Category successfully updated',
            })
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches all product categories
     */
    async fetchCategories(req, res, next) {
        const { query: { active, is_parent } } = req;

        const whereClause = {};

        try {
            if (active !== undefined)  {
                whereClause.is_active = active;
            }

            if (is_parent) {
                whereClause.parent_id = null
            }

            const categories = await knex.select('id', 'label', 'parent_id')
                .from('product_categories')
                .andWhere(whereClause)

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: categories
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches all subscategories of a category
     */
    async fetchSubcategories(req, res, next) {
        const { params, query: { active } } = req;

        const whereClause = {};

        try {
            if (active !== undefined)  {
                whereClause.is_active = active;
            }

            const categories = await knex.select('id', 'label', 'parent_id')
                .from('product_categories as category')
                .where('parent_id', params.id)
                .andWhere(whereClause);

            res.status(200).json({
                status:'success',
                message: 'Query successful',
                data: categories
            });    
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a category
     */
    async deleteCategory(req, res, next) {
        const { params } = req;

        try {
            const category = await knex.first('id')
                    .from('product_categories')
                    .where('id', params.id);

            if (!category) {
                throw new ClientError('Category not found');
            }

            // const productInCategory = await knex.first().from('products')
            //     .where('category_id', params.id)
            //     .orWhere('subcategory_id', params.id);

            // if (productInCategory) {
            //     throw new PermissionError('Unable to complete. This category is in use. You can make it inactive instead');
            // }

            await knex.delete().from('product_categories').where('id', params.id);

            res.status(200).json({
                status: 'success',
                message: 'Successfully deleted category'
            });
        } catch (error) {
            next(error);
        }
    },
};