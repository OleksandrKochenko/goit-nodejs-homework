const { HttpError } = require("../helpers");
const { schemas } = require("./schemas/users-schemas");

const validateUserRegister = (req, res, next) => {
  const { error } = schemas.userRegisterSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  next();
};

module.exports = validateUserRegister;
