import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    label: Joi.string().required(),
    price_per_month: Joi.number().min(0).required(),
    is_public: Joi.boolean(),
    annual_billing_discount: Joi.number().min(0).max(1),
});

const schemaOnUpdate = Joi.object({
    label: Joi.string(),
    price_per_month: Joi.number().min(0),
    is_public: Joi.boolean(),
    annual_billing_discount: Joi.number().min(0).max(1),
});

export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
}
