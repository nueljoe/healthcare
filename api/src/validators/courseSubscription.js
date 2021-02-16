import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    billing_duration: Joi.string().required().regex(/^monthly|annual$/),
    plan_id: Joi.number().positive().required(),
});

const schemaOnUpdate = Joi.object({
    label: Joi.string(),
    price: Joi.number().min(0),
    is_public: Joi.boolean(),
    annual_billing_discount: Joi.number().min(0).max(1),
});

export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
}
