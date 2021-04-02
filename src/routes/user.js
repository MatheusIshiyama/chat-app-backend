const express = require("express");
const userRoutes = express.Router();

userRoutes.get('/', (req, res) => {
    res.sendStatus(200);
})

module.exports = userRoutes;
