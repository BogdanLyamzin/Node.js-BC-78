import { Joi, Segments } from "celebrate";

import { emailRegexp } from "../constants/contactContants.js";

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required()
  })
}

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required()
  })
}

