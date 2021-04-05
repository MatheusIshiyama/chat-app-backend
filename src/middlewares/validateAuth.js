const validateAuth = (req, res, next) => {
    if (!req.body.username)
        return res.status(400).json({ error: "No username provided" });
    if (!req.body.password)
        return res.status(400).json({ error: "No password provided" });

    next();
};

module.exports = validateAuth;
