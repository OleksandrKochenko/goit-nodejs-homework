const nodemailer = require("nodemailer");
require("dotenv").config();

const { UKRNET_EMAIL, UKRNET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465, // 25, 2525
  secure: true,
  auth: {
    user: UKRNET_EMAIL,
    pass: UKRNET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: UKRNET_EMAIL };
  await transport.sendMail(email);
  return true;
};

// const data = {
//   to: "recipient@example.email",
//   subject: "Verify email",
//   html: "<a href="URL/endpoint/:verificationCode">Link to verify email</a>",
// };

module.exports = sendEmail;
