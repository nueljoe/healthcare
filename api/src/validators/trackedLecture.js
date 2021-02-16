import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnTrack = Joi.object({
    watched_duration: Joi.string().required()
});

export default {
    validateBodyOnTrack: Validator.validateBody(schemaOnTrack)
}