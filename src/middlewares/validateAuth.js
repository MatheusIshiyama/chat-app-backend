const validateAuth = (req, res, next) => {
    if (!req.body.username)
        return res.status(400).json({ message: "No username provided" });
    if (!req.body.password)
        return res.status(400).json({ message: "No password provided" });

    next();
};

module.exports = validateAuth;
