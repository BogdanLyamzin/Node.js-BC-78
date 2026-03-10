import * as contactConstants from "../constants/contactContants.js";

const transformDataForSend = rules => {
  const result = {};

  for (const [key, value] of Object.entries(rules)) {
    if (value instanceof RegExp) {
      result[key] = {
        source: value.source,
        flags: value.flags,
      };
      continue;
    }
      result[key] = value;
  }

  return result;
}

const rules = transformDataForSend({
  contacts: contactConstants,
});

export const getAllValidations = (req, res)=> {
  res.json(rules)
}

export const getValidationByName = (req, res)=> {
  const {name} = req.params;
  res.json(rules[name]);
}




