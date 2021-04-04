const express = require("express");
const authRoutes = express.Router();
const authenticate = require("../services/authenticate");
const validateAuth = require('../middlewares/validateAuth');

authRoutes.post("/", validateAuth, (req, res) => {
    const { username, password } = req.body;
    authenticate(username, password, res);
});

module.exports = authRoutes;
