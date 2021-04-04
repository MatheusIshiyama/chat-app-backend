const validateCode = (req, res, next) => {
    if (!req.params.verifyCode)
        return res.status(400).json({ message: "No verifyCode provided" });

    if (req.params.verifyCode.length !== 172)
        return res.status(400).json({ message: "No verifyCode length accept" });

    next();
};

module.exports = validateCode;