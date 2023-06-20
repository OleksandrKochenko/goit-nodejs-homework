const { schemas } = require("./schemas/contacts-schemas");
const { HttpError } = require("../helpers");

const validatePatchData = (req, res, next) => {
  const { error } = schemas.contactsPatchSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  next();
};

module.exports = validatePatchData;
