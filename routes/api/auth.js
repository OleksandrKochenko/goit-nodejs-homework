const express = require("express");

const { signUp, signIn } = require("./api");
const validateUserRegister = require("../../middlewares/validateUserRegister");
const validateUserLogIn = require("../../middlewares/validateUserLogIn");

const router = express.Router();

router.post("/register", validateUserRegister, signUp);

router.post("/login", validateUserLogIn, signIn);

module.exports = router;
