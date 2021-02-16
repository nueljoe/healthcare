import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    title: Joi.string().required(),
    overview: Joi.string().allow(''),
    text: Joi.string().allow(''),
    video_url: Joi.binary().allow(''),
    downloadable_file_url: Joi.binary().allow(''),
    allow_preview: Joi.boolean(),
    is_published: Joi.boolean(),
});

const schemaOnUpdate = Joi.object({
    title: Joi.string(),
    overview: Joi.string().allow(''),
    text: Joi.string().allow(''),
    video_url: Joi.binary().allow(''),
    downloadable_file_url: Joi.binary().allow(''),
    allow_preview: Joi.boolean(),
    is_published: Joi.boolean(),
});

const schemaOnStatusUpdate = Joi.object({
    is_published: Joi.boolean().required(),
});

const schemaOnPositionUpdate = Joi.object({
    module_id: Joi.number().required(),
    position: Joi.number().required(),
});

export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
    validateBodyOnStatusUpdate: Validator.validateBody(schemaOnStatusUpdate),
    validateBodyOnPositionUpdate: Validator.validateBody(schemaOnPositionUpdate),
}
