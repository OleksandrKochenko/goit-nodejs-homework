const multer = require("multer");
const path = require("path");

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  // filename: (req, file, cb) => {
  //   const uniqPrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //   const { originalname } = file;
  //   const filename = `${uniqPrefix}_${originalname}`;
  //   cb(null, filename);
  // },
});

const upload = multer({ storage });

module.exports = upload;
