const validateCode = (req, res, next) => {
    const { code } = req.body;

    if (!code) return res.status(400).json({ error: "No code provided" });

    if (code.length !== 8)
        return res.status(400).json({ error: "No code length accept" });

    next();
};

module.exports = validateCode;
