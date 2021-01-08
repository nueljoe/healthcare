import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
    label: Joi.string().required().label('Label'),
    parent_id: Joi.number().allow('', null)
});

const schemaOnUpdate = Joi.object({
    label: Joi.string().required().label('Label'),
    parent_id: Joi.number().allow('', null),
    is_active: Joi.boolean()
});

/** A Joi schema for validating product and course category data from clients */
export default {
    validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
    validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
}
