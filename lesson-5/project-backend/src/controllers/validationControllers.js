import * as contactConstants from "../constants/contactContants.js";

const rules = {
  contacts: contactConstants,
}

export const getAllValidations = (req, res)=> {
  res.json(rules)
}

export const getValidationByName = (req, res)=> {
  const {name} = req.params;
  res.json(rules[name]);
}
