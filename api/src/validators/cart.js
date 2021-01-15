import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    product_id: Joi.number().required(),
    quantity: Joi.number().allow('').positive().default(1),
});

const schemaOnUpdate = Joi.object({
    quantity: Joi.number().required(),
});

const schemaOnCheckout = Joi.object({
    payment_type: Joi.string().required().regex(/^online|cash$/),
});

export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
    validateBodyOnCheckout: Validator.validateBody(schemaOnCheckout),
}
