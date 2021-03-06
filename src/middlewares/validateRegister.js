const User = require("../models/user");
const EmailValidator = require("email-validator");
const validateBody = require("../services/validateBody");

const validateRegister = async (req, res, next) => {
    const { username, name, email, password, checkPassword } = req.body;

    //* validate body
    if (!validateBody.username(username)) {
        return res
            .status(400)
            .json({ error: "No username provided or no length accept" });
    }

    if (!validateBody.name(name))
        return res
            .status(400)
            .json({ error: "No name provided or no length accept" });

    if (!EmailValidator.validate(email))
        return res
            .status(400)
            .json({ error: "No email provided or invalid format" });

    if (!validateBody.password(password))
        return res
            .status(400)
            .json({ error: "No password provided or doesn't match params" });

    if (!validateBody.checkPassword(password, checkPassword))
        return res.status(400).json({
            error: "No checkPassword provided or passwords doesn't match",
        });

    //* verify if user exists
    const userExists = await User.findOne({ username: username.toLowerCase() });
    const emailExists = await User.findOne({ email });

    if (userExists || emailExists)
        return res
            .status(400)
            .json({ error: "Username or Email already exists" });

    next();
};

module.exports = validateRegister;
