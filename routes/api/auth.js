const express = require("express");

const { signUp, signIn, getCurrentUser, logout } = require("./api");
const validateUserRegister = require("../../middlewares/validateUserRegister");
const validateUserLogIn = require("../../middlewares/validateUserLogIn");
const authentificate = require("../../middlewares/authentificate");

const router = express.Router();

router.post("/register", validateUserRegister, signUp);

router.post("/login", validateUserLogIn, signIn);

router.get("/current", authentificate, getCurrentUser);

router.post("/logout", authentificate, logout);

module.exports = router;
