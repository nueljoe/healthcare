import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnUpdate = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    gender: Joi.string(),
    bio: Joi.string().allow(''),
});

const schemaOnAvatarUpdate = Joi.object({
    avatar: Joi.binary().allow('').required(),
});

export default {
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
    validateBodyOnAvatarUpdate: Validator.validateBody(schemaOnAvatarUpdate),
}
