const User = require("../models/user");

const validateFriend = async (req, res, next) => {
    const { friendId } = req.body;

    if (!friendId)
        return res.status(400).json({ error: "No friendId provided" });

    try {
        const isValid = await User.findOne({ _id: friendId });

        if (!isValid)
            return res.status(404).json({ error: "User not found" });

        if (!isValid.verified)
            return res.status(404).json({ error: "User unverified" });
    } catch (error) {
        return res.status(404).json({ error: "User not found" });
    }

    next();
};

module.exports = validateFriend;
