const express = require("express");
const authRoutes = express.Router();
const authenticate = require("../services/authenticate");
const validateAuth = require("../middlewares/validateAuth");

authRoutes.post("/", validateAuth, async (req, res) => {
    const { username, password } = req.body;
    await authenticate(username, password, res);
});

module.exports = authRoutes;
