const { HttpError } = require("../helpers");
const { schemas } = require("./schemas/users-schemas");

const validateSubscriptionData = (req, res, next) => {
  const { error } = schemas.userUpdateSubscriptionSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  next();
};

module.exports = validateSubscriptionData;
