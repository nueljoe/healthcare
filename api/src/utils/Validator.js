import Joi from 'joi';
import ClientError from '../errors/ClientError';

export default class Validator {
    static validateBody(schema) {
        return async (req, res, next) => {
            try {
                await Validator.validate(schema, req.body);
                next();
            } catch (error) {
                next(error)
            }
        }
    }

    static validateQuery(schema) {
        return async (req, res, next) => {
            try {
                await Validator.validate(schema, req.query);
                next();
            } catch (error) {
                next(error)
            }
        }
    }

    static async validate(schema, data) {
        try {
            const { value, error } = await schema.validate(data);

            if (error) {
                throw new ClientError(error.message);
            }
        } catch (error) {
            throw error;
        }
    }
}
