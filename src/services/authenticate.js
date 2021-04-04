const User = require("../models/user");
const checkPassword = require("./password");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = async (username, password, res) => {
    if (!username)
        return res.status(400).json({ message: "No username provided" });

    if (!password)
        return res.status(400).json({ message: "No password provided" });

    const userExists = await User.findOne({ username });

    if (userExists) {
        const isValid = checkPassword.validate(password, userExists.password);

        if (isValid) {
            userExists.password = undefined;

            if (!userExists.verified)
                return res.status(401).json({ message: "User unverified" });

            const token = jwt.sign(
                { id: userExists._id },
                process.env.JWT_SECRET
            );

            return res.status(202).json({ token });
        }

        return res
            .status(401)
            .json({ message: "Invalid username or password" });
    }
    return res.status(401).json({ message: "Invalid username or password" });
};

module.exports = authenticate;
