const User = require("../models/user");
const EmailValidator = require("email-validator");
const validateBody = require("../services/validateBody");

module.exports = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "No body provided" });
    const { username, name, email, password, checkPassword } = req.body;

    //* validate body
    if (!validateBody.username(username)) {
        return res
            .status(400)
            .json({ message: "No username provided or no length accept" });
    }

    if (!validateBody.name(name))
        return res
            .status(400)
            .json({ message: "No name provided or no length accept" });

    if (!EmailValidator.validate(email))
        return res
            .status(400)
            .json({ message: "No email provided or invalid format" });

    if (!validateBody.password(password))
        return res
            .status(400)
            .json({ message: "No password provided or doesn't match params" });

    if (!validateBody.checkPassword(password, checkPassword))
        return res.status(400).json({
            message: "No checkPassword provided or passwords doesn't match",
        });

    //* verify if user exists
    const userExists = await User.findOne({ username });
    const emailExists = await User.findOne({ email });

    if (userExists || emailExists)
        return res.status(400).json({ message: "Username or Email already exists"});

    next();
};
