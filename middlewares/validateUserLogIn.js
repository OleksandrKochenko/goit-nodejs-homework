const { HttpError } = require("../helpers");
const { schemas } = require("./schemas/users-schemas");

const validateUserLogIn = (req, res, next) => {
  const { error } = schemas.userLoginSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  next();
};

module.exports = validateUserLogIn;
