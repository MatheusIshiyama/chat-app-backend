const crypto = require("crypto");
const User = require("../models/user");
const sendMail = require("../services/sendMail");
const password = require("../services/password");

const UserController = {
    async register(req, res) {
        const body = req.body;
        const hashPassword = password.hash(body.password);
        const verifyCode = crypto.randomBytes(128).toString("base64");
        const newUser = new User({
            username: body.username.toLowerCase(),
            name: body.name,
            email: body.email,
            verifyCode,
            verified: false,
            password: hashPassword,
            createdAt: Date.now(),
        });
        await newUser.save();

        const user = await User.findOne(
            { username: body.username },
            { _id: false, password: false }
        );

        await sendMail(body.email, verifyCode, "Confirm register");

        return res.status(201).json({ message: user });
    },

    async confirm(req, res) {
        const { verifyCode } = req.params;

        await User.findOneAndUpdate(
            { verifyCode },
            { verifyCode: "verified", verified: true }
        );

        return res.status(200).json({ message: "User confirmed" });
    },
};

module.exports = UserController;
