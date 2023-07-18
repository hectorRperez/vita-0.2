const Joi = require('joi');

const postSchema = Joi.object({
  id: Joi.string().optional(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  image: Joi.string().uri().optional(),
});

module.exports = postSchema;
