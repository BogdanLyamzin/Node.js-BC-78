import { Schema, model } from "mongoose";

import { typeList, emailRegexp, phoneRegexp } from "../../constants/contactContants.js";

import { handleSaveError, setUpdateRules } from "../hooks.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: emailRegexp,
    required: true
  },
  phone: {
    type: String,
    match: phoneRegexp,
    required: true
  },
  type: {
    type: String,
    enum: typeList,
    default: "other",
    required: true,
  }
}, {versionKey: false, timestamps: true});

contactSchema.index({
  name: "text",
  lastName: "text",
  email: "text",
  phone: "text"
});

export const contactsSortFields = ["_id", "name", "lastName", "email", "phone", "type", "createdAt", "updatedAt"];

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateRules);

contactSchema.post("findOneAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
