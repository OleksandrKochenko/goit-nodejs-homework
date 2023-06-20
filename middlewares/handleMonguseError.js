const handleMongooseError = (err, data, next) => {
  const { code, name } = err;
  console.log(code);
  console.log(name);
  err.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
  next();
};

module.exports = handleMongooseError;
