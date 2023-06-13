const express = require("express");

const {
  signUp,
  signIn,
  getCurrentUser,
  logout,
  updateSubscription,
} = require("./api");
const validateUserRegister = require("../../middlewares/validateUserRegister");
const validateUserLogIn = require("../../middlewares/validateUserLogIn");
const authentificate = require("../../middlewares/authentificate");
const validateSubscriptionData = require("../../middlewares/validateSubscriptionData");

const router = express.Router();

router.post("/register", validateUserRegister, signUp);

router.post("/login", validateUserLogIn, signIn);

router.get("/current", authentificate, getCurrentUser);

router.post("/logout", authentificate, logout);

router.patch("/", authentificate, validateSubscriptionData, updateSubscription);

module.exports = router;
