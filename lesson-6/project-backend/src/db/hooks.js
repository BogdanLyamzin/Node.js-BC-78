export const handleSaveError = (error, doc, next)=> {
  error.status = 400;
  next();
};

export const setUpdateRules = function() {
  this.options.runValidators = true;
  this.options.new = true;
};
