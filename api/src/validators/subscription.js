import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    email: Joi.string() 
        .email().required().label('Email')
});

const schemaOnUpdate = Joi.object({
    allow_newsletters: Joi.boolean().label('Allow Newsletters'),
    allow_promotions: Joi.boolean().label('Allow Promotions'),
});

const schemaOnDelete = schemaOnCreate;

export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
    validateBodyOnDelete: Validator.validateBody(schemaOnDelete),
}
