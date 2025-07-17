import Joi from 'joi';

export const createMessageSchema = Joi.object({
  text: Joi.string().min(1).required(), 
  homepage: Joi.string().uri().allow(null),
  fileUrl: Joi.string().uri().allow(null),
  fileType: Joi.string().valid('image', 'text').allow(null),
  parentId: Joi.number().integer().allow(null),
});