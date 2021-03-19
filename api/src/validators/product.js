import Joi from 'joi';
import Validator from '../utils/Validator';

const schemaOnCreate = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.string().allow(''),
  price: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(1).default(0),
  stock: Joi.number().integer().min(0).allow(''),
  category_id: Joi.number().required(),
  subcategory_id: Joi.number().allow(''),
});

const schemaOnUpdate = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  tags: Joi.string().allow(''),
  price: Joi.number().min(0),
  discount: Joi.number().min(0).max(1).default(0),
  stock: Joi.number().min(0).integer().allow(''),
  category_id: Joi.number(),
  subcategory_id: Joi.number().allow(''),
});

const schemaOnStatusUpdate = Joi.object({
  is_published: Joi.boolean().required(),
});

export default {
  validateBodyOnCreate: Validator.validateBody(schemaOnCreate),
  validateBodyOnUpdate: Validator.validateBody(schemaOnUpdate),
  validateBodyOnStatusUpdate: Validator.validateBody(schemaOnStatusUpdate),
};
