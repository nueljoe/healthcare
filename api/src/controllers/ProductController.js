import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import knex from '../database';
import _slugify from '../utils/_slugify';
import removeFile from '../utils/removeFile';
import PaymentReferenceGenerator from '../utils/PaymentReferenceGenerator';
import paystack from '../utils/paystack';
import { ClientError, NotFoundError, PermissionError } from '../errors';

export default {
    /**
     * Creates a new product
     */
    async createProduct(req, res, next) {
        const { file, user, body } = req;

        try {
            if (user.label !== 'admin') {
                throw new PermissionError();
            }

            const category = await knex.first('id', 'label', 'parent_id').from('product_categories')
                .where('id', body.category_id)
                .andWhere('is_active', true);
            
            if (!category) {
                throw new ClientError('Invalid category');
            }

            if (category.parent_id) {
                throw new ClientError(`${category.label} is a subcategory`);
            }

            if (body.subcategory_id) {
                const subcategory = await knex.first('id').from('product_categories')
                    .where('id', body.subcategory_id)
                    .andWhere('is_active', true)
                    .andWhere('parent_id', body.category_id);
                
                if (!subcategory) {
                    throw new ClientError('Invalid subcategory');
                }
            }

            const slug =  _slugify(body.name);

            let filePath = '';
            
            if (file) {
                filePath = `images/products/${slug}.jpeg`;

                // First, upload the file to the cloud or save locally. Then proceed if successful
                await sharp(file.buffer)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(path.resolve(__dirname, `../public/${filePath}`), (err, info) => {
                        console.log(err)
                    }); // For now, let's save on disk. We'll push files to the cloud later.
            }


            const [ id ] = await knex('products').insert({
                ...body,
                slug,
                img_url: filePath,
                creator_id: user.id
            });

            res.status(201).json({
                status: 'success',
                message: 'Product was successfully created',
                data: { id, slug }
            });
        } catch (error) {
            next(error);
        }
    },
    
    /**
     * Updates a product
     */
    async updateProduct(req, res, next) {
        const { user, file, params, body } = req;

        try {
            const product = await knex.first().from('products').where({ slug: params.slug });

            if (!product) {
                throw new NotFoundError('Product not found. Please ensure that the url is correct.');
            }

            if (user.id !== product.creator_id) {
                throw new PermissionError();
            }

            if (body.category_id && body.category_id !== product.category_id) {
                const category = await knex.first('id', 'label', 'parent_id').from('product_categories')
                    .where('id', body.category_id)
                    .andWhere('is_active', true);
                
                if (!category) {
                    throw new ClientError('Invalid category');
                }
    
                if (category.parent_id) {
                    throw new ClientError(`${category.label} is a subcategory`);
                }
            }

            if (body.subcategory_id  && body.subcategory_id !== product.subcategory_id) {
                const subcategory = await knex.first('id').from('product_categories')
                    .where('id', body.subcategory_id)
                    .andWhere('is_active', true)
                    .andWhere('parent_id', body.category_id);
                
                if (!subcategory) {
                    throw new ClientError('Invalid subcategory');
                }
            }

            let slug;

            if (body.name) {
                slug = body.name !== product.name ? _slugify(body.name) : product.slug;
            }

            let filePath = '';
            
            if (file) {
                filePath = `images/products/${slug || product.slug}.jpeg`;

                // First, upload the file to the cloud or save locally. Then proceed if successful
                await sharp(file.buffer)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(path.resolve(__dirname, `../public/${filePath}`), (err, info) => {
                        console.log(err)
                    }); // For now, let's save on disk. We'll push files to the cloud later.
            }

            if (file && body.name && body.name !== product.name) {
                // Deletes the older file
                fs.unlink(path.resolve(__dirname, `../public/${product.img_url}`), (err) => {
                    throw new Error('Unable to complete upload');
                });
            }


            await knex('products')
                .where('id', product.id)
                .update({
                ...body,
                img_url: filePath,
                slug,
                updated_at: new Date()
            });

            res.status(200).json({
                status: 'success',
                message: 'Product was successfully updated',
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
     * Publishes/Unpublishes a product
     */
    async updateStatus(req, res, next) {
        const { user, params, body: { is_published } } = req;

        const intendingStatus = is_published ? 'published' : 'unpublished';

        const genericSuccessResponse = {
            status: 'success',
            message: `This product has already been ${intendingStatus}`
        };

        try {
            const product = await knex.first().from('products').where({ slug: params.slug });

            if (!product) {
                throw new NotFoundError('Product not found');
            }

            if (user.id !== product.creator_id) {
                throw new PermissionError();
            }
            
            if (product.is_published && is_published) {
               return res.status(200).json(genericSuccessResponse);
            }

            if (!product.is_published && !is_published) {
                return res.status(200).json(genericSuccessResponse);
             }


            await knex('products')
                .where('id', product.id)
                .update({
                is_published,
                updated_at: new Date()
            });

            res.status(200).json({
                status: 'success',
                message: `Product was successfully ${intendingStatus}`
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetch all products
     */
    async fetchProducts(req, res, next) {
        const { limit, offset } = req;

        try {
            const products = await knex
                .select('name', 'slug', 'img_url', 'tags', 'price', 'discount', 'stock')
                .from('products')
                .orderBy('created_at', 'desc')
                .offset(offset)
                .limit(limit);

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: products
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches a product's details
     */
    async fetchProduct(req, res, next) {
        const { params } = req;

        try {
            const product = await knex
                .first()
                .from('products')
                .where({ slug: params.slug });

            if (!product) {
                throw new NotFoundError('Product not found');
            }

            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: product
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a product
     */
    async deleteProduct(req, res, next) {
        const { user, params: { slug } } = req;

        try {
            const product = await knex.first().from('products').where({ slug });

            if (!product) {
                throw new NotFoundError('Product not found');
            }

            if (user.id !== product.creator_id) {
                throw new PermissionError();
            }

            // We must check first if the product has ever been ordered

            // Delete associated images
            await removeFile(product.img_url);

            await knex('products').delete().where({ slug });

            res.status(200).json({
                status: 'success',
                message: 'Product was successfully deleted',
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Adds a set of new variant of product images
     * 
     */
    async addProductImages(req, res, next) {
        const { files } = req;

        try {
            const imgMetaData = [];
            res.status(201).json({
                status: 'success',
                message: 'Image was added successfully'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Fetches all the variants of a product image
     */
    async fetchProductImages(req, res, next) {
        const { params } = req;

        try {


            res.status(200).json({
                status: 'success',
                message: 'Query successful',
                data: []
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Deletes a variant of a product image
     */
    async removeProductImage(req, res, next) {
        const { params } = req;

        try {
            res.status(200).json({
                status: 'success',
                message: 'Image was removed successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}


