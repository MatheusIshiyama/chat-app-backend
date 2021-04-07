const express = require("express");
const userRoutes = express.Router();

//* controller
const UserController = require("../controllers/user");

//* middlewares
const validateRegister = require("../middlewares/validateRegister");
const validateCode = require("../middlewares/validateCode");
const authenticate = require("../middlewares/authenticate");

userRoutes.get("/", authenticate, (req, res) => {
    UserController.user(req, res);
});

userRoutes.post("/register", validateRegister, (req, res) => {
    UserController.register(req, res);
});

userRoutes.post("/confirm", validateCode, (req, res) => {
    UserController.confirm(req, res);
});

module.exports = userRoutes;
