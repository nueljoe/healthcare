import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    title: Joi.string().required(),
    banner: Joi.binary().required(),
    description: Joi.string().required(),
    tags: Joi.string(),
    requirements: Joi.string(),
    category_id: Joi.number().required(),
    subcategory_id: Joi.number().required(),
});

const schemaOnUpdate = Joi.object({
    title: Joi.string(),
    banner: Joi.binary(),
    description: Joi.string(),
    tags: Joi.string(),
    requirements: Joi.string(),
    category_id: Joi.number(),
    subcategory_id: Joi.number(),
});

export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
}
