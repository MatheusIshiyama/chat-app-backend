const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const socketAuth = async (socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return undefined;

        const id = decoded.id;
        socket.user = await User.findOne({ _id: id });
        next();
    });
};

module.exports = socketAuth;
