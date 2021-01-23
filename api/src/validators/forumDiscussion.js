import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreateDiscussion = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().allow(''),
});

const schemaOnCreateComment = Joi.object({
    body: Joi.string().required(),
});

export default {
    validateBodyOnCreateDiscussion: Validator.validateBody(schemaOnCreateDiscussion),
    validateBodyOnCreateComment: Validator.validateBody(schemaOnCreateComment),
}
