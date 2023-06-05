const { HttpError } = require("../helpers");
const { schemas } = require("./schemas/schemas");

const validateData = (req, res, next) => {
  const checkBody = Object.keys(req.body).length;
  if (checkBody === 0) {
    throw HttpError(400, "missing fields");
  }
  const { error } = schemas.contactsAddSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  next();
};

module.exports = validateData;
