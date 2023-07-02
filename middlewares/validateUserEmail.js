const { HttpError } = require("../helpers");
const { schemas } = require("./schemas/users-schemas");

const validateUserEmail = (req, res, next) => {
  const { error } = schemas.userEmailSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  next();
};

module.exports = validateUserEmail;
