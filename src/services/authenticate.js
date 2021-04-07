const User = require("../models/user");
const checkPassword = require("./password");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = async (username, password, res) => {
    if (!username)
        return res.status(400).json({ error: "No username provided" });

    if (!password)
        return res.status(400).json({ error: "No password provided" });

    username = username.toLowerCase();

    const userExists = await User.findOne({ username });

    if (userExists) {
        const isValid = checkPassword.validate(password, userExists.password);

        if (isValid) {
            userExists.password = undefined;

            const token = jwt.sign(
                { id: userExists._id },
                process.env.JWT_SECRET,
                {
                    expiresIn: 7 * 24 * 60 * 60,
                }
            );

            return res.status(202).json({ token });
        }

        return res.status(401).json({ error: "Invalid username or password" });
    }
    return res.status(401).json({ error: "Invalid username or password" });
};

module.exports = authenticate;
