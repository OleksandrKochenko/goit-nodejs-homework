const express = require("express");

const {
  signUp,
  verify,
  resendVerify,
  signIn,
  getCurrentUser,
  logout,
  updateSubscription,
  updateAvatar,
} = require("./api");
const validateUserRegister = require("../../middlewares/validateUserRegister");
const validateUserLogIn = require("../../middlewares/validateUserLogIn");
const authentificate = require("../../middlewares/authentificate");
const validateSubscriptionData = require("../../middlewares/validateSubscriptionData");
const validateUserEmail = require("../../middlewares/validateUserEmail");
const { upload } = require("../../middlewares");

const router = express.Router();

router.post("/register", validateUserRegister, signUp);

router.get("/verify/:verificationToken", verify);

router.post("/verify", validateUserEmail, resendVerify);

router.post("/login", validateUserLogIn, signIn);

router.get("/current", authentificate, getCurrentUser);

router.post("/logout", authentificate, logout);

router.patch("/", authentificate, validateSubscriptionData, updateSubscription);

router.patch("/avatars", authentificate, upload.single("avatar"), updateAvatar); // upload.array('avatar', 8) // upload.fields([{name: 'avatar', maxCount: 2}])

module.exports = router;
