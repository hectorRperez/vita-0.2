const joi = require("joi");

/// create a joi schema for users
const Joi = require("joi");

const UserSchema = Joi.object({
  id: Joi.string().guid().optional(),
  name: Joi.string().required(),
  lastname: Joi.string().required(),
  image: Joi.string().uri().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  type: Joi.string().valid("ADMIN", "CLIENT").optional(),
});

module.exports = UserSchema;
