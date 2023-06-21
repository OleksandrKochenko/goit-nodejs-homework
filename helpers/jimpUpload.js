const Jimp = require("jimp");

const jimpUpload = async (pathToImg) => {
  const image = await Jimp.read(pathToImg);

  await image.resize(250, 250);

  await image.writeAsync(pathToImg);
};

module.exports = jimpUpload;
