import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnFetch = Joi.object({
    status: Joi.string().regex(/^delivered|cancelled$/),
});

export default {
    validateQueryOnFetch: Validator.validateQuery(schemaOnFetch),
}
