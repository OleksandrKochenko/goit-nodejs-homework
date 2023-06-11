const Joi = require("joi");

const userRegisterSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string()
    .pattern(/^\S+@\S+\.\S+$/)
    .required()
    .messages({
      "any.required": `missing required email field`,
      "string.pattern.base": `invalid email`,
    }),
  password: Joi.string().min(6).required().messages({
    "any.required": `missing required password field`,
    "string.min": "invalid length of password",
  }),
});

const userLoginSchema = Joi.object({
  email: Joi.string()
    .pattern(/^\S+@\S+\.\S+$/)
    .required()
    .messages({
      "any.required": `missing required email field`,
      "string.pattern.base": `invalid email`,
    }),
  password: Joi.string().required().messages({
    "any.required": `missing required password field`,
  }),
});

const schemas = { userRegisterSchema, userLoginSchema };

module.exports = { schemas };
