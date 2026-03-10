import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

import { typeList, phoneRegexp, emailRegexp } from "../constants/contactContants.js";

const objectIdValidator = (value, helpers)=> {
  return isValidObjectId(value) ? value : helpers.message("invalid id format");
}

const idSchema = Joi.object({
  id: Joi.string().custom(objectIdValidator).required(),
});

export const createContactSchema = {
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2).required().messages({
      "any.required": "name must be exist",
      "string.base": "name must be string",
      "string.min": "name must contain at least {#} symbols"
    }),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    phone: Joi.string().pattern(phoneRegexp).required(),
    type: Joi.string().valid(...typeList),
  }).prefs({abortEarly: false})
}

export const contactIdSchema = {
  [Segments.PARAMS]: idSchema,
}

export const updateContactSchema = {
  [Segments.PARAMS]: idSchema,
  [Segments.BODY]: Joi.object({
    name: Joi.string().min(2),
    lastName: Joi.string().min(1),
    email: Joi.string().pattern(emailRegexp),
    phone: Joi.string().pattern(phoneRegexp),
    type: Joi.string().valid(...typeList),
  }).prefs({abortEarly: false}).min(1).messages({
    "object.min": "body must have at least 1 property"
  })
}
