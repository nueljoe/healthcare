import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
});

const schemaOnUpdate = Joi.object({
    title: Joi.string(),
    description: Joi.string(),
});

const schemaOnStatusUpdate = Joi.object({
    is_published: Joi.boolean().required(),
});

const schemaOnPositionUpdate = Joi.object({
    position: Joi.number().required(),
});

export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
    validateBodyOnStatusUpdate: Validator.validateBody(schemaOnStatusUpdate),
    validateBodyOnPositionUpdate: Validator.validateBody(schemaOnPositionUpdate),
}
